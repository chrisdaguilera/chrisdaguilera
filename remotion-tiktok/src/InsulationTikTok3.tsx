/**
 * InsulationTikTok3.tsx — "Thermal Cam Reveal"
 *
 * Hook: thermal camera shows heat POURING out of a SWFL home
 * → spray foam expands to seal it (satisfying ASMR-style animation)
 * → same thermal cam now shows cool blues
 * → CTA
 *
 * Duration: 18 seconds @ 30fps = 540 frames
 */

import React from "react";
import {
  AbsoluteFill, Sequence, Audio, staticFile,
  useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";

// ─── Palette ──────────────────────────────────────────────────────────────────
const THERMAL_HOT  = ["#ff0000","#ff4400","#ff8800","#ffcc00","#ffff00"];
const THERMAL_COOL = ["#0044ff","#0088ff","#00ccff","#00ffee","#aaffee"];

const C = {
  dark:   "#050505",
  green:  "#00d46a",
  gold:   "#ffd000",
  white:  "#ffffff",
  red:    "#ff2d2d",
  orange: "#ff6600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fi = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const sp = (frame: number, startF: number, fps: number, stiffness = 160, damping = 20) =>
  spring({ frame: Math.max(0, frame - startF), fps, config: { stiffness, damping, mass: 0.5 }, durationInFrames: 24 });

// ─── Thermal camera HUD overlay ───────────────────────────────────────────────
const ThermalHUD: React.FC<{ temp: number; label?: string }> = ({ temp, label = "ATTIC" }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    fontFamily: "'Courier New', monospace",
  }}>
    {/* Scan lines */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,0,0.04) 3px, rgba(0,255,0,0.04) 4px)",
      pointerEvents: "none",
    }} />
    {/* Corner brackets */}
    {[
      { top: 24, left: 24, borderTop: "3px solid #00ff44", borderLeft: "3px solid #00ff44" },
      { top: 24, right: 24, borderTop: "3px solid #00ff44", borderRight: "3px solid #00ff44" },
      { bottom: 24, left: 24, borderBottom: "3px solid #00ff44", borderLeft: "3px solid #00ff44" },
      { bottom: 24, right: 24, borderBottom: "3px solid #00ff44", borderRight: "3px solid #00ff44" },
    ].map((s, i) => (
      <div key={i} style={{ position: "absolute", width: 36, height: 36, ...s as any }} />
    ))}
    {/* Top bar */}
    <div style={{ position: "absolute", top: 28, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 70px" }}>
      <span style={{ color: "#00ff44", fontSize: 24, letterSpacing: "2px" }}>FLIR·T530</span>
      <span style={{ color: "#00ff44", fontSize: 24, letterSpacing: "2px" }}>REC ●</span>
    </div>
    {/* Temp readout */}
    <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 60px", alignItems: "flex-end" }}>
      <div>
        <div style={{ color: "#00ff4488", fontSize: 20, letterSpacing: "3px" }}>{label}</div>
        <div style={{ color: "#00ff44", fontSize: 56, fontFamily: "'Arial Black', monospace", fontWeight: 900, lineHeight: 1 }}>
          {Math.round(temp)}°F
        </div>
      </div>
      {/* Temp scale bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ width: 22, height: 160, borderRadius: 4, background: "linear-gradient(to bottom, #ff0000, #ffaa00, #ffff00, #00ffff, #0044ff)", border: "1px solid #00ff4444" }} />
        <div style={{ color: "#00ff4488", fontSize: 18, letterSpacing: "1px" }}>HOT</div>
      </div>
    </div>
  </div>
);

// ─── Thermal heat map (house cross-section) ───────────────────────────────────
const ThermalHeatMap: React.FC<{ progress: number; cool?: boolean }> = ({ progress, cool = false }) => {
  const colors = cool ? THERMAL_COOL : THERMAL_HOT;

  // Heat "blobs" — hot spots on roof/walls of the house
  const hotspots = cool
    ? [
        { cx: 50, cy: 28, rx: 38, ry: 18, intensity: 0.3 },
        { cx: 25, cy: 55, rx: 14, ry: 28, intensity: 0.2 },
        { cx: 75, cy: 55, rx: 14, ry: 28, intensity: 0.2 },
      ]
    : [
        { cx: 50, cy: 20, rx: 44, ry: 22, intensity: 1.0 },   // roof — hottest
        { cx: 50, cy: 10, rx: 30, ry: 12, intensity: 0.9 },   // peak
        { cx: 20, cy: 50, rx: 16, ry: 32, intensity: 0.7 },   // left wall
        { cx: 80, cy: 50, rx: 16, ry: 32, intensity: 0.7 },   // right wall
        { cx: 35, cy: 65, rx: 12, ry: 14, intensity: 0.5 },   // window 1
        { cx: 65, cy: 65, rx: 12, ry: 14, intensity: 0.5 },   // window 2
      ];

  const pickColor = (intensity: number) => {
    const idx = Math.floor(intensity * (colors.length - 1));
    return colors[Math.min(idx, colors.length - 1)];
  };

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      {/* Background */}
      <rect width="100" height="100" fill={cool ? "#001830" : "#0a0000"} />

      {/* Heat blobs */}
      {hotspots.map((h, i) => (
        <ellipse
          key={i}
          cx={h.cx} cy={h.cy}
          rx={h.rx * progress} ry={h.ry * progress}
          fill={pickColor(h.intensity)}
          opacity={0.75 * progress}
          style={{ filter: "blur(8px)" } as any}
        />
      ))}

      {/* House outline */}
      {/* Roof */}
      <polyline points="15,45 50,8 85,45" fill="none" stroke="#00ff4499" strokeWidth="1.2" />
      {/* Walls */}
      <rect x="17" y="44" width="66" height="48" fill="none" stroke="#00ff4499" strokeWidth="1.2" />
      {/* Door */}
      <rect x="42" y="72" width="16" height="20" fill="none" stroke="#00ff4466" strokeWidth="0.8" />
      {/* Windows */}
      <rect x="24" y="55" width="14" height="12" fill="none" stroke="#00ff4466" strokeWidth="0.8" />
      <rect x="62" y="55" width="14" height="12" fill="none" stroke="#00ff4466" strokeWidth="0.8" />

      {/* Heat escape arrows (only when hot) */}
      {!cool && progress > 0.6 && [30, 50, 70].map((x, i) => (
        <g key={i} opacity={(progress - 0.6) / 0.4}>
          <line x1={x} y1={8} x2={x} y2={2} stroke="#ff4400" strokeWidth="1.5"
            strokeDasharray="2,1" />
          <polygon points={`${x-2},3 ${x+2},3 ${x},0`} fill="#ff4400" />
        </g>
      ))}
    </svg>
  );
};

