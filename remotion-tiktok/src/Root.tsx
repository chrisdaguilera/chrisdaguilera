import React from "react";
import { Composition } from "remotion";
import { TikTokVideo } from "./TikTokVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TikTokVideo"
        component={TikTokVideo}
        durationInFrames={600} // 20 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
