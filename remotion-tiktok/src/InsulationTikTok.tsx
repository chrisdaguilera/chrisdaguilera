/**
 * InsulationTikTok.tsx
 *
 * Viral TikTok — Lead gen for Ideal Insulation | SWFL
 * Format  : 1080 × 1920  (9:16 TikTok)
 * Duration: 15 seconds @ 30fps = 450 frames
 *
 * Scene breakdown
 * ──────────────────────────────────────────────────────────
 * Scene 1 │  0 –  60  │ HOOK   — pain-point scroll-stop
 * Scene 2 │ 60 – 165  │ PROBLEM — Florida heat facts
 * Scene 3 │165 – 285  │ SOLUTION — what spray foam does
 * Scene 4 │285 – 375  │ PROOF  — savings + services
 * Scene 5 │375 – 450  │ CTA    — free estimate, SWFL
 * ──────────────────────────────────────────────────────────
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
  heat:    "#ff4400",   // Florida sun orange-red
  cool:    "#00b4ff",   // cool blue — AC / savings
  green:   "#00d46a",   // money / savings green
  white:   "#ffffff",
  black:   "#000000",
  dark:    "#090909",
  yellow:  "#ffe600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fi = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fo = (frame: number, end: number, dur = 10) =>
  interpolate(frame, [end - dur, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const vis = (frame: number, start: number, end: number) =>
  Math.min(fi(frame, start), fo(frame, end));

// ─── Reusable atoms ───────────────────────────────────────────────────────────

const BoldLabel: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  bg?: string;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ text, fontSize = 52, color = C.black, bg = C.white, rotate = 0, style = {} }) => (
  <div
    style={{
      backgroundColor: bg,
      color,
      fontSize,
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontWeight: 900,
      padding: "14px 32px",
      borderRadius: 10,
      letterSpacing: "-1px",
      lineHeight: 1.15,
      textAlign: "center",
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {text}
  </div>
);

const Caption: React.FC<{ text: string; start: number; end: number; bg?: string; color?: string }> = ({
  text, start, end, bg = C.white, color = C.black,
}) => {
  const frame = useCurrentFrame();
  const opacity = vis(frame, start, end);
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        backgroundColor: bg,
        color,
        fontSize: 48,
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        padding: "12px 28px",
        borderRadius: 8,
        opacity,
        textAlign: "center",
        letterSpacing: "-1px",
        maxWidth: "92%",
      }}
    >
      {text}
    </div>
  );
};

// Animated thermometer
const Thermometer: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fill = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 40, mass: 1 },
    durationInFrames: 60,
  });
  const fillPct = interpolate(fill, [0, 1], [10, 90]);
  const tempVal = interpolate(fill, [0, 1], [72, 140]);
  const bulbColor = interpolate(fill, [0, 1], [0, 1]);
  const col = `rgb(${Math.round(interpolate(bulbColor, [0, 1], [80, 255]))}, ${Math.round(interpolate(bulbColor, [0, 1], [160, 50]))}, ${Math.round(interpolate(bulbColor, [0, 1], [220, 20]))})`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Temp readout */}
      <div
        style={{
          color: col,
          fontSize: 90,
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          textShadow: `0 0 30px ${col}88`,
          lineHeight: 1,
        }}
      >
        {Math.round(tempVal)}°F
      </div>

      {/* Thermometer body */}
      <div style={{ position: "relative", width: 60, height: 300 }}>
        {/* Tube background */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 28,
            height: 260,
            top: 0,
            backgroundColor: "#222",
            borderRadius: 14,
            border: "3px solid #444",
            overflow: "hidden",
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: `${fillPct}%`,
              background: `linear-gradient(to top, ${col}, ${col}88)`,
              transition: "none",
            }}
          />
        </div>
        {/* Bulb */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: col,
            boxShadow: `0 0 20px ${col}`,
          }}
        />
      </div>

      <div
        style={{
          color: "#888",
          fontSize: 26,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        SWFL attic temperature
      </div>
    </div>
  );
};

