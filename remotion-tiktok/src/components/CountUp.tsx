import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface CountUpProps {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  fontSize?: number;
  color?: string;
  startFrame?: number;
  durationFrames?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  fontSize = 120,
  color = "#ffffff",
  startFrame = 0,
  durationFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 18,
      stiffness: 60,
      mass: 0.8,
    },
    durationInFrames: durationFrames,
  });

  const value = interpolate(progress, [0, 1], [from, to]);
  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();

  return (
    <span
      style={{
        fontSize,
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        color,
        letterSpacing: "-3px",
        lineHeight: 1,
      }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
