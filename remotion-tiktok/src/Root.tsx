import React from "react";
import { Composition } from "remotion";
import { TikTokVideo } from "./TikTokVideo";
import { InsulationTikTok } from "./InsulationTikTok";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TikTokVideo"
        component={TikTokVideo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="InsulationTikTok"
        component={InsulationTikTok}
        durationInFrames={450} // 15 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
