"""
Thermal beat: cinematic build → satisfying drop when foam appears.
Starts tense/mysterious (low drone, sparse hits) → big energetic drop
at the foam scene (~6.5s in = frame 195).
18s @ 44100Hz stereo 16-bit.
"""
import wave, struct, math

SR   = 44100
DUR  = 18.0
BPM  = 140
NS   = int(SR * DUR)
BEAT = int(SR * 60 / BPM)
BAR  = BEAT * 4
SIX  = BEAT // 4

DROP_S = int(SR * 6.5)   # frame 195 @ 30fps

def clamp(v): return max(-0.97, min(0.97, v))

def kick(t):
    if t < 0 or t > 0.5: return 0.0
    return math.exp(-t*110)*0.55 + math.sin(2*math.pi*(90*math.exp(-t*16)+38)*t)*math.exp(-t*6)*0.9

def snare(t):
    if t < 0 or t > 0.28: return 0.0
    n = sum(math.sin(2*math.pi*(870+k*503+k*k*18)*t) for k in range(1,13))/12
    return n*(math.exp(-t*58)*0.5 + math.exp(-t*10)*0.22)

def clap(t):
    if t < 0 or t > 0.09: return 0.0
    n = sum(math.sin(2*math.pi*(2700+k*890)*t) for k in range(1,7))/6
    return n*math.exp(-t*95)*0.26

def hh(t, open_=False):
    dur = 0.2 if open_ else 0.038
    if t < 0 or t > dur: return 0.0
    n = sum(math.sin(2*math.pi*(6500+k*2011)*t) for k in range(1,10))/9
    rate = 20 if open_ else 190
    return n*math.exp(-t*rate)*(0.22 if open_ else 0.3)

def bass(t, freq=49.0):
    if t < 0: return 0.0
    amp = min(1.0,t/0.006)*math.exp(-t*3.5)
    raw = math.sin(2*math.pi*freq*t)*0.72 + math.sin(2*math.pi*freq*2*t)*0.18
    raw *= 1.55
    if abs(raw)>1: raw = math.copysign(1-1/(abs(raw)+0.01),raw)
    return raw*amp*0.68

def mystery_drone(t):
    """Eerie minor drone for the thermal scan intro."""
    return (
        math.sin(2*math.pi*55*t)*0.09 +
        math.sin(2*math.pi*55.15*t)*0.06 +
        math.sin(2*math.pi*82.4*t)*0.05 +
        math.sin(2*math.pi*138.6*t)*0.03 +  # minor 3rd
        math.sin(2*math.pi*27.5*t)*0.07
    )

def tension_tick(t, freq=1200):
    """Sparse ticking sound in the intro."""
    if t < 0 or t > 0.04: return 0.0
    return math.sin(2*math.pi*freq*t)*math.exp(-t*80)*0.18

def synth_stab(t, freq=220):
    if t < 0 or t > 0.2: return 0.0
    raw = math.sin(2*math.pi*freq*t)+0.3*math.sin(2*math.pi*freq*2*t)
    return raw*math.exp(-t*25)*0.2

def riser(t_abs, start, dur=1.0):
    t = t_abs - start
    if t < 0 or t > dur: return 0.0
    p = t/dur
    freq = 300 + p*4000
    n = sum(math.sin(2*math.pi*(freq+k*310)*t) for k in range(1,6))/5
    return n*p*0.14

# ── patterns ──────────────────────────────────────────────────────────────────
KICK_P  = [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]
SNARE_P = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
CLAP_P  = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]
HH_P    = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
HH_T    = [1,1,2,1, 1,1,1,1, 2,1,1,1, 1,1,2,1]
BASS_FS = [49.0, 55.0, 43.6, 51.9]
STAB_FS = [440.0, 523.3, 659.3]

# Intro ticks: sparse, every beat
TICK_FS = [1200, 900, 1500, 800]

print(f"Generating {DUR}s thermal beat @ {BPM} BPM (drop @ {DROP_S/SR:.1f}s)...")

bars = int(DUR*BPM/60/4)+2
kicks,snares,claps,hats,basses,stabs,ticks = [],[],[],[],[],[],[]

for bar in range(bars):
    bs = bar*BAR
    if bs >= DROP_S:
        basses.append((bs, BASS_FS[bar%len(BASS_FS)], BAR))
        for step in range(16):
            ss = bs+step*SIX
            if ss >= NS: break
            if KICK_P[step]:  kicks.append(ss)
            if SNARE_P[step]: snares.append(ss)
            if CLAP_P[step]:  claps.append(ss)
            if HH_P[step]:    hats.append((ss, HH_T[step]))
        if bar%2==1: stabs.append((bs+8*SIX, STAB_FS[(bar//2)%len(STAB_FS)]))
    else:
        # intro: tick every beat
        for b in range(4):
            ss = bs+b*BEAT
            if ss < NS: ticks.append((ss, TICK_FS[(bar*4+b)%len(TICK_FS)]))

# Riser just before drop
RISER_START = DROP_S/SR - 1.2

left_ch, right_ch = [], []
for i in range(NS):
    t = i/SR
    s = 0.0

    # Drone fades out at drop
    drone_fade = max(0.0, 1-(i-DROP_S)/(SR*0.4)) if i > DROP_S else 1.0
    s += mystery_drone(t)*drone_fade

    # Impact at drop
    if i >= DROP_S:
        s += kick((i-DROP_S)/SR)*0.5

    s += riser(t, RISER_START)

    for k in kicks:
        if k<=i<k+BEAT: s += kick((i-k)/SR)
    for sn in snares:
        if sn<=i<sn+int(SR*0.28): s += snare((i-sn)/SR)
    for cl in claps:
        if cl<=i<cl+int(SR*0.09): s += clap((i-cl)/SR)
    for (hs,ht) in hats:
        dur = int(SR*(0.2 if ht==2 else 0.038))
        if hs<=i<hs+dur: s += hh((i-hs)/SR, ht==2)
    for (bs2,bf,bd) in basses:
        if bs2<=i<bs2+bd: s += bass((i-bs2)/SR, bf)
    for (st,sf) in stabs:
        if st<=i<st+int(SR*0.2): s += synth_stab((i-st)/SR, sf)
    for (tk,tf) in ticks:
        if tk<=i<tk+int(SR*0.04): s += tension_tick((i-tk)/SR, tf)

    s = clamp(s)
    left_ch.append(s)
    right_ch.append(s)

D=20; right_ch=[0.0]*D+right_ch[:-D]

out="public/thermal-beat.wav"
with wave.open(out,"w") as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    p=bytearray()
    for l,r in zip(left_ch,right_ch):
        p+=struct.pack("<h",int(l*32767)); p+=struct.pack("<h",int(r*32767))
    wf.writeframes(bytes(p))
print(f"Done → {out}  ({NS} samples, {len(p)//1024} KB)")
