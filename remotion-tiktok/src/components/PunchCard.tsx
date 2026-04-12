import React from "react";
import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";

interface PunchCardProps {
  icon: string;
  label: string;
  value: string;
  accentColor?: string;
  startFrame?: number;
  index?: number;
}

export const PunchCard: React.FC<PunchCardProps> = ({
  icon,
  label,
  value,
  accentColor = "#00ff41",
  startFrame = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryDelay = startFrame + index * 8;

  const slideProgress = spring({
    frame: Math.max(0, frame - entryDelay),
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.6 },
    durationInFrames: 25,
  });

  const translateX = interpolate(slideProgress, [0, 1], [-80, 0]);
  const opacity = interpolate(slideProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        backgroundColor: "#111111",
        border: `2px solid ${accentColor}44`,
        borderLeft: `6px solid ${accentColor}`,
        borderRadius: 12,
        padding: "20px 28px",
        transform: `translateX(${translateX}px)`,
        opacity,
        boxShadow: `0 0 30px ${accentColor}11`,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 52 }}>{icon}</div>
      <div>
        <div
          style={{
            color: "#888",
            fontSize: 22,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
