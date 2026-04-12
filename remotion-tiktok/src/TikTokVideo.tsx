/**
 * TikTokVideo.tsx
 *
 * Viral TikTok — "POV: You're learning ethical hacking"
 * Format  : 1080 × 1920 (9:16)
 * Duration: 20 seconds @ 30fps = 600 frames
 *
 * Scene breakdown
 * ───────────────
 * Scene 1 │  0 –  90  │ Hook: "POV:" glitch reveal
 * Scene 2 │ 90 – 210   │ Terminal: nmap + exploit scan
 * Scene 3 │210 – 330   │ Stat bombs: salary, demand, certs
 * Scene 4 │330 – 450   │ Skill bars + journey progress
 * Scene 5 │450 – 600   │ CTA + username callout
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { GlitchText } from "./components/GlitchText";
import { Terminal } from "./components/Terminal";
import { CountUp } from "./components/CountUp";
import { PunchCard } from "./components/PunchCard";
import { ProgressBar } from "./components/ProgressBar";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const fadeIn = (frame: number, start: number, duration = 15) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, end: number, duration = 15) =>
  interpolate(frame, [end - duration, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── Background: scanline + noise overlay ────────────────────────────────────

const Background: React.FC<{ color?: string }> = ({ color = "#070707" }) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,255,65,0.015) 2px,
          rgba(0,255,65,0.015) 4px
        )
      `,
    }}
  />
);

// ─── TikTok-style caption bar ────────────────────────────────────────────────

const Caption: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  fontSize?: number;
  color?: string;
  bg?: string;
}> = ({
  text,
  startFrame,
  endFrame,
  fontSize = 52,
  color = "#000000",
  bg = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    fadeIn(frame, startFrame),
    fadeOut(frame, endFrame)
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        backgroundColor: bg,
        color,
        fontSize,
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        padding: "12px 28px",
        borderRadius: 8,
        opacity,
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: "-1px",
        maxWidth: "90%",
      }}
    >
      {text}
    </div>
  );
};

// ─── Scene 1: Hook ───────────────────────────────────────────────────────────

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const povScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
    durationInFrames: 20,
  });
  const povOpacity = fadeIn(frame, 0, 10);

  const lineOpacity = fadeIn(frame, 22, 12);
  const tagOpacity = fadeIn(frame, 45, 10);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 60px",
      }}
    >
      {/* "POV:" stamp */}
      <div
        style={{
          transform: `scale(${interpolate(povScale, [0, 1], [2.4, 1])})`,
          opacity: povOpacity,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            color: "#00ff41",
            letterSpacing: "-4px",
            textShadow: "0 0 40px #00ff4188",
          }}
        >
          POV:
        </div>
      </div>

      {/* Main hook text */}
      <div style={{ opacity: lineOpacity, textAlign: "center" }}>
        <GlitchText
          text="You just discovered"
          fontSize={62}
          color="#ffffff"
          glitchIntensity={0.8}
          style={{ display: "block", textAlign: "center" }}
        />
        <GlitchText
          text="ethical hacking"
          fontSize={72}
          color="#00ff41"
          glitchIntensity={1.2}
          style={{ display: "block", textAlign: "center" }}
        />
      </div>

      {/* Subtitle tag */}
      <div
        style={{
          opacity: tagOpacity,
          backgroundColor: "#ff0044",
          color: "#ffffff",
          fontSize: 32,
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          padding: "10px 24px",
          borderRadius: 6,
          letterSpacing: "2px",
          textTransform: "uppercase",
          transform: `rotate(-2deg)`,
        }}
      >
        🔐 your life changes now
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Terminal hacking demo ──────────────────────────────────────────