// Animated checkmark list
const CheckList: React.FC<{
  items: { label: string; sub?: string }[];
  startFrame: number;
  accentColor?: string;
}> = ({ items, startFrame, accentColor = C.cool }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 10;
        const prog = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 20, stiffness: 150 },
          durationInFrames: 20,
        });
        const opacity = interpolate(prog, [0, 1], [0, 1]);
        const tx = interpolate(prog, [0, 1], [-50, 0]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity,
              transform: `translateX(${tx}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 24,
                fontWeight: 900,
                color: C.black,
              }}
            >
              ✓
            </div>
            <div>
              <div
                style={{
                  color: C.white,
                  fontSize: 34,
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </div>
              {item.sub && (
                <div style={{ color: "#888", fontSize: 24, fontFamily: "Arial, sans-serif" }}>
                  {item.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Scene 1: HOOK ────────────────────────────────────────────────────────────

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stamp = spring({ frame, fps, config: { damping: 10, stiffness: 220, mass: 0.4 }, durationInFrames: 18 });
  const stampScale = interpolate(stamp, [0, 1], [2.8, 1]);
  const stampOpacity = interpolate(stamp, [0, 1], [0, 1]);

  const line1Op = fi(frame, 20, 12);
  const line2Op = fi(frame, 34, 12);
  const line3Op = fi(frame, 46, 12);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0000 0%, #1a0000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "0 56px",
      }}
    >
      {/* Emoji fire stamp */}
      <div
        style={{
          fontSize: 110,
          transform: `scale(${stampScale})`,
          opacity: stampOpacity,
          lineHeight: 1,
        }}
      >
        🔥
      </div>

      {/* Hook lines */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            opacity: line1Op,
            color: "#999",
            fontSize: 32,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          SWFL homeowners —
        </div>

        <div
          style={{
            opacity: line2Op,
            color: C.white,
            fontSize: 72,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 14,
          }}
        >
          Why is your
          <br />
          <span style={{ color: C.heat }}>AC bill</span>
          <br />
          so high?
        </div>

        <div
          style={{
            opacity: line3Op,
            backgroundColor: C.yellow,
            color: C.black,
            fontSize: 36,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            padding: "10px 26px",
            borderRadius: 8,
            display: "inline-block",
            transform: "rotate(-1.5deg)",
          }}
        >
          👇 Watch this first
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: PROBLEM ─────────────────────────────────────────────────────────

const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOp = fi(frame, 0, 12);
  const thermoOp = fi(frame, 10, 15);
  const factOp   = fi(frame, 55, 12);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #100500 0%, #1f0800 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "70px 56px 56px",
        gap: 32,
      }}
    >
      <div style={{ opacity: headerOp, textAlign: "center" }}>
        <div style={{ color: C.heat, fontSize: 30, fontFamily: "Arial", letterSpacing: "3px", textTransform: "uppercase" }}>
          the real problem
        </div>
        <div style={{ color: C.white, fontSize: 60, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.1 }}>
          Your attic is a<br />
          <span style={{ color: C.heat }}>furnace.</span>
        </div>
      </div>

      <div style={{ opacity: thermoOp }}>
        <Thermometer startFrame={12} />
      </div>

      <div
        style={{
          opacity: factOp,
          backgroundColor: "#1a0000",
          border: `2px solid ${C.heat}44`,
          borderLeft: `6px solid ${C.heat}`,
          borderRadius: 10,
          padding: "18px 24px",
          width: "100%",
        }}
      >
        <div style={{ color: "#aaa", fontSize: 22, fontFamily: "Arial", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>
          This means
        </div>
        <div style={{ color: C.white, fontSize: 34, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.2 }}>
          Your AC works{" "}
          <span style={{ color: C.heat }}>2× harder</span>
          {" "}& you pay for every degree.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: SOLUTION ────────────────────────────────────────────────────────

const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOp = fi(frame, 0, 12);
  const savingsOp = fi(frame, 18, 12);
  const listOp    = fi(frame, 35, 12);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #00050f 0%, #000d1a 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "60px 56px",
        gap: 28,
      }}
    >
      {/* Header */}
      <div style={{ opacity: headerOp }}>
        <div style={{ color: C.cool, fontSize: 30, fontFamily: "Arial", letterSpacing: "3px", textTransform: "uppercase" }}>
          the fix
        </div>
        <div style={{ color: C.white, fontSize: 64, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Proper insulation
          <br />
          <span style={{ color: C.cool }}>changes everything.</span>
        </div>
      </div>

      {/* Big savings stat */}
      <div
        style={{
          opacity: savingsOp,
          textAlign: "center",
          backgroundColor: "#001020",
          border: `2px solid ${C.cool}33`,
          borderRadius: 16,
          padding: "24px 32px",
        }}
      >
        <div style={{ color: "#888", fontSize: 26, fontFamily: "Arial", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
          avg energy savings
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0 }}>
          <CountUp from={0} to={40} suffix="%" fontSize={140} color={C.green} startFrame={20} durationFrames={45} />
        </div>
        <div style={{ color: "#aaa", fontSize: 28, fontFamily: "Arial, sans-serif", marginTop: 8 }}>
          reduction in energy bills
        </div>
      </div>

      {/* Solution types */}
      <div style={{ opacity: listOp }}>
        <CheckList
          startFrame={38}
          accentColor={C.cool}
          items={[
            { label: "Spray Foam", sub: "Seals air leaks, highest R-value" },
            { label: "Blown-In", sub: "Fast, full coverage, retrofit-friendly" },
            { label: "Batts", sub: "New builds, walls, standard installs" },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: PROOF / TRUST ───────────────────────────────────────────────────

const SceneProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = fi(frame, 0, 12);

  const cards = [
    { icon: "🏠", label: "Homeowners", value: "Lower bills + comfort", color: C.cool },
    { icon: "🏗️", label: "Builders", value: "Code-ready, fast installs", color: C.green },
    { icon: "📍", label: "Serving SWFL", value: "Local, licensed, trusted", color: C.yellow },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000a05 0%, #001208 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "60px 56px",
        gap: 28,
      }}
    >
      <div style={{ opacity: headerOp }}>
        <div style={{ color: C.green, fontSize: 30, fontFamily: "Arial", letterSpacing: "3px", textTransform: "uppercase" }}>
          why ideal insulation?
        </div>
        <div style={{ color: C.white, fontSize: 62, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          SWFL's go-to
          <br />
          <span style={{ color: C.green }}>insulation crew.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {cards.map((card, i) => {
          const delay = 12 + i * 12;
          const prog = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 20, stiffness: 130 },
            durationInFrames: 22,
          });
          const opacity = interpolate(prog, [0, 1], [0, 1]);
          const ty = interpolate(prog, [0, 1], [40, 0]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                backgroundColor: "#0a120a",
                border: `2px solid ${card.color}33`,
                borderLeft: `6px solid ${card.color}`,
                borderRadius: 12,
                padding: "20px 26px",
                opacity,
                transform: `translateY(${ty}px)`,
              }}
            >
              <div style={{ fontSize: 52 }}>{card.icon}</div>
              <div>
                <div style={{ color: card.color, fontSize: 22, fontFamily: "Arial", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {card.label}
                </div>
                <div style={{ color: C.white, fontSize: 34, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini stat row */}
      <div
        style={{
          opacity: fi(frame, 55, 12),
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#05100a",
          border: `1px solid ${C.green}22`,
          borderRadius: 12,
          padding: "20px 16px",
        }}
      >
        {[
          { n: "3", label: "Services" },
          { n: "★★★★★", label: "Rated" },
          { n: "SWFL", label: "Local" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ color: C.green, fontSize: 38, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>{s.n}</div>
            <div style={{ color: "#777", fontSize: 22, fontFamily: "Arial" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────────

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.4 }, durationInFrames: 20 });
  const pulse = 1 + interpolate(Math.sin((frame / 14) * Math.PI), [-1, 1], [-0.018, 0.018]);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #001a08 0%, #000805 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: "60px 60px",
      }}
    >
      {/* Logo lockup */}
      <div
        style={{
          opacity: fi(frame, 0, 18),
          transform: `scale(${interpolate(scaleIn, [0, 1], [0.3, 1])})`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 90, lineHeight: 1 }}>❄️</div>
        <div
          style={{
            color: C.white,
            fontSize: 52,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "-1px",
            marginTop: 8,
          }}
        >
          Ideal Insulation
        </div>
        <div style={{ color: C.green, fontSize: 28, fontFamily: "Arial, sans-serif", letterSpacing: "3px" }}>
          SOUTHWEST FLORIDA
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: fi(frame, 18, 14),
          transform: `scale(${pulse})`,
          backgroundColor: C.green,
          color: C.black,
          fontSize: 46,
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          padding: "22px 48px",
          borderRadius: 14,
          textAlign: "center",
          lineHeight: 1.15,
          boxShadow: `0 0 40px ${C.green}66`,
          letterSpacing: "-1px",
        }}
      >
        Get a FREE Estimate
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
          🔗 Link in bio
        </div>
      </div>

      {/* Services pills */}
      <div
        style={{
          opacity: fi(frame, 28, 12),
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["Spray Foam", "Blown-In", "Batts"].map((s) => (
          <div
            key={s}
            style={{
              backgroundColor: "#002210",
              border: `2px solid ${C.green}55`,
              color: C.green,
              fontSize: 26,
              fontFamily: "'Arial Black', Arial, sans-serif",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: 30,
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Hashtags */}
      <div
        style={{
          opacity: fi(frame, 42, 12),
          color: "#444",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        #SWFLInsulation #SprayFoam #EnergySavings
        {"\n"}#SouthFloridaHomes #InsulationContractor
      </div>
    </AbsoluteFill>
  );
};

// ─── Flash transition ─────────────────────────────────────────────────────────

const Flash: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [triggerFrame, triggerFrame + 3, triggerFrame + 9], [0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: C.white, opacity, pointerEvents: "none" }} />;
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const InsulationTikTok: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: C.dark, fontFamily: "Arial, sans-serif" }}>
      <Audio src={staticFile("swfl-beat.wav")} volume={0.8} />

      {/* Scenes */}
      <Sequence from={0}   durationInFrames={60}>  <SceneHook />     </Sequence>
      <Sequence from={60}  durationInFrames={105}>  <SceneProblem />  </Sequence>
      <Sequence from={165} durationInFrames={120}>  <SceneSolution /> </Sequence>
      <Sequence from={285} durationInFrames={90}>  <SceneProof />    </Sequence>
      <Sequence from={375} durationInFrames={75}>  <SceneCTA />      </Sequence>

      {/* Transitions */}
      {[60, 165, 285, 375].map((t) => <Flash key={t} triggerFrame={t} />)}

      {/* Bottom captions */}
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
        <Caption text="Is your AC bill over $200/month? 👀"   start={2}   end={56}  bg={C.white}  color={C.black} />
        <Caption text="SWFL attics hit 140°F in summer 🌡️"     start={62}  end={160} bg={C.heat}   color={C.white} />
        <Caption text="Cut energy bills by up to 40% ✅"       start={167} end={280} bg={C.cool}   color={C.black} />
        <Caption text="Builders & homeowners trust us 🏗️"      start={287} end={370} bg={C.green}  color={C.black} />
        <Caption text="Free estimate — link in bio 🔗"          start={378} end={445} bg={C.yellow} color={C.black} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
