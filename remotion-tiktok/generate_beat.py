"""
Generates a dark phonk/trap beat as a WAV file using only Python stdlib.
Target: 20s @ 44100Hz, stereo, 16-bit — perfect for TikTok hacker vibes.
"""

import wave
import struct
import math

# ── Config ─────────────────────────────────────────────────────────────────────
SAMPLE_RATE = 44100
DURATION    = 20.0
BPM         = 138          # dark phonk tempo
NUM_SAMPLES = int(SAMPLE_RATE * DURATION)

BEAT        = int(SAMPLE_RATE * 60 / BPM)   # samples per beat
BAR         = BEAT * 4
SIXTEENTH   = BEAT // 4
THIRTYSEC   = BEAT // 8

# ── Helpers ────────────────────────────────────────────────────────────────────

def clamp(v, lo=-0.98, hi=0.98):
    return max(lo, min(hi, v))

def env_exp(t, attack=0.002, decay_rate=30):
    """Exponential decay envelope."""
    if t < 0:
        return 0.0
    a = min(t / attack, 1.0) if attack > 0 else 1.0
    return a * math.exp(-decay_rate * t)

# ── Instruments ────────────────────────────────────────────────────────────────

def kick(t):
    """808-style kick: click transient + pitch-swept sine body."""
    if t < 0 or t > 0.55:
        return 0.0
    click   = math.exp(-t * 120) * 0.6
    freq    = 80 * math.exp(-t * 14) + 28          # sweep 80→28 Hz
    phase   = 2 * math.pi * freq * t
    body    = math.sin(phase) * math.exp(-t * 5) * 0.9
    return click + body

def snare(t):
    """Reverb snare: noise burst + pitched crack."""
    if t < 0 or t > 0.35:
        return 0.0
    # Deterministic "noise" via dense inharmonic sine sum
    noise = sum(
        math.sin(2 * math.pi * (800 + k * 463.7 + k * k * 31.1) * t)
        for k in range(1, 14)
    ) / 13.0
    crack_env  = math.exp(-t * 55)
    tail_env   = math.exp(-t * 9)
    return (noise * crack_env * 0.45 + noise * tail_env * 0.18)

def hihat_closed(t):
    """Tight closed hi-hat."""
    if t < 0 or t > 0.04:
        return 0.0
    noise = sum(
        math.sin(2 * math.pi * (6000 + k * 1973.3) * t)
        for k in range(1, 10)
    ) / 9.0
    return noise * math.exp(-t * 180) * 0.32

def hihat_open(t):
    """Open hi-hat / cymbal wash."""
    if t < 0 or t > 0.22:
        return 0.0
    noise = sum(
        math.sin(2 * math.pi * (5000 + k * 2137.9) * t)
        for k in range(1, 12)
    ) / 11.0
    return noise * math.exp(-t * 18) * 0.22

def bass_808(t, freq=41.2):
    """Deep 808 sub bass with saturation."""
    if t < 0:
        return 0.0
    amp = min(1.0, t / 0.008) * math.exp(-t * 2.2)  # slow decay
    raw = math.sin(2 * math.pi * freq * t)
    # soft-clip saturation for that thick 808 sound
    saturated = raw * 1.8
    if abs(saturated) > 1:
        saturated = math.copysign(1 - 1 / (abs(saturated)), saturated)
    return saturated * amp * 0.75

def bass_note_for_bar(bar_idx):
    """Dark minor pentatonic bass walk: A1 B1 E1 F#1."""
    progression = [41.2, 46.2, 30.9, 34.6]   # Hz: E1 G#1 B0 D1
    return progression[bar_idx % len(progression)]

def pad_drone(t):
    """Atmospheric dark pad — layered detuned sines."""
    return (
        math.sin(2 * math.pi * 55.0 * t) * 0.07 +
        math.sin(2 * math.pi * 55.1 * t) * 0.05 +   # slight detune = chorus
        math.sin(2 * math.pi * 82.4 * t) * 0.05 +   # perfect fifth
        math.sin(2 * math.pi * 110.0 * t) * 0.04 +
        math.sin(2 * math.pi * 164.8 * t) * 0.025 +
        math.sin(2 * math.pi * 27.5 * t) * 0.06      # sub octave
    )

