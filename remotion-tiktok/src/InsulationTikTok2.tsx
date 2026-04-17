/**
 * InsulationTikTok2.tsx
 *
 * Viral TikTok #2 — "Home Insulation Audit" | Ideal Insulation SWFL
 * Format  : 1080 × 1920  (9:16 TikTok)
 * Duration: 15 seconds @ 30fps = 450 frames
 *
 * Hook format: "Checklist audit" — viewer self-qualifies, drives comments & DMs
 *
 * Scene breakdown
 * ──────────────────────────────────────────────────────────
 * Scene 1 │  0 –  55  │ HOOK   — "Rate your SWFL home 1–10"
 * Scene 2 │ 55 – 195  │ RED FLAGS — animated ❌ checklist (fail items)
 * Scene 3 │195 – 300  │ REVEAL — "If you failed any of these..."
 * Scene 4 │300 – 390  │ NUMBERS — before vs after split card
 * Scene 5 │390 – 450  │ CTA    — free audit, SWFL
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  interpolate,
  spring,
} from "remotion";
import { CountUp } from "./components/CountUp";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  red:    "#ff2d2d",
  green:  "#00d46a",
  gold:   "#ffd000",
  white:  "#ffffff",
  dark:   "#060606",
  grey:   "#111111",
  orange: "#ff6b00",
  blue:   "#00b4ff",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fi = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const sp = (frame: number, startFrame: number, fps: number, stiffness = 160, damping = 20) =>
  spring({ frame: Math.max(0, frame - startFrame), fps, config: { stiffness, damping, mass: 0.5 }, durationInFrames: 22 });

// ─── Caption bar ──────────────────────────────────────────────────────────────
const Caption: React.FC<{ text: string; start: number; end: number; bg?: string; color?: string }> = ({
  text, start, end, bg = C.white, color = C.dark,
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const opacity = interpolate(frame, [start, start + 12, end - 8, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      backgroundColor: bg, color, opacity,
      fontSize: 46, fontFamily: "'Arial Black', Arial, sans-serif",
      fontWeight: 900, padding: "12px 28px", borderRadius: 8,
      textAlign: "center", letterSpacing: "-1px", maxWidth: "94%",
    }}>
      {text}
    </div>
  );
};

// ─── Audit item (❌ or ✅) ────────────────────────────────────────────────────
const AuditItem: React.FC<{
  pass: boolean;
  text: string;
  sub?: string;
  startFrame: number;
  index: number;
}> = ({ pass, text, sub, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prog = sp(frame, startFrame + index * 14, fps, 180, 18);
  const opacity = interpolate(prog, [0, 1], [0, 1]);
  const scale  = interpolate(prog, [0, 1], [0.6, 1]);
  const iconBg = pass ? C.green : C.red;
  const icon   = pass ? "✓" : "✕";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18,
      opacity, transform: `scale(${scale})`,
      backgroundColor: pass ? "#001a0a" : "#1a0000",
      border: `2px solid ${pass ? C.green : C.red}44`,
      borderLeft: `6px solid ${pass ? C.green : C.red}`,
      borderRadius: 12, padding: "18px 22px",
      marginBottom: 14,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        backgroundColor: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, fontWeight: 900, color: C.white, flexShrink: 0,
        boxShadow: `0 0 16px ${iconBg}66`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: C.white, fontSize: 32, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.15 }}>
          {text}
        </div>
        {sub && <div style={{ color: "#666", fontSize: 22, fontFamily: "Arial, sans-serif", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
};

// ─── Scene 1: HOOK ────────────────────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = sp(frame, 0, fps, 220, 11);
  const titleOp = fi(frame, 16, 12);
  const subOp   = fi(frame, 30, 12);
  const tagOp   = fi(frame, 42, 10);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #0a0a00 0%, #060606 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 22, padding: "0 56px",
    }}>
      {/* Score graphic */}
      <div style={{
        width: 220, height: 220, borderRadius: "50%",
        border: `8px solid ${C.gold}`,
        boxShadow: `0 0 50px ${C.gold}55`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(scaleIn, [0, 1], [0, 1])})`,
        opacity: fi(frame, 0, 10),
        background: "radial-gradient(ellipse, #1a1400 0%, #0a0a00 100%)",
      }}>
        <div style={{ fontSize: 26, fontFamily: "Arial, sans-serif", color: "#888", letterSpacing: "2px" }}>YOUR HOME</div>
        <div style={{ fontSize: 90, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, color: C.gold, lineHeight: 1 }}>?/10</div>
      </div>

      {/* Hook text */}
      <div style={{ textAlign: "center", opacity: titleOp }}>
        <div style={{ color: C.white, fontSize: 68, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Rate your{"\n"}SWFL home's{"\n"}
          <span style={{ color: C.gold }}>insulation</span>
        </div>
      </div>

      <div style={{ opacity: subOp, color: "#777", fontSize: 30, fontFamily: "Arial, sans-serif", textAlign: "center" }}>
        Most homeowners don't know their score
      </div>

      <div style={{
        opacity: tagOp,
        backgroundColor: C.red,
        color: C.white,
        fontSize: 34, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900,
        padding: "12px 28px", borderRadius: 8, letterSpacing: "1px",
        transform: "rotate(-1.5deg)",
      }}>
        👇 Take the 10-second audit
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: RED FLAGS CHECKLIST ─────────────────────────────────────────────
const SceneRedFlags: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0f0000 0%, #060606 100%)",
      padding: "52px 48px",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ opacity: fi(frame, 0, 12), marginBottom: 24 }}>
        <div style={{ color: C.red, fontSize: 26, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>
          🚨 red flags
        </div>
        <div style={{ color: C.white, fontSize: 58, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Fail any of these?{"\n"}
          <span style={{ color: C.red }}>You're losing money.</span>
        </div>
      </div>

      <div>
        <AuditItem pass={false} text="AC bill over $200/month" sub="Florida avg should be $110–140" startFrame={18} index={0} />
        <AuditItem pass={false} text="Rooms feel hot or uneven" sub="Sign of air leaks & poor R-value" startFrame={18} index={1} />
        <AuditItem pass={false} text="Home built before 2010" sub="Likely under current code R-values" startFrame={18} index={2} />
        <AuditItem pass={false} text="AC runs all day in summer" sub="Over-working = shorter lifespan" startFrame={18} index={3} />
        <AuditItem pass={false} text="Never upgraded insulation" sub="Original install is rarely optimal" startFrame={18} index={4} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: REVEAL ──────────────────────────────────────────────────────────
const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bounceIn = sp(frame, 0, fps, 200, 12);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #000f05 0%, #060606 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 28, padding: "60px 56px",
    }}>
      {/* Big reveal stamp */}
      <div style={{
        textAlign: "center",
        transform: `scale(${interpolate(bounceIn, [0, 1], [0.2, 1])})`,
        opacity: fi(frame, 0, 12),
      }}>
        <div style={{ fontSize: 100 }}>😬</div>
        <div style={{
          color: C.white, fontSize: 62,
          fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900,
          lineHeight: 1.1,
        }}>
          If you checked{"\n"}
          <span style={{ color: C.red }}>even one</span>
          {"\n"}of those...
        </div>
      </div>

      {/* Money stat */}
      <div style={{ opacity: fi(frame, 24, 12), textAlign: "center" }}>
        <div style={{ color: "#888", fontSize: 28, fontFamily: "Arial", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>
          you're likely losing
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
          <CountUp from={0} to={1800} prefix="$" suffix="/yr" fontSize={100} color={C.red} startFrame={26} durationFrames={45} />
        </div>
        <div style={{ color: "#666", fontSize: 26, fontFamily: "Arial", marginTop: 4 }}>in wasted energy every year</div>
      </div>

      {/* Good news */}
      <div style={{
        opacity: fi(frame, 56, 12),
        backgroundColor: "#001a08",
        border: `2px solid ${C.green}44`,
        borderRadius: 14, padding: "22px 28px", width: "100%",
      }}>
        <div style={{ color: C.green, fontSize: 24, fontFamily: "Arial", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 8 }}>
          ✅ the good news
        </div>
        <div style={{ color: C.white, fontSize: 36, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.2 }}>
          It's 100% fixable.{"\n"}Most jobs done{" "}
          <span style={{ color: C.green }}>in one day.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: BEFORE vs AFTER ─────────────────────────────────────────────────
const SceneNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = fi(frame, 0, 12);

  const Card: React.FC<{
    label: string;
    labelColor: string;
    bg: string;
    border: string;
    items: { icon: string; stat: string; desc: string }[];
    startFrame: number;
  }> = ({ label, labelColor, bg, border, items, startFrame }) => {
    const prog = sp(frame, startFrame, fps, 140, 22);
    return (
      <div style={{
        flex: 1,
        backgroundColor: bg,
        border: `3px solid ${border}`,
        borderRadius: 16, padding: "20px 18px",
        transform: `translateY(${interpolate(prog, [0, 1], [50, 0])}px)`,
        opacity: interpolate(prog, [0, 1], [0, 1]),
      }}>
        <div style={{ color: labelColor, fontSize: 24, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, textAlign: "center", letterSpacing: "2px", marginBottom: 16, textTransform: "uppercase" }}>
          {label}
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 34 }}>{item.icon}</div>
            <div style={{ color: C.white, fontSize: 30, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.1 }}>{item.stat}</div>
            <div style={{ color: "#666", fontSize: 20, fontFamily: "Arial" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #050505 0%, #060606 100%)",
      padding: "55px 44px",
      display: "flex", flexDirection: "column", gap: 24,
    }}>
      <div style={{ opacity: headerOp }}>
        <div style={{ color: C.gold, fontSize: 28, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>the difference</div>
        <div style={{ color: C.white, fontSize: 58, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Before vs After{"\n"}
          <span style={{ color: C.gold }}>Ideal Insulation</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        <Card
          label="❌ Before"
          labelColor={C.red}
          bg="#120000"
          border={`${C.red}55`}
          startFrame={14}
          items={[
            { icon: "🌡️", stat: "$220+/mo", desc: "energy bill" },
            { icon: "😓", stat: "140°F", desc: "attic temp" },
            { icon: "🔄", stat: "All day", desc: "AC runtime" },
          ]}
        />
        <Card
          label="✅ After"
          labelColor={C.green}
          bg="#001208"
          border={`${C.green}55`}
          startFrame={22}
          items={[
            { icon: "💰", stat: "$130/mo", desc: "energy bill" },
            { icon: "❄️", stat: "85°F", desc: "attic temp" },
            { icon: "✅", stat: "60% less", desc: "AC runtime" },
          ]}
        />
      </div>

      {/* ROI callout */}
      <div style={{
        opacity: fi(frame, 52, 12),
        backgroundColor: "#0a0a00",
        border: `2px solid ${C.gold}44`,
        borderRadius: 12, padding: "18px 22px",
        textAlign: "center",
      }}>
        <div style={{ color: C.gold, fontSize: 32, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>
          💰 Pays for itself in 2–3 years
        </div>
        <div style={{ color: "#777", fontSize: 22, fontFamily: "Arial", marginTop: 4 }}>
          Most SWFL homeowners see ROI in year 2
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = sp(frame, 0, fps, 200, 12);
  const pulse   = 1 + interpolate(Math.sin((frame / 13) * Math.PI), [-1, 1], [-0.02, 0.02]);

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, #0a1200 0%, #040804 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 28, padding: "60px 60px",
    }}>
      {/* Score reveal */}
      <div style={{
        opacity: fi(frame, 0, 14),
        transform: `scale(${interpolate(scaleIn, [0, 1], [0.2, 1])})`,
        textAlign: "center",
      }}>
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          border: `7px solid ${C.green}`,
          boxShadow: `0 0 50px ${C.green}55`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto",
          background: "radial-gradient(ellipse, #001a08 0%, #040804 100%)",
        }}>
          <div style={{ fontSize: 22, color: "#888", letterSpacing: "1px" }}>YOUR SCORE</div>
          <div style={{ fontSize: 80, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, color: C.green, lineHeight: 1 }}>10</div>
          <div style={{ fontSize: 22, color: C.green, letterSpacing: "1px" }}>after us ✓</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        opacity: fi(frame, 18, 12),
        transform: `scale(${pulse})`,
        width: "100%",
        backgroundColor: C.green,
        color: C.dark,
        fontSize: 46, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900,
        padding: "22px 36px", borderRadius: 14,
        textAlign: "center", lineHeight: 1.15,
        boxShadow: `0 0 50px ${C.green}66`,
        letterSpacing: "-1px",
      }}>
        FREE Home Audit
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
          🏠 We come to you — SWFL
        </div>
      </div>

      {/* Company name */}
      <div style={{ opacity: fi(frame, 28, 12), textAlign: "center" }}>
        <div style={{ color: C.white, fontSize: 48, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, letterSpacing: "-1px" }}>
          Ideal Insulation
        </div>
        <div style={{ color: C.green, fontSize: 26, fontFamily: "Arial, sans-serif", letterSpacing: "3px" }}>
          SOUTHWEST FLORIDA
        </div>
      </div>

      {/* Hashtags */}
      <div style={{
        opacity: fi(frame, 38, 12),
        color: "#444", fontSize: 22, fontFamily: "Arial, sans-serif",
        textAlign: "center", lineHeight: 1.6,
      }}>
        #HomeInsulation #SWFLHomes #SprayFoam{"\n"}
        #EnergyEfficiency #SouthFloridaContractor
      </div>
    </AbsoluteFill>
  );
};

// ─── Flash transition ─────────────────────────────────────────────────────────
const Flash: React.FC<{ triggerFrame: number; color?: string }> = ({ triggerFrame, color = C.white }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [triggerFrame, triggerFrame + 3, triggerFrame + 10], [0, 0.4, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: color, opacity, pointerEvents: "none" }} />;
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const InsulationTikTok2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.dark }}>
      <Audio src={staticFile("audit-beat.wav")} volume={0.82} />

      <Sequence from={0}   durationInFrames={55}>  <SceneHook />      </Sequence>
      <Sequence from={55}  durationInFrames={140}> <SceneRedFlags />  </Sequence>
      <Sequence from={195} durationInFrames={105}> <SceneReveal />    </Sequence>
      <Sequence from={300} durationInFrames={90}>  <SceneNumbers />   </Sequence>
      <Sequence from={390} durationInFrames={60}>  <SceneCTA />       </Sequence>

      {[55, 195, 300, 390].map((t) => <Flash key={t} triggerFrame={t} />)}

      {/* Captions */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", alignItems: "center",
        padding: "0 40px 80px", pointerEvents: "none",
      }}>
        <Caption text="Rate your SWFL home's insulation 🏠" start={2}   end={50}  bg={C.gold}  color={C.dark} />
        <Caption text="Fail any of these = $$$ wasted 🚨"   start={57}  end={190} bg={C.red}   color={C.white} />
        <Caption text="You could be losing $1,800/yr 😬"    start={197} end={295} bg={C.white} color={C.dark} />
        <Caption text="Bills drop. Comfort goes up. ✅"     start={302} end={385} bg={C.green} color={C.dark} />
        <Caption text="Free home audit — link in bio 🔗"    start={392} end={445} bg={C.gold}  color={C.dark} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