// ─── Spray foam expanding animation ───────────────────────────────────────────
const SprayFoamScene: React.FC<{ progress: number }> = ({ progress }) => {
  // Foam fills an attic cross-section from left to right, bottom to top
  // Each "bubble" is a circle that grows in at a staggered time

  const bubbles = React.useMemo(() => {
    const arr: { x: number; y: number; r: number; delay: number; hue: number }[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
    };
    const rand = rng(42);
    for (let i = 0; i < 120; i++) {
      arr.push({
        x: rand() * 100,
        y: 20 + rand() * 75,
        r: 3 + rand() * 9,
        delay: rand() * 0.7,
        hue: 38 + rand() * 20,   // yellow-cream foam colors
      });
    }
    return arr;
  }, []);

  // Nozzle position sweeps left to right, then back
  const nozzleX = interpolate(
    progress,
    [0, 0.5, 1],
    [5, 95, 50],
  );
  const nozzleY = interpolate(progress, [0, 1], [85, 30]);

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      {/* Attic background */}
      <rect width="100" height="100" fill="#0d0a06" />
      {/* Attic floor */}
      <rect x="0" y="90" width="100" height="10" fill="#1a1208" />
      {/* Roof line */}
      <polyline points="0,40 50,5 100,40 100,90 0,90" fill="#0a0800" stroke="#333" strokeWidth="0.5" />

      {/* Existing insulation (pink batts — the old stuff) */}
      {progress < 0.15 && (
        <>
          <rect x="5" y="82" width="90" height="8" fill="#e8607088" rx="2" opacity={1 - progress / 0.15} />
          <rect x="8" y="75" width="84" height="8" fill="#e8607066" rx="2" opacity={1 - progress / 0.15} />
        </>
      )}

      {/* Foam bubbles */}
      {bubbles.map((b, i) => {
        const bubbleProgress = Math.max(0, (progress - b.delay) / (1 - b.delay));
        const r = b.r * Math.min(1, bubbleProgress * 2.5);
        if (r <= 0) return null;
        const lightness = 75 + Math.sin(i) * 10;
        return (
          <ellipse
            key={i}
            cx={b.x} cy={b.y}
            rx={r} ry={r * 0.85}
            fill={`hsl(${b.hue}, 60%, ${lightness}%)`}
            opacity={0.92}
          />
        );
      })}

      {/* Spray nozzle */}
      {progress < 0.95 && (
        <g transform={`translate(${nozzleX}, ${nozzleY})`}>
          {/* Spray cone */}
          <polygon
            points={`0,-2 ${-6 * (1 - progress * 0.5)},${-14 + progress * 4} ${6 * (1 - progress * 0.5)},${-14 + progress * 4}`}
            fill="#ffdd8888"
            opacity={0.6}
          />
          {/* Gun body */}
          <rect x="-3" y="-2" width="6" height="8" fill="#555" rx="1" />
          <rect x="-1" y="6" width="2" height="6" fill="#444" />
        </g>
      )}

      {/* Coverage % label */}
      <text x="50" y="97" textAnchor="middle" fill="#00ff4488"
        fontSize="4" fontFamily="monospace">
        {`FOAM COVERAGE: ${Math.round(progress * 100)}%`}
      </text>
    </svg>
  );
};

