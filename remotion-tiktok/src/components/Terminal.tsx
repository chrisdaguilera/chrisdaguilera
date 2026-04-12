import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface TerminalLine {
  prompt?: string;
  command?: string;
  output?: string;
  color?: string;
  startFrame: number;
  typingDuration?: number; // frames to type the command
}

interface TerminalProps {
  lines: TerminalLine[];
}

const CHAR_DELAY = 1.2; // frames per character for typing effect

const TypedText: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  color?: string;
}> = ({ text, startFrame, duration, color = "#00ff41" }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chars = Math.floor(progress * text.length);
  const showCursor = chars < text.length && frame >= startFrame;

  return (
    <span style={{ color }}>
      {text.slice(0, chars)}
      {showCursor && (
        <span
          style={{
            opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
            color: "#00ff41",
          }}
        >
          █
        </span>
      )}
    </span>
  );
};

export const Terminal: React.FC<TerminalProps> = ({ lines }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #00ff4133",
        borderRadius: 8,
        padding: "24px 28px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 28,
        lineHeight: 1.7,
        boxShadow: "0 0 40px #00ff4122, inset 0 0 60px #00000088",
        width: "100%",
      }}
    >
      {/* Terminal title bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <span
          style={{
            marginLeft: 12,
            color: "#555",
            fontSize: 22,
            fontFamily: "Arial, sans-serif",
          }}
        >
          kali@parrot — bash
        </span>
      </div>

      {lines.map((line, i) => {
        const isVisible = frame >= line.startFrame;
        if (!isVisible) return null;

        const typeDuration = line.typingDuration ?? (line.command ? line.command.length * CHAR_DELAY : 0);

        return (
          <div key={i} style={{ marginBottom: 4 }}>
            {/* Command line */}
            {(line.prompt !== undefined || line.command !== undefined) && (
              <div>
                {line.prompt && (
                  <span style={{ color: "#00ff41" }}>{line.prompt}</span>
                )}
                {line.command && (
                  <TypedText
                    text={line.command}
                    startFrame={line.startFrame}
                    duration={typeDuration}
                    color="#ffffff"
                  />
                )}
              </div>
            )}

            {/* Output line — appears after command finishes typing */}
            {line.output && frame >= line.startFrame + typeDuration + 4 && (
              <div
                style={{
                  color: line.color ?? "#aaaaaa",
                  opacity: interpolate(
                    frame,
                    [line.startFrame + typeDuration + 4, line.startFrame + typeDuration + 12],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                {line.output}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
