"""
Spray foam ASMR: realistic hiss + low-rumble expansion + periodic spray bursts.
No music — pure contractor POV audio. 18s @ 44100Hz stereo 16-bit.

Layers:
  - Pink-ish filtered noise (the continuous hiss of the gun)
  - Sub rumble at 40-55Hz (the foam expanding, mic proximity effect)
  - Periodic "spritz" bursts every 2-4s (trigger pulls)
  - Subtle room tone / reverb tail
"""
import wave, struct, math, random

random.seed(42)

SR  = 44100
DUR = 18.0
NS  = int(SR * DUR)

def clamp(v): return max(-0.97, min(0.97, v))

# Pre-gen a long noise buffer we can index into for both hiss + bursts
NOISE = [random.uniform(-1, 1) for _ in range(NS + 1024)]

# Simple one-pole lowpass state for pink-ish shaping
def lp(buf, cutoff_hz):
    out = [0.0]*len(buf)
    a = math.exp(-2*math.pi*cutoff_hz/SR)
    y = 0.0
    for i,x in enumerate(buf):
        y = a*y + (1-a)*x
        out[i] = y
    return out

def hp(buf, cutoff_hz):
    out = [0.0]*len(buf)
    a = math.exp(-2*math.pi*cutoff_hz/SR)
    y = 0.0; prev = 0.0
    for i,x in enumerate(buf):
        y = a*(y + x - prev)
        prev = x
        out[i] = y
    return out

print("Shaping hiss layer...")
# Core hiss: bandpassed noise around 2-6kHz with slow amplitude modulation
hiss_raw = NOISE[:NS]
hiss_lp  = lp(hiss_raw, 6000)
hiss_bp  = hp(hiss_lp, 1800)   # bandpass-ish

# Slow amplitude wobble (operator movement, trigger pressure)
def hiss_env(i):
    t = i/SR
    return 0.42 + 0.08*math.sin(2*math.pi*0.23*t) + 0.05*math.sin(2*math.pi*0.61*t + 1.3)

print("Shaping low expansion rumble...")
# Sub-rumble: low sine wave modulated by noise amplitude (foam cells popping)
def rumble(i):
    t = i/SR
    base = math.sin(2*math.pi*46*t)*0.22 + math.sin(2*math.pi*58*t)*0.12
    # crackle modulation
    crack = NOISE[i] * 0.08 if (NOISE[i] > 0.6) else 0.0
    return base*(0.55 + 0.15*math.sin(2*math.pi*0.4*t)) + crack

print("Planning spray bursts...")
# Spray bursts: shorter hisses that spike on top. Trigger pulls ~every 2-4s
burst_times = []
t = 1.2
while t < DUR - 0.5:
    burst_times.append(t)
    t += random.uniform(1.8, 3.6)
print(f"  {len(burst_times)} bursts at: {[round(b,1) for b in burst_times]}")

def burst_env(local_t, dur):
    if local_t < 0 or local_t > dur: return 0.0
    # Fast attack, slow-ish decay
    attack = min(1.0, local_t/0.015)
    decay  = math.exp(-(local_t-0.015)*3.2) if local_t > 0.015 else 1.0
    return attack*decay

print("Mixing final buffer...")
left, right = [], []
for i in range(NS):
    t = i/SR

    # Continuous hiss
    s = hiss_bp[i] * hiss_env(i)

    # Sub rumble
    s += rumble(i)

    # Add spray bursts on top (extra hiss + tiny click)
    for bt in burst_times:
        local = t - bt
        dur = random.uniform(0.45, 0.9) if bt < DUR-2 else 0.5
        e = burst_env(local, dur)
        if e > 0:
            # burst = hp-filtered noise chunk, louder
            idx = i % len(NOISE)
            s += NOISE[idx] * 0.55 * e
            # initial "ptt" click
            if local < 0.008:
                s += NOISE[idx] * 0.9 * (1 - local/0.008)

    # Fade in over first 0.3s, fade out last 0.4s
    if t < 0.3:
        s *= t/0.3
    if t > DUR - 0.4:
        s *= (DUR - t)/0.4

    s = clamp(s * 0.78)
    left.append(s)
    right.append(s)

# Stereo width: tiny delay + decorrelation on right channel
print("Applying stereo decorrelation...")
D = 31
right = [0.0]*D + right[:-D]
# Slight amplitude wobble on right channel (breathing)
for i in range(len(right)):
    right[i] = right[i] * (1.0 + 0.04*math.sin(2*math.pi*0.17*i/SR))

out = "public/foam-asmr.wav"
print(f"Writing {out}...")
with wave.open(out, "w") as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    packed = bytearray()
    for l, r in zip(left, right):
        packed += struct.pack("<h", int(clamp(l)*32767))
        packed += struct.pack("<h", int(clamp(r)*32767))
    wf.writeframes(bytes(packed))
print(f"Done → {out}  ({NS} samples, {len(packed)//1024} KB)")
