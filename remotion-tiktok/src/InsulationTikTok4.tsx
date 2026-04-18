/**
 * InsulationTikTok4.tsx — "Real Job POV"
 *
 * Authentic contractor-POV style. Uses a real photo from Ideal Insulation
 * as the hero visual. Ken Burns pan/zoom, 35mm-style film grain,
 * word-by-word kinetic captions, spray-foam ASMR audio.
 *
 * DROP the real photo at: public/real-job-1.jpg (1080x1920 or larger)
 * Fallback: a stylized placeholder renders if the file is missing.
 *
 * 16s @ 30fps = 480 frames.
 */
import React from "react";
import {
  AbsoluteFill, Sequence, Audio, Img, staticFile,
  useCurrentFrame, useVideoConfig,
  interpolate, spring, random,
} from "remotion";
import { noise2D } from "@remotion/noise";

// ─── Timing helpers ───────────────────────────────────────────────────────────
const fi = (frame: number, start: number, dur = 10) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const sp = (frame: number, startF: number, fps: number, stiff = 160, damp = 22) =>
  spring({
    frame: Math.max(0, frame - startF), fps,
    config: { stiffness: stiff, damping: damp, mass: 0.5 },
    durationInFrames: 20,
  });

// ─── Film Grain layer (drives the "not a slideshow" feel) ─────────────────────
const FilmGrain: React.FC<{ opacity?: number; scale?: number }> = ({
  opacity = 0.18, scale = 2,
}) => {
  const frame = useCurrentFrame();
  // Generate a 120x213 noise texture (9:16), upscale — keeps it cheap
  const W = 120, H = 213;
  const cells: string[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise2D("grain", x * 0.7 + frame * 0.9, y * 0.7);
      const v = Math.floor((n + 1) * 127.5);
      cells.push(`rgb(${v},${v},${v})`);
    }
  }
  // Build via canvas-in-SVG using a data URI would be heavier — use CSS gradient trick:
  // Instead, render many absolutely positioned divs is too slow. Use an SVG <filter>.
  const seed = Math.floor(frame * 37) % 9999;
  return (
    <svg
      width="100%" height="100%"
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity, mixBlendMode: "overlay",
      }}
    >
      <filter id={`g${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} />
    </svg>
  );
};

// ─── Vignette ─────────────────────────────────────────────────────────────────
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ─── Ken Burns hero photo ─────────────────────────────────────────────────────
const KenBurnsPhoto: React.FC<{
  src: string;
  frame: number;
  durFrames: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number; // -50..50 percent
  fromY?: number;
  toX?: number;
  toY?: number;
}> = ({
  src, frame, durFrames,
  fromScale = 1.05, toScale = 1.22,
  fromX = -4, fromY = -2, toX = 4, toY = 3,
}) => {
  const p = Math.min(1, frame / durFrames);
  // eased with a smooth step
  const e = p * p * (3 - 2 * p);
  const scale = fromScale + (toScale - fromScale) * e;
  const tx = fromX + (toX - fromX) * e;
  const ty = fromY + (toY - fromY) * e;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={src}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
          filter: "contrast(1.08) saturate(1.05)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Fallback stylized hero if real-job-1.jpg is missing ──────────────────────
const HeroFallback: React.FC<{ frame: number; durFrames: number }> = ({ frame, durFrames }) => {
  const p = Math.min(1, frame / durFrames);
  const scale = 1.04 + p * 0.12;
  // Painterly "metal roof + cream foam" gradient — matches the real photo palette
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 70% 20%, rgba(255,230,190,0.35), transparent 55%),
          linear-gradient(180deg, #3a2a1f 0%, #6a4a33 20%, #c9a378 42%, #e8c89a 70%, #241814 100%)
        `,
        transform: `scale(${scale})`,
      }}
    >
      {/* Scaffolding suggestion: red verticals */}
      <div style={{
        position: "absolute", left: "22%", top: "30%", width: 14, height: "50%",
        background: "linear-gradient(180deg,#8a1515,#ca2222)", borderRadius: 4, opacity: 0.85,
      }} />
      <div style={{
        position: "absolute", left: "72%", top: "35%", width: 10, height: "45%",
        background: "linear-gradient(180deg,#7a1010,#b42020)", borderRadius: 4, opacity: 0.75,
      }} />
      {/* Ribbing on the foam */}
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, right: 0,
          top: `${8 + i * 3.2}%`, height: 2,
          background: "rgba(255,220,170,0.14)",
        }} />
      ))}
      <div style={{
        position: "absolute", bottom: 40, left: 40,
        fontFamily: "monospace", fontSize: 28, color: "rgba(255,255,255,0.55)",
        letterSpacing: 2, textShadow: "0 2px 8px rgba(0,0,0,0.8)",
      }}>
        [ drop real-job-1.jpg into /public ]
      </div>
    </AbsoluteFill>
  );
};

