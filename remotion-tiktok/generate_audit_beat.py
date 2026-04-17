"""
Audit beat: suspenseful intro → heavy drop at the "red flags" reveal.
Starts with just hi-hats + ambient, then kick+bass drop at frame 55 (~1.8s).
15s @ 44100Hz stereo 16-bit.
"""
import wave, struct, math

SR   = 44100
DUR  = 15.0
BPM  = 142
NS   = int(SR * DUR)
BEAT = int(SR * 60 / BPM)
BAR  = BEAT * 4
SIX  = BEAT // 4

DROP_SAMPLE = int(SR * 1.83)   # frame 55 @ 30fps

def clamp(v): return max(-0.97, min(0.97, v))

def kick(t):
    if t < 0 or t > 0.5: return 0.0
    click = math.exp(-t * 110) * 0.6
    freq  = 95 * math.exp(-t * 16) + 38
    body  = math.sin(2 * math.pi * freq * t) * math.exp(-t * 6) * 0.9
    return click + body

def snare(t):
    if t < 0 or t > 0.3: return 0.0
    noise = sum(math.sin(2*math.pi*(850 + k*489.3 + k*k*19.1)*t) for k in range(1,13))/12
    return noise * (math.exp(-t*55)*0.5 + math.exp(-t*11)*0.22)

def clap(t):
    if t < 0 or t > 0.09: return 0.0
    noise = sum(math.sin(2*math.pi*(2800+k*911.7)*t) for k in range(1,7))/6
    return noise * math.exp(-t*100) * 0.25

def hh_c(t):
    if t < 0 or t > 0.04: return 0.0
    n = sum(math.sin(2*math.pi*(7500+k*1997)*t) for k in range(1,9))/8
    return n * math.exp(-t*180) * 0.3

def hh_o(t):
    if t < 0 or t > 0.2: return 0.0
    n = sum(math.sin(2*math.pi*(5800+k*1733)*t) for k in range(1,10))/9
    return n * math.exp(-t*20) * 0.22

def bass(t, freq=49.0):
    if t < 0: return 0.0
    amp = min(1.0, t/0.006) * math.exp(-t*3.8)
    raw = math.sin(2*math.pi*freq*t)*0.75 + math.sin(2*math.pi*freq*2*t)*0.15
    raw *= 1.6
    if abs(raw) > 1: raw = math.copysign(1 - 1/(abs(raw)+0.01), raw)
    return raw * amp * 0.7

def suspense_pad(t):
    """Minor-key tension pad for the intro."""
    # A minor feel: A2, C3, E3 — minor triad, slow movement
    return (
        math.sin(2*math.pi*110*t)*0.08 +
        math.sin(2*math.pi*130.8*t)*0.05 +   # C3
        math.sin(2*math.pi*164.8*t)*0.04 +   # E3
        math.sin(2*math.pi*55*t)*0.07 +      # A1 sub
        math.sin(2*math.pi*110.1*t)*0.03     # slight detune for movement
    )

def tension_blip(t, freq=1100):
    """Short high beep for tension during intro."""
    if t < 0 or t > 0.05: return 0.0
    return math.sin(2*math.pi*freq*t) * math.exp(-t*70) * 0.15

def impact_hit(t):
    """Big impact at the drop."""
    if t < 0 or t > 0.3: return 0.0
    freq = 60 * math.exp(-t * 30) + 30
    return (
        math.sin(2*math.pi*freq*t) * math.exp(-t*8) * 0.8 +
        math.exp(-t*120) * 0.5   # click
    )

# ── Patterns (post-drop, 1 bar = 16 sixteenths) ───────────────────────────────
KICK_P  = [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]
SNARE_P = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
CLAP_P  = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]
HH_P    = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
HH_T    = [1,1,2,1, 1,1,1,1, 2,1,1,1, 1,1,2,1]  # 2=open
BASS_FS = [49.0, 55.0, 43.6, 51.9]  # G2 A2 F2 G#2 — minor walk

# Tension blips in intro (every 2 beats)
BLIP_FS = [880, 1100, 660, 1320]

print(f"Generating {DUR}s audit beat @ {BPM} BPM (drop @ {DROP_SAMPLE/SR:.2f}s)...")

bars_total = int(DUR * BPM / 60 / 4) + 2
kicks, snares, claps, hats, basses, blips = [], [], [], [], [], []

for bar in range(bars_total):
    bs = bar * BAR
    if bs >= DROP_SAMPLE:   # only schedule rhythm post-drop
        basses.append((bs, BASS_FS[bar % len(BASS_FS)], BAR))
        for step in range(16):
            ss = bs + step * SIX
            if ss >= NS: break
            if KICK_P[step]:  kicks.append(ss)
            if SNARE_P[step]: snares.append(ss)
            if CLAP_P[step]:  claps.append(ss)
            if HH_P[step]:    hats.append((ss, HH_T[step]))
    else:
        # Intro: just ambient hi-hats every beat + tension blips
        for b in range(4):
            ss = bs + b * BEAT
            if ss < NS: hats.append((ss, 1))
        # Blip every 2 beats
        for b in range(0, 4, 2):
            ss = bs + b * BEAT
            if ss < NS: blips.append((ss, BLIP_FS[(bar*2+b//2) % len(BLIP_FS)]))

# Impact hit exactly at drop
DROP_HIT = DROP_SAMPLE

left_ch, right_ch = [], []

for i in range(NS):
    t_abs = i / SR
    s = 0.0

    # Suspense pad fades out at drop
    fade = max(0.0, 1.0 - (i - DROP_SAMPLE) / (SR * 0.3)) if i > DROP_SAMPLE else 1.0
    s += suspense_pad(t_abs) * fade

    # Impact hit at drop
    if i >= DROP_HIT:
        s += impact_hit((i - DROP_HIT) / SR) * 0.6

    for k in kicks:
        if k <= i < k + BEAT: s += kick((i-k)/SR)

    for sn in snares:
        if sn <= i < sn + int(SR*0.3): s += snare((i-sn)/SR)

    for cl in claps:
        if cl <= i < cl + int(SR*0.09): s += clap((i-cl)/SR)

    for (hs, ht) in hats:
        dur = int(SR*(0.2 if ht==2 else 0.04))
        if hs <= i < hs+dur:
            s += hh_o((i-hs)/SR) if ht==2 else hh_c((i-hs)/SR)

    for (bs2, bf, bdur) in basses:
        if bs2 <= i < bs2+bdur: s += bass((i-bs2)/SR, freq=bf)

    for (bl, bf) in blips:
        dur = int(SR*0.05)
        if bl <= i < bl+dur: s += tension_blip((i-bl)/SR, freq=bf)

    s = clamp(s)
    left_ch.append(s)
    right_ch.append(s)

DELAY = 20
right_ch = [0.0]*DELAY + right_ch[:-DELAY]

out = "public/audit-beat.wav"
with wave.open(out, "w") as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    packed = bytearray()
    for l, r in zip(left_ch, right_ch):
        packed += struct.pack("<h", int(l*32767))
        packed += struct.pack("<h", int(r*32767))
    wf.writeframes(bytes(packed))

print(f"Done → {out}  ({NS} samples, {len(packed)//1024} KB)")
