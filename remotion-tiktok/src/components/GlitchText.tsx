import React from "react";
import { useCurrentFrame, random } from "remotion";

interface GlitchTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  glitchIntensity?: number;
  style?: React.CSSProperties;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  fontSize = 80,
  color = "#ffffff",
  glitchIntensity = 1,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Glitch triggers on certain frames — feels organic, not looping
  const isGlitching =
    (frame % 17 === 0 ||
      frame % 23 === 0 ||
      frame % 31 === 0) &&
    glitchIntensity > 0;

  const glitchX = isGlitching
    ? (random(`glitch-x-${frame}`) - 0.5) * 12 * glitchIntensity
    : 0;
  const glitchY = isGlitching
    ? (random(`glitch-y-${frame}`) - 0.5) * 6 * glitchIntensity
    : 0;

  const clipSlice = isGlitching
    ? `inset(${random(`clip-${frame}`) * 60}% 0 ${random(`clip2-${frame}`) * 30}% 0)`
    : "none";

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {/* Red chromatic aberration layer */}
      {isGlitching && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "#ff0044",
            fontSize,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "-2px",
            transform: `translate(${glitchX * 1.5}px, ${glitchY}px)`,
            clipPath: clipSlice,
            opacity: 0.85,
            mixBlendMode: "screen",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      )}

      {/* Cyan chromatic aberration layer */}
      {isGlitching && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "#00ffff",
            fontSize,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "-2px",
            transform: `translate(${-glitchX}px, ${glitchY * 0.5}px)`,
            clipPath: `inset(${random(`clip3-${frame}`) * 40}% 0 ${random(`clip4-${frame}`) * 50}% 0)`,
            opacity: 0.85,
            mixBlendMode: "screen",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      )}

      {/* Main text */}
      <div
        style={{
          position: "relative",
          color,
          fontSize,
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          letterSpacing: "-2px",
          whiteSpace: "nowrap",
          textShadow: isGlitching
            ? `0 0 20px ${color}88`
            : "none",
        }}
      >
        {text}
      </div>
    </div>
  );
};