def glitch_blip(t, freq=880):
    """Short electronic blip for glitch texture."""
    if t < 0 or t > 0.06:
        return 0.0
    return math.sin(2 * math.pi * freq * t) * math.exp(-t * 60) * 0.18

# ── Phonk hi-hat pattern (16th notes with ghost rolls) ────────────────────────
# 1 = closed hat, 2 = open hat, 0 = rest
HAT_PATTERN = [1,0,1,1, 1,0,1,0, 1,1,1,0, 2,0,1,1]  # 16 steps (one bar)

# ── Kick pattern (one bar, 16 steps) ──────────────────────────────────────────
KICK_PATTERN = [1,0,0,0, 0,0,1,0, 0,0,0,1, 0,0,0,0]

# ── Snare pattern ──────────────────────────────────────────────────────────────
SNARE_PATTERN = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1]

# ── Glitch blip pattern ────────────────────────────────────────────────────────
BLIP_PATTERN = [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,1,0,0]
BLIP_FREQS   = [1760, 880, 1320, 2200]

# ── Synthesis ─────────────────────────────────────────────────────────────────

print(f"Generating {DURATION}s of phonk beat at {BPM} BPM...")

left_ch  = []
right_ch = []

# Pre-calculate note event times (sample index + type)
kicks  = []
snares = []
hats   = []   # (sample_idx, type)  type: 1=closed, 2=open
blips  = []   # (sample_idx, freq)
bass_events = []  # (sample_idx, freq, duration_samples)

bars_total = int(DURATION * BPM / 60 / 4) + 2

for bar in range(bars_total):
    bar_start = bar * BAR
    bar_freq  = bass_note_for_bar(bar)
    bass_events.append((bar_start, bar_freq, BAR))

    for step in range(16):
        step_start = bar_start + step * SIXTEENTH

        if KICK_PATTERN[step]:
            kicks.append(step_start)
        if SNARE_PATTERN[step]:
            snares.append(step_start)
        hat = HAT_PATTERN[step]
        if hat:
            hats.append((step_start, hat))
        if BLIP_PATTERN[step]:
            freq = BLIP_FREQS[step % len(BLIP_FREQS)]
            blips.append((step_start, freq))

# Build sample-by-sample
for i in range(NUM_SAMPLES):
    t_abs = i / SAMPLE_RATE
    s = 0.0

    # Pad drone (always on)
    s += pad_drone(t_abs)

    # Kicks
    for k in kicks:
        if k <= i < k + BEAT:
            s += kick((i - k) / SAMPLE_RATE)

    # Snares
    for sn in snares:
        if sn <= i < sn + int(SAMPLE_RATE * 0.35):
            s += snare((i - sn) / SAMPLE_RATE)

    # Hi-hats
    for (hs, ht) in hats:
        dur = int(SAMPLE_RATE * (0.22 if ht == 2 else 0.04))
        if hs <= i < hs + dur:
            t_hat = (i - hs) / SAMPLE_RATE
            s += hihat_open(t_hat) if ht == 2 else hihat_closed(t_hat)

    # Bass
    for (bs, bf, bdur) in bass_events:
        if bs <= i < bs + bdur:
            s += bass_808((i - bs) / SAMPLE_RATE, freq=bf)

    # Glitch blips
    for (bl, bf) in blips:
        dur = int(SAMPLE_RATE * 0.06)
        if bl <= i < bl + dur:
            s += glitch_blip((i - bl) / SAMPLE_RATE, freq=bf)

    s = clamp(s)

    # Light stereo spread (delay right channel ~0.5ms for width)
    left_ch.append(s)
    right_ch.append(s)  # will offset below

# Apply tiny stereo delay to right channel for width
DELAY_SAMPLES = 22  # ~0.5 ms
right_ch = [0.0] * DELAY_SAMPLES + right_ch[:-DELAY_SAMPLES]

# ── Write WAV ──────────────────────────────────────────────────────────────────
out_path = "public/beat.wav"
with wave.open(out_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)   # 16-bit
    wf.setframerate(SAMPLE_RATE)

    packed = bytearray()
    for l, r in zip(left_ch, right_ch):
        packed += struct.pack("<h", int(l * 32767))
        packed += struct.pack("<h", int(r * 32767))
    wf.writeframes(bytes(packed))

print(f"Done → {out_path}  ({NUM_SAMPLES} samples, {len(packed)//1024} KB)")