const SceneTerminal: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = fadeIn(frame, 0, 12);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "60px 50px",
        gap: 28,
      }}
    >
      {/* Scene label */}
      <div
        style={{
          opacity: headerOpacity,
          color: "#00ff41",
          fontSize: 28,
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        ▶ TryHackMe — Active Machine
      </div>

      <Terminal
        lines={[
          {
            prompt: "┌──(kali㉿kali)-[~]\n└─$ ",
            command: "nmap -sV -sC -oA scan 10.10.10.125",
            startFrame: 8,
            typingDuration: 45,
          },
          {
            output: "Starting Nmap 7.94 ( https://nmap.org )",
            color: "#888888",
            startFrame: 58,
          },
          {
            output: "PORT   STATE SERVICE  VERSION",
            color: "#888888",
            startFrame: 68,
          },
          {
            output: "22/tcp open  ssh      OpenSSH 7.9",
            color: "#aaaaaa",
            startFrame: 74,
          },
          {
            output: "80/tcp open  http     Apache 2.4.38",
            color: "#aaaaaa",
            startFrame: 80,
          },
          {
            output: "3306/tcp open  mysql   MySQL 5.7.28",
            color: "#ffaa00",
            startFrame: 86,
          },
          {
            prompt: "┌──(kali㉿kali)-[~]\n└─$ ",
            command: "gobuster dir -u http://10.10.10.125 -w rockyou.txt",
            startFrame: 100,
            typingDuration: 52,
          },
          {
            output: "/admin  (Status: 200)  [login panel found]",
            color: "#ff0044",
            startFrame: 162,
          },
          {
            output: "/backup  (Status: 200)  [interesting...]",
            color: "#ffaa00",
            startFrame: 170,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 3: Stat bombs ──────────────────────────────────────────────────────

const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 60px",
        gap: 0,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          color: "#888888",
          fontSize: 30,
          fontFamily: "Arial, sans-serif",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        why cybersecurity?
      </div>

      {/* Stat 1: unfilled jobs */}
      <div style={{ opacity: fadeIn(frame, 10, 12), textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            color: "#ff0044",
            fontSize: 36,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: 4,
          }}
        >
          UNFILLED JOBS WORLDWIDE
        </div>
        <CountUp
          from={0}
          to={3.5}
          suffix="M+"
          decimals={1}
          fontSize={140}
          color="#ff0044"
          startFrame={12}
          durationFrames={50}
        />
      </div>

      {/* Stat 2: avg salary */}
      <div style={{ opacity: fadeIn(frame, 50, 12), textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            color: "#00ff41",
            fontSize: 36,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: 4,
          }}
        >
          AVG US SALARY
        </div>
        <CountUp
          from={0}
          to={112000}
          prefix="$"
          fontSize={110}
          color="#00ff41"
          startFrame={52}
          durationFrames={50}
        />
      </div>

      {/* Stat 3: growth */}
      <div style={{ opacity: fadeIn(frame, 88, 12), textAlign: "center" }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: 4,
          }}
        >
          INDUSTRY GROWTH (10yr)
        </div>
        <CountUp
          from={0}
          to={33}
          suffix="%"
          fontSize={130}
          color="#ffffff"
          startFrame={90}
          durationFrames={40}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Skill progress ──────────────────────────────────────────────────

const SceneSkills: React.FC = () => {
  const frame = useCurrentFrame();

  const titleSlide = interpolate(
    spring({ frame, fps: 30, config: { damping: 18, stiffness: 100 }, durationInFrames: 25 }),
    [0, 1],
    [-60, 0]
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "70px 60px",
        gap: 0,
      }}
    >
      {/* Section header */}
      <div
        style={{
          transform: `translateY(${titleSlide}px)`,
          opacity: fadeIn(frame, 0, 15),
          marginBottom: 40,
        }}
      >
        <div
          style={{
            color: "#00ff41",
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          the roadmap
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 58,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Skills you'll{"\n"}unlock 🔓
        </div>
      </div>

      {/* Skill bars */}
      <div style={{ width: "100%" }}>
        <ProgressBar label="Linux & Networking" percent={95} color="#00ff41" startFrame={20} index={0} />
        <ProgressBar label="Web App Pentesting" percent={88} color="#ffaa00" startFrame={20} index={1} />
        <ProgressBar label="Active Directory" percent={78} color="#ff6600" startFrame={20} index={2} />
        <ProgressBar label="Reverse Engineering" percent={65} color="#ff0044" startFrame={20} index={3} />
        <ProgressBar label="Exploit Development" percent={55} color="#cc00ff" startFrame={20} index={4} />
      </div>

      {/* Cert cards */}
      <div style={{ marginTop: 36 }}>
        <PunchCard icon="🏆" label="Entry Level" value="CompTIA Security+" accentColor="#00ff41" startFrame={65} index={0} />
        <PunchCard icon="💀" label="Current Goal" value="OSCP — Offensive Security" accentColor="#ff0044" startFrame={65} index={1} />
        <PunchCard icon="🚀" label="Dream cert" value="OSED / OSEE" accentColor="#cc00ff" startFrame={65} index={2} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────────

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.4 },
    durationInFrames: 20,
  });

  const pulse =
    1 + interpolate(Math.sin((frame / 12) * Math.PI), [-1, 1], [-0.02, 0.02]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "60px 60px",
        background:
          "radial-gradient(ellipse at center, #0a1a0a 0%, #050805 100%)",
      }}
    >
      {/* Animated ring */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "3px solid #00ff41",
          boxShadow:
            "0 0 40px #00ff4188, 0 0 80px #00ff4144, inset 0 0 40px #00ff4122",
          transform: `scale(${interpolate(scaleIn, [0, 1], [0, 1])} )`,
          opacity: fadeIn(frame, 0, 18),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 88,
        }}
      >
        🔐
      </div>

      {/* Main CTA */}
      <div
        style={{
          opacity: fadeIn(frame, 15, 15),
          textAlign: "center",
          transform: `scale(${pulse})`,
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Follow the journey
        </div>
        <div
          style={{
            color: "#00ff41",
            fontSize: 68,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            textShadow: "0 0 30px #00ff4188",
            letterSpacing: "-2px",
          }}
        >
          @chrisdaguilera
        </div>
      </div>

      {/* Hashtags */}
      <div
        style={{
          opacity: fadeIn(frame, 35, 15),
          color: "#555555",
          fontSize: 26,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        #OSCP #EthicalHacking #Cybersecurity{"\n"}
        #TryHackMe #HackTheBox #CTF
      </div>

      {/* TikTok scroll hint */}
      <div
        style={{
          opacity:
            fadeIn(frame, 50, 10) *
            (0.5 + 0.5 * Math.sin((frame / 20) * Math.PI)),
          color: "#444",
          fontSize: 28,
          fontFamily: "Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
        }}
      >
        ↓ more hacking content ↓
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene transition overlay ─────────────────────────────────────────────────

const SceneFlash: React.FC<{ frame: number; triggerFrame: number }> = ({
  frame,
  triggerFrame,
}) => {
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 4, triggerFrame + 10],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#00ff41",
        opacity: opacity * 0.25,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const TikTokVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const transitions = [90, 210, 330, 450];

  return (
    <AbsoluteFill style={{ fontFamily: "Arial, sans-serif" }}>
      <Audio src={staticFile("beat.wav")} volume={0.85} />
      <Background />

      {/* Scene 1: Hook  (0–90) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>

      {/* Scene 2: Terminal (90–210) */}
      <Sequence from={90} durationInFrames={120}>
        <Background color="#050a05" />
        <SceneTerminal />
      </Sequence>

      {/* Scene 3: Stats (210–330) */}
      <Sequence from={210} durationInFrames={120}>
        <Background color="#0a0005" />
        <SceneStats />
      </Sequence>

      {/* Scene 4: Skills (330–450) */}
      <Sequence from={330} durationInFrames={120}>
        <Background color="#050a08" />
        <SceneSkills />
      </Sequence>

      {/* Scene 5: CTA (450–600) */}
      <Sequence from={450} durationInFrames={150}>
        <SceneCTA />
      </Sequence>

      {/* Flash transitions */}
      {transitions.map((t) => (
        <SceneFlash key={t} frame={frame} triggerFrame={t} />
      ))}

      {/* Always-on caption bar at bottom */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 40px 80px",
          pointerEvents: "none",
        }}
      >
        <Caption text="POV: you're on your way to OSCP 💀" startFrame={2} endFrame={85} bg="#ffffff" color="#000000" />
        <Caption text="this is what real hacking looks like" startFrame={92} endFrame={205} bg="#00ff41" color="#000000" />
        <Caption text="3.5 MILLION jobs. Zero excuses." startFrame={212} endFrame={325} bg="#ff0044" color="#ffffff" />
        <Caption text="the grind never stops 🔥" startFrame={332} endFrame={445} bg="#ffaa00" color="#000000" />
        <Caption text="follow for more 👇" startFrame={455} endFrame={595} bg="#ffffff" color="#000000" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
