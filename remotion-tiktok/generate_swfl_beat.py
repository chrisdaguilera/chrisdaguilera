"""
Generates an upbeat, energetic trap/pop beat for the SWFL insulation TikTok.
Vibe: summer Florida energy, punchy, hype — not dark phonk.
15 seconds @ 44100Hz stereo 16-bit.
"""

import wave, struct, math

SAMPLE_RATE = 44100
DURATION    = 15.0
BPM         = 145           # hype, energetic
NUM_SAMPLES = int(SAMPLE_RATE * DURATION)
BEAT        = int(SAMPLE_RATE * 60 / BPM)
BAR         = BEAT * 4
SIXTEENTH   = BEAT // 4

def clamp(v, lo=-0.98, hi=0.98):
    return max(lo, min(hi, v))

# ── Instruments ────────────────────────────────────────────────────────────────

def kick(t):
    if t < 0 or t > 0.45:
        return 0.0
    click = math.exp(-t * 130) * 0.55
    freq  = 100 * math.exp(-t * 18) + 40
    body  = math.sin(2 * math.pi * freq * t) * math.exp(-t * 7) * 0.85
    return click + body

def snare(t):
    if t < 0 or t > 0.28:
        return 0.0
    noise = sum(math.sin(2 * math.pi * (900 + k * 521.3 + k*k*17.7) * t) for k in range(1, 12)) / 11
    return noise * (math.exp(-t * 60) * 0.5 + math.exp(-t * 10) * 0.2)

def clap(t):
    """Layered clap on top of snare for brightness."""
    if t < 0 or t > 0.1:
        return 0.0
    noise = sum(math.sin(2 * math.pi * (2500 + k * 883.1) * t) for k in range(1, 8)) / 7
    return noise * math.exp(-t * 90) * 0.28

def hihat_c(t):
    if t < 0 or t > 0.035:
        return 0.0
    noise = sum(math.sin(2 * math.pi * (7000 + k * 2113.7) * t) for k in range(1, 9)) / 8
    return noise * math.exp(-t * 200) * 0.28

def hihat_o(t):
    if t < 0 or t > 0.18:
        return 0.0
    noise = sum(math.sin(2 * math.pi * (5500 + k * 1879.3) * t) for k in range(1, 11)) / 10
    return noise * math.exp(-t * 22) * 0.20

def bass(t, freq=55.0):
    """Punchy pop/trap bass — brighter than phonk."""
    if t < 0:
        return 0.0
    amp = min(1.0, t / 0.006) * math.exp(-t * 4.5)
    # Slightly brighter: mix fundamental + 2nd harmonic
    raw = math.sin(2 * math.pi * freq * t) * 0.7 + math.sin(2 * math.pi * freq * 2 * t) * 0.2
    # Soft clip
    raw *= 1.5
    if abs(raw) > 1:
        raw = math.copysign(1 - 1 / (abs(raw) + 0.01), raw)
    return raw * amp * 0.65

def synth_stab(t, freq=220.0):
    """Short bright synth stab for energy hits."""
    if t < 0 or t > 0.18:
        return 0.0
    tone = math.sin(2 * math.pi * freq * t) + 0.3 * math.sin(2 * math.pi * freq * 2 * t)
    return tone * math.exp(-t * 28) * 0.22

def pad(t):
    """Bright summer pad — major key atmosphere."""
    # C major feel: C3, E3, G3
    freqs = [130.8, 164.8, 196.0, 261.6]
    return sum(
        math.sin(2 * math.pi * f * t) * 0.04
        for f in freqs
    )

def riser(t_abs, riser_start, dur=1.5):
    """White noise riser building into a drop."""
    t = t_abs - riser_start
    if t < 0 or t > dur:
        return 0.0
    progress = t / dur
    freq_base = 200 + progress * 3000
    noise = sum(math.sin(2 * math.pi * (freq_base + k * 317.3) * t) for k in range(1, 6)) / 5
    return noise * progress * 0.12

# ── Beat patterns (16 steps = 1 bar) ─────────────────────────────────────────
KICK_PAT  = [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]
SNARE_PAT = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
CLAP_PAT  = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]
HAT_PAT   = [1,0,1,1, 1,0,1,1, 1,1,1,0, 1,0,1,1]  # 1=closed, 2=open on accents
HAT_TYPE  = [1,0,1,1, 1,0,1,1, 1,1,2,0, 1,0,1,1]

# Bass walk (bright major): G2 A2 C3 B2
BASS_FREQS = [98.0, 110.0, 130.8, 123.5]

# Stab hits: bars 2 and 4 at step 8
STAB_FREQS = [440.0, 554.4, 659.3]   # A4, C#5, E5 — A major bright chord

print(f"Generating {DURATION}s SWFL beat @ {BPM} BPM...")

# Build event lists
bars_total = int(DURATION * BPM / 60 / 4) + 2
kicks, snares, claps, hats, basses, stabs = [], [], [], [], [], []

for bar in range(bars_total):
    bar_s = bar * BAR
    basses.append((bar_s, BASS_FREQS[bar % len(BASS_FREQS)], BAR))

    for step in range(16):
        ss = bar_s + step * SIXTEENTH
        if KICK_PAT[step]:  kicks.append(ss)
        if SNARE_PAT[step]: snares.append(ss)
        if CLAP_PAT[step]:  claps.append(ss)
        if HAT_PAT[step]:
            hats.append((ss, HAT_TYPE[step]))
        # Stab on beat 3 of even bars
        if bar % 2 == 1 and step == 8:
            stabs.append((ss, STAB_FREQS[bar % len(STAB_FREQS)]))

# Riser at second 13 (building to end CTA)
RISER_START = 12.5

left_ch, right_ch = [], []

for i in range(NUM_SAMPLES):
    t_abs = i / SAMPLE_RATE
    s = 0.0

    s += pad(t_abs)

    for k in kicks:
        if k <= i < k + BEAT:
            s += kick((i - k) / SAMPLE_RATE)

    for sn in snares:
        if sn <= i < sn + int(SAMPLE_RATE * 0.28):
            s += snare((i - sn) / SAMPLE_RATE)

    for cl in claps:
        if cl <= i < cl + int(SAMPLE_RATE * 0.10):
            s += clap((i - cl) / SAMPLE_RATE)

    for (hs, ht) in hats:
        dur = int(SAMPLE_RATE * (0.18 if ht == 2 else 0.035))
        if hs <= i < hs + dur:
            t_hat = (i - hs) / SAMPLE_RATE
            s += hihat_o(t_hat) if ht == 2 else hihat_c(t_hat)

    for (bs, bf, bdur) in basses:
        if bs <= i < bs + bdur:
            s += bass((i - bs) / SAMPLE_RATE, freq=bf)

    for (st, sf) in stabs:
        dur = int(SAMPLE_RATE * 0.18)
        if st <= i < st + dur:
            s += synth_stab((i - st) / SAMPLE_RATE, freq=sf)

    s += riser(t_abs, RISER_START)

    s = clamp(s)
    left_ch.append(s)
    right_ch.append(s)

# Stereo spread
DELAY = 18
right_ch = [0.0] * DELAY + right_ch[:-DELAY]

out_path = "public/swfl-beat.wav"
with wave.open(out_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    packed = bytearray()
    for l, r in zip(left_ch, right_ch):
        packed += struct.pack("<h", int(l * 32767))
        packed += struct.pack("<h", int(r * 32767))
    wf.writeframes(bytes(packed))

print(f"Done → {out_path}  ({NUM_SAMPLES} samples, {len(packed)//1024} KB)")