// ─── Scene 1: THERMAL CAM HOOK ────────────────────────────────────────────────
const SceneThermalHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camProg = sp(frame, 5, fps, 80, 22);
  const heatProg = interpolate(frame, [15, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOp  = fi(frame, 20, 14);
  const subOp   = fi(frame, 38, 12);

  // Temp animates up from 72 to 138
  const temp = interpolate(heatProg, [0, 1], [72, 138]);

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Thermal map — takes up top 60% */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "62%",
        opacity: interpolate(camProg, [0, 1], [0, 1]),
        transform: `scale(${interpolate(camProg, [0, 1], [1.08, 1])})`,
      }}>
        <ThermalHeatMap progress={heatProg} />
        <ThermalHUD temp={temp} label="ATTIC" />
      </div>

      {/* Text below */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "40%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 56px", gap: 18,
        background: "linear-gradient(to bottom, transparent, #050505 30%)",
      }}>
        <div style={{ opacity: textOp, textAlign: "center" }}>
          <div style={{ color: "#888", fontSize: 26, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>
            we put a thermal cam on a
          </div>
          <div style={{ color: C.white, fontSize: 64, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
            SWFL home.
          </div>
          <div style={{ color: C.red, fontSize: 52, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>
            Here's what we found. 👇
          </div>
        </div>
        <div style={{
          opacity: subOp,
          backgroundColor: C.red, color: C.white,
          fontSize: 30, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900,
          padding: "10px 26px", borderRadius: 8, transform: "rotate(-1.5deg)",
        }}>
          🔴 LIVE THERMAL SCAN
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: THE PROBLEM ─────────────────────────────────────────────────────
const SceneProblem2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { label: "Attic temp",    value: "140°F",    color: C.red,    icon: "🌡️", delay: 8  },
    { label: "Monthly waste", value: "$150+",    color: C.orange, icon: "💸", delay: 22 },
    { label: "AC overload",   value: "2× harder",color: "#ffaa00",icon: "⚡", delay: 36 },
  ];

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0f0000 0%, #060606 100%)",
      display: "flex", flexDirection: "column",
      padding: "60px 52px", gap: 28,
    }}>
      <div style={{ opacity: fi(frame, 0, 12) }}>
        <div style={{ color: C.red, fontSize: 26, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>without insulation</div>
        <div style={{ color: C.white, fontSize: 66, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Your home is a{" "}
          <span style={{ color: C.red }}>money pit.</span>
        </div>
      </div>

      {stats.map((s, i) => {
        const prog = sp(frame, s.delay, fps, 170, 18);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 22,
            backgroundColor: "#110000",
            border: `2px solid ${s.color}33`,
            borderLeft: `6px solid ${s.color}`,
            borderRadius: 14, padding: "22px 26px",
            transform: `translateX(${interpolate(prog, [0, 1], [-60, 0])}px)`,
            opacity: interpolate(prog, [0, 1], [0, 1]),
          }}>
            <div style={{ fontSize: 52 }}>{s.icon}</div>
            <div>
              <div style={{ color: "#888", fontSize: 22, fontFamily: "Arial", textTransform: "uppercase", letterSpacing: "2px" }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 48, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        );
      })}

      {/* Thermal mini-view */}
      <div style={{
        opacity: fi(frame, 52, 12),
        height: 180, borderRadius: 12, overflow: "hidden",
        border: "2px solid #ff000033", position: "relative",
      }}>
        <ThermalHeatMap progress={1} />
        <ThermalHUD temp={140} label="YOUR ATTIC" />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: SPRAY FOAM APPLICATION ─────────────────────────────────────────
const SceneFoam: React.FC = () => {
  const frame = useCurrentFrame();

  // Foam fills over ~100 frames
  const foamProgress = interpolate(frame, [10, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerOp = fi(frame, 0, 12);
  const subOp    = fi(frame, 90, 14);

  return (
    <AbsoluteFill style={{
      background: "#050400",
      display: "flex", flexDirection: "column",
      padding: "60px 52px", gap: 0,
    }}>
      <div style={{ opacity: headerOp, marginBottom: 20 }}>
        <div style={{ color: C.gold, fontSize: 26, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>
          the fix — spray foam
        </div>
        <div style={{ color: C.white, fontSize: 62, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
          Watch it{" "}
          <span style={{ color: C.gold }}>seal everything.</span>
        </div>
      </div>

      {/* Main foam animation — takes up big chunk */}
      <div style={{
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
        border: "2px solid #ffffff11",
        minHeight: 0,
        maxHeight: 520,
      }}>
        <SprayFoamScene progress={foamProgress} />
      </div>

      {/* Expanding facts */}
      <div style={{ opacity: subOp, marginTop: 24 }}>
        <div style={{
          backgroundColor: "#0d0d00",
          border: `2px solid ${C.gold}33`,
          borderRadius: 12, padding: "20px 24px",
          display: "flex", gap: 20, alignItems: "center",
        }}>
          <div style={{ fontSize: 48 }}>🧪</div>
          <div>
            <div style={{ color: C.gold, fontSize: 30, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>
              Expands 100× its volume
            </div>
            <div style={{ color: "#777", fontSize: 22, fontFamily: "Arial" }}>
              Seals every gap — no air leaks possible
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: THERMAL AFTER ───────────────────────────────────────────────────
const SceneThermalAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camIn = sp(frame, 5, fps, 80, 22);
  const textOp = fi(frame, 18, 14);
  const statsOp = fi(frame, 38, 14);

  const temp = interpolate(frame, [10, 55], [138, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000510" }}>
      {/* Thermal map — cool now */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "58%",
        opacity: interpolate(camIn, [0, 1], [0, 1]),
        transform: `scale(${interpolate(camIn, [0, 1], [1.06, 1])})`,
      }}>
        <ThermalHeatMap progress={1} cool={true} />
        <ThermalHUD temp={temp} label="ATTIC" />
      </div>

      {/* Text */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "44%",
        padding: "0 52px 40px",
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 20,
        background: "linear-gradient(to bottom, transparent, #000510 25%)",
      }}>
        <div style={{ opacity: textOp }}>
          <div style={{ color: "#00aaff", fontSize: 26, fontFamily: "Arial", letterSpacing: "4px", textTransform: "uppercase" }}>same house. 6 hours later.</div>
          <div style={{ color: C.white, fontSize: 62, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, lineHeight: 1.05 }}>
            <span style={{ color: "#00ccff" }}>Cool.</span>{" "}Efficient.{"\n"}
            <span style={{ color: C.green }}>Saving money.</span>
          </div>
        </div>

        {/* Before/after temp */}
        <div style={{ opacity: statsOp, display: "flex", gap: 14 }}>
          {[
            { label: "BEFORE", value: "140°F", color: C.red,    bg: "#1a0000" },
            { label: "→",      value: "",      color: C.white,  bg: "transparent" },
            { label: "AFTER",  value: "84°F",  color: "#00ccff",bg: "#001520" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: s.label === "→" ? 0 : 1,
              backgroundColor: s.bg,
              borderRadius: 12, padding: "16px 14px",
              textAlign: "center",
              border: s.label !== "→" ? `2px solid ${s.color}33` : "none",
            }}>
              {s.value && <>
                <div style={{ color: "#888", fontSize: 20, fontFamily: "Arial", textTransform: "uppercase", letterSpacing: "2px" }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: 48, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900 }}>{s.value}</div>
              </>}
              {!s.value && <div style={{ color: C.white, fontSize: 40, fontFamily: "'Arial Black'", fontWeight: 900 }}>{s.label}</div>}
            </div>
          ))}
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
      background: "radial-gradient(ellipse at 50% 40%, #001a0a 0%, #040804 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 26, padding: "60px 60px",
    }}>
      {/* Thermal icon lockup */}
      <div style={{
        opacity: fi(frame, 0, 16),
        transform: `scale(${interpolate(scaleIn, [0, 1], [0.3, 1])})`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 88, lineHeight: 1 }}>🌡️❄️</div>
        <div style={{ color: C.white, fontSize: 50, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, letterSpacing: "-1px", marginTop: 10 }}>
          Ideal Insulation
        </div>
        <div style={{ color: C.green, fontSize: 26, fontFamily: "Arial", letterSpacing: "3px" }}>
          SOUTHWEST FLORIDA
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{
        opacity: fi(frame, 16, 12),
        transform: `scale(${pulse})`,
        width: "100%",
        backgroundColor: C.green, color: C.dark,
        fontSize: 44, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900,
        padding: "22px 36px", borderRadius: 14,
        textAlign: "center", lineHeight: 1.15,
        boxShadow: `0 0 50px ${C.green}66`, letterSpacing: "-1px",
      }}>
        Get a FREE Thermal Scan
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>🔗 Link in bio · SWFL</div>
      </div>

      {/* Services */}
      <div style={{ opacity: fi(frame, 26, 12), display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {["Spray Foam", "Blown-In", "Batts"].map((s) => (
          <div key={s} style={{
            backgroundColor: "#001a0a", border: `2px solid ${C.green}55`,
            color: C.green, fontSize: 26, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 700,
            padding: "10px 22px", borderRadius: 30,
          }}>
            {s}
          </div>
        ))}
      </div>

      {/* Hashtags */}
      <div style={{ opacity: fi(frame, 36, 12), color: "#444", fontSize: 22, fontFamily: "Arial", textAlign: "center", lineHeight: 1.6 }}>
        #SprayFoam #ThermalCamera #SWFLHomes{"\n"}
        #InsulationContractor #EnergyEfficiency
      </div>
    </AbsoluteFill>
  );
};

// ─── Flash transition ─────────────────────────────────────────────────────────
const Flash: React.FC<{ t: number; color?: string }> = ({ t, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [t, t + 3, t + 10], [0, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: color, opacity, pointerEvents: "none" }} />;
};

// Caption
const Caption: React.FC<{ text: string; start: number; end: number; bg?: string; color?: string }> = ({ text, start, end, bg = "#fff", color = "#000" }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const opacity = interpolate(frame, [start, start + 10, end - 8, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      backgroundColor: bg, color, opacity,
      fontSize: 44, fontFamily: "'Arial Black', Arial, sans-serif",
      fontWeight: 900, padding: "12px 26px", borderRadius: 8,
      textAlign: "center", letterSpacing: "-1px", maxWidth: "94%",
    }}>
      {text}
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const InsulationTikTok3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.dark }}>
    <Audio src={staticFile("thermal-beat.wav")} volume={0.82} />

    <Sequence from={0}   durationInFrames={90}>  <SceneThermalHook />  </Sequence>
    <Sequence from={90}  durationInFrames={105}> <SceneProblem2 />     </Sequence>
    <Sequence from={195} durationInFrames={130}> <SceneFoam />         </Sequence>
    <Sequence from={325} durationInFrames={110}> <SceneThermalAfter /> </Sequence>
    <Sequence from={435} durationInFrames={105}> <SceneCTA />          </Sequence>

    {[90, 195, 325, 435].map((t) => <Flash key={t} t={t} />)}

    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", padding: "0 40px 80px", pointerEvents: "none" }}>
      <Caption text="We put a thermal cam on a SWFL home 🔴"  start={4}   end={85}  bg="#ff2d2d"  color="#fff" />
      <Caption text="Your attic is leaking money 💸"           start={92}  end={190} bg="#ff6600"  color="#fff" />
      <Caption text="Spray foam seals it in ONE day 🧪"        start={197} end={320} bg="#ffd000"  color="#000" />
      <Caption text="Same house. Totally different temps ❄️"   start={327} end={430} bg="#00b4ff"  color="#000" />
      <Caption text="Free thermal scan — link in bio 🔗"       start={437} end={535} bg="#00d46a"  color="#000" />
    </AbsoluteFill>
  </AbsoluteFill>
);
