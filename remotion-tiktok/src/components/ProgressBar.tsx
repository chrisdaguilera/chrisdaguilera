import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface ProgressBarProps {
  label: string;
  percent: number;
  color?: string;
  startFrame?: number;
  index?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percent,
  color = "#00ff41",
  startFrame = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = startFrame + index * 12;

  const fillProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 22, stiffness: 80, mass: 0.6 },
    durationInFrames: 40,
  });

  const fillWidth = interpolate(fillProgress, [0, 1], [0, percent]);
  const opacity = interpolate(Math.max(0, frame - delay), [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ marginBottom: 20, opacity }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: "Arial, sans-serif",
          fontSize: 26,
        }}
      >
        <span style={{ color: "#cccccc" }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{Math.round(fillWidth)}%</span>
      </div>
      <div
        style={{
          height: 14,
          backgroundColor: "#222222",
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fillWidth}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            borderRadius: 7,
            boxShadow: `0 0 12px ${color}66`,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
};