// ─── Kinetic caption (word-by-word) ───────────────────────────────────────────
type Word = { text: string; at: number; emphasis?: boolean };

const KineticCaption: React.FC<{
  words: Word[];
  frame: number;
  fps: number;
  y?: string;
  size?: number;
  maxWidth?: number;
}> = ({ words, frame, fps, y = "62%", size = 84, maxWidth = 900 }) => {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: y,
      display: "flex", flexWrap: "wrap", justifyContent: "center",
      gap: "14px 18px", padding: "0 60px", maxWidth, margin: "0 auto",
      fontFamily: "Impact, 'Arial Black', 'Helvetica Neue', system-ui, sans-serif",
      fontWeight: 900, fontSize: size, lineHeight: 1.0,
      textTransform: "uppercase", letterSpacing: -1,
    }}>
      {words.map((w, i) => {
        const appear = sp(frame, w.at, fps, 220, 18);
        const visible = frame >= w.at;
        if (!visible) return null;
        const scale = 0.7 + appear * 0.3;
        const rot = (1 - appear) * (i % 2 === 0 ? -4 : 4);
        return (
          <span key={i} style={{
            display: "inline-block",
            transform: `scale(${scale}) rotate(${rot}deg)`,
            color: w.emphasis ? "#ffd000" : "#ffffff",
            WebkitTextStroke: "3px #000",
            textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 12px 24px rgba(0,0,0,0.55)",
          }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// ─── Scene 1: Cold open (black w/ one line) ───────────────────────────────────
const SceneOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 0-60f (0-2s)
  const shake = (Math.sin(frame * 0.9) * (frame < 6 ? 8 : 0));
  return (
    <AbsoluteFill style={{
      background: "#050505",
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: `translateX(${shake}px)`,
    }}>
      <KineticCaption
        frame={frame} fps={fps} y="42%" size={96}
        words={[
          { text: "MOST",       at: 2  },
          { text: "CONTRACTORS",at: 6  },
          { text: "IN",         at: 12 },
          { text: "SWFL",       at: 14, emphasis: true },
          { text: "ARE",        at: 24 },
          { text: "DOING",      at: 28 },
          { text: "THIS",       at: 34, emphasis: true },
          { text: "WRONG.",     at: 40, emphasis: true },
        ]}
      />
      <FilmGrain opacity={0.22} />
    </AbsoluteFill>
  );
};

// ─── Scene 2: Hero reveal (real photo, Ken Burns in) ──────────────────────────
const SceneHero: React.FC<{ durFrames: number }> = ({ durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = fi(frame, 0, 8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{
        position: "absolute", inset: 0,
        opacity: reveal, transform: `scale(${0.98 + reveal * 0.02})`,
      }}>
        {/* Real photo goes here; fallback if missing is handled by <Img> onError */}
        <PhotoOrFallback frame={frame} durFrames={durFrames} />
      </div>
      <Vignette strength={0.55} />
      <FilmGrain opacity={0.16} />
      <KineticCaption
        frame={frame} fps={fps} y="68%" size={80}
        words={[
          { text: "THIS",   at: 10 },
          { text: "METAL",  at: 18 },
          { text: "ROOF",   at: 26, emphasis: true },
          { text: "WAS",    at: 36 },
          { text: "140°F.", at: 42, emphasis: true },
          { text: "NOW",    at: 66 },
          { text: "IT'S",   at: 72 },
          { text: "78°.",   at: 78, emphasis: true },
        ]}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 3: Bullets / credibility ───────────────────────────────────────────
const SceneBullets: React.FC<{ durFrames: number }> = ({ durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <PhotoOrFallback
        frame={frame + 60} durFrames={durFrames + 60}
        /* continue panning but in the opposite direction */
      />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.48)" }} />
      <Vignette strength={0.6} />
      <div style={{
        position: "absolute", left: 60, right: 60, top: "18%",
        fontFamily: "Impact, 'Arial Black', system-ui, sans-serif",
        color: "#fff",
      }}>
        <div style={{
          fontSize: 72, lineHeight: 1, textTransform: "uppercase",
          letterSpacing: -1, WebkitTextStroke: "3px #000",
          opacity: sp(frame, 4, fps),
          transform: `translateY(${(1-sp(frame,4,fps))*-20}px)`,
        }}>
          Closed-cell foam.
        </div>
        <div style={{
          fontSize: 44, marginTop: 16, color: "#ffd000",
          fontFamily: "Impact, system-ui, sans-serif",
          textShadow: "0 2px 0 #000",
          opacity: sp(frame, 12, fps),
        }}>
          The only insulation built for SWFL.
        </div>
      </div>

      <div style={{
        position: "absolute", left: 60, right: 60, top: "42%",
        display: "flex", flexDirection: "column", gap: 22,
      }}>
        {[
          { t: "Seals every air gap — no more hot attic", at: 22 },
          { t: "Hurricane-grade rigidity",                 at: 40 },
          { t: "Blocks radiant heat through metal roofs",  at: 58 },
          { t: "Cuts AC load up to 40%",                   at: 76, hi: true },
        ].map((b, i) => {
          const o = sp(frame, b.at, fps, 200, 20);
          return (
            <div key={i} style={{
              opacity: o,
              transform: `translateX(${(1-o) * -40}px)`,
              display: "flex", alignItems: "center", gap: 18,
              background: "rgba(0,0,0,0.55)",
              border: b.hi ? "3px solid #ffd000" : "2px solid rgba(255,255,255,0.25)",
              borderRadius: 14,
              padding: "16px 22px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 34, fontWeight: 700, color: "#fff",
            }}>
              <span style={{
                color: b.hi ? "#ffd000" : "#00d46a",
                fontWeight: 900, fontSize: 38,
              }}>✓</span>
              <span>{b.t}</span>
            </div>
          );
        })}
      </div>
      <FilmGrain opacity={0.15} />
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA ─────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoIn = sp(frame, 2, fps);
  const pulse  = 1 + 0.03 * Math.sin(frame * 0.3);
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #080808 0%, #1a0f05 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 60,
    }}>
      <div style={{
        opacity: logoIn,
        transform: `translateY(${(1-logoIn)*30}px) scale(${pulse})`,
        fontFamily: "Impact, 'Arial Black', system-ui, sans-serif",
        fontSize: 120, fontWeight: 900, lineHeight: 0.95,
        textTransform: "uppercase", color: "#fff", textAlign: "center",
        letterSpacing: -2, WebkitTextStroke: "4px #000",
        textShadow: "0 10px 0 #b4311a, 0 20px 40px rgba(0,0,0,0.7)",
      }}>
        Ideal<br/>Insulation
      </div>
      <div style={{
        marginTop: 28, opacity: sp(frame, 10, fps),
        fontFamily: "system-ui, sans-serif", fontSize: 36,
        color: "#ffd000", fontWeight: 800, textAlign: "center",
        letterSpacing: 1,
      }}>
        Batts · Blown-in · Spray Foam
      </div>
      <div style={{
        marginTop: 12, opacity: sp(frame, 16, fps),
        fontFamily: "system-ui, sans-serif", fontSize: 30,
        color: "rgba(255,255,255,0.85)", textAlign: "center",
      }}>
        Serving all of Southwest Florida
      </div>
      <div style={{
        marginTop: 48, opacity: sp(frame, 24, fps),
        transform: `scale(${sp(frame, 24, fps) * (1 + 0.06 * Math.sin(frame * 0.25))})`,
        background: "#ffd000", color: "#080808",
        padding: "24px 44px", borderRadius: 18,
        fontFamily: "Impact, 'Arial Black', system-ui, sans-serif",
        fontSize: 56, fontWeight: 900, textTransform: "uppercase",
        letterSpacing: 1, boxShadow: "0 10px 0 #b49200, 0 20px 40px rgba(0,0,0,0.6)",
      }}>
        DM "QUOTE" →
      </div>
      <FilmGrain opacity={0.12} />
    </AbsoluteFill>
  );
};

// ─── Img that swaps to fallback on error ──────────────────────────────────────
const PhotoOrFallback: React.FC<{ frame: number; durFrames: number }> = ({ frame, durFrames }) => {
  const [err, setErr] = React.useState(false);
  if (err) return <HeroFallback frame={frame} durFrames={durFrames} />;
  const p = Math.min(1, frame / durFrames);
  const e = p * p * (3 - 2 * p);
  const scale = 1.06 + e * 0.16;
  const tx = -3 + e * 6;
  const ty = -1 + e * 3;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={staticFile("real-job-1.jpg")}
        onError={() => setErr(true)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
          filter: "contrast(1.08) saturate(1.05)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── ROOT composition ─────────────────────────────────────────────────────────
export const InsulationTikTok4: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* Audio: spray-foam ASMR bed */}
      <Audio src={staticFile("foam-asmr.wav")} volume={0.85} />

      {/* Scene 1: Cold open  0-60f (0-2s) */}
      <Sequence from={0} durationInFrames={60}>
        <SceneOpen />
      </Sequence>

      {/* Scene 2: Hero reveal  60-210f (2-7s) */}
      <Sequence from={60} durationInFrames={150}>
        <SceneHero durFrames={150} />
      </Sequence>

      {/* Scene 3: Bullets  210-390f (7-13s) */}
      <Sequence from={210} durationInFrames={180}>
        <SceneBullets durFrames={180} />
      </Sequence>

      {/* Scene 4: CTA  390-480f (13-16s) */}
      <Sequence from={390} durationInFrames={90}>
        <SceneCTA />
      </Sequence>

      {/* Global subtle vignette across entire video */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(0,0,0,0.35) 100%)",
      }} />
    </AbsoluteFill>
  );
};
