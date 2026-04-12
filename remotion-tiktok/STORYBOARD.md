# Viral TikTok — Storyboard

**Format:** 1080 × 1920 (TikTok 9:16)  
**Duration:** 20 seconds @ 30fps (600 frames)  
**Theme:** "POV: You're learning ethical hacking" — cybersecurity journey

---

## Scene Map

```
Frame   0 ──────── 90 ──────────── 210 ──────────── 330 ──────────── 450 ─── 600
         │ SCENE 1  │   SCENE 2    │   SCENE 3      │   SCENE 4     │ SCENE 5│
         │  HOOK    │  TERMINAL    │  STAT BOMBS    │   SKILL BARS  │  CTA   │
         │  0–3s    │   3–7s       │   7–11s        │   11–15s      │ 15–20s │
```

---

## Scene Details

### Scene 1: Hook (0–3s)
- "POV:" zooms in with spring animation
- Glitch text reveal: *"You just discovered ethical hacking"*
- Red stamp badge: "🔐 your life changes now"
- Caption: "POV: you're on your way to OSCP 💀"

### Scene 2: Terminal (3–7s)
- Realistic terminal UI (Kali Linux style)
- Typing animation: `nmap -sV -sC -oA scan 10.10.10.125`
- Scan results appear line-by-line
- `gobuster` command + `/admin` panel discovery
- Caption: "this is what real hacking looks like"

### Scene 3: Stat Bombs (7–11s)
- **3.5M+** unfilled cybersecurity jobs (red, counting up)
- **$112,000** average US salary (green, counting up)
- **33%** industry growth over 10 years (white)
- Caption: "3.5 MILLION jobs. Zero excuses."

### Scene 4: Skill Bars (11–15s)
- Animated progress bars: Linux, Web App Pentesting, Active Directory, RE, Exploit Dev
- Slide-in cert cards: Security+, OSCP (goal), OSED
- Caption: "the grind never stops 🔥"

### Scene 5: CTA (15–20s)
- Pulsing lock icon in glowing ring
- "@chrisdaguilera" with green glow
- Hashtags: #OSCP #EthicalHacking #Cybersecurity
- Scrolling prompt: "↓ more hacking content ↓"
- Caption: "follow for more 👇"

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Remotion](https://remotion.dev) | React-based video engine |
| React 18 | Component model |
| Spring physics | Smooth entrance animations |
| CSS chromatic aberration | Glitch text effect |
| TypeScript | Type safety |

---

## Quick Start

```bash
cd remotion-tiktok
npm install
npm start          # opens Remotion Studio at localhost:3000
npm run render     # renders out/viral-tiktok.mp4
```
