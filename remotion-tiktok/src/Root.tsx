import React from "react";
import { Composition } from "remotion";
import { TikTokVideo } from "./TikTokVideo";
import { InsulationTikTok } from "./InsulationTikTok";
import { InsulationTikTok2 } from "./InsulationTikTok2";
import { InsulationTikTok3 } from "./InsulationTikTok3";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TikTokVideo"       component={TikTokVideo}       durationInFrames={600} fps={30} width={1080} height={1920} defaultProps={{}} />
    <Composition id="InsulationTikTok"  component={InsulationTikTok}  durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{}} />
    <Composition id="InsulationTikTok2" component={InsulationTikTok2} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{}} />
    <Composition id="InsulationTikTok3" component={InsulationTikTok3} durationInFrames={540} fps={30} width={1080} height={1920} defaultProps={{}} />
  </>
);
