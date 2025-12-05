import { IFrameBlock } from "./iframe-block";
import { CMSIAudioBlock } from '@maas/core-api-models';

type AudioBlockProps = {
  block: CMSIAudioBlock;
  editMode?: boolean;
};

export function AudioBlock(props: AudioBlockProps) {
  return <IFrameBlock {...props} />;
}
