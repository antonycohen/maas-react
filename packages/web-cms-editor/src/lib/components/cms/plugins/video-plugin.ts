import { EditorPlugin } from "../../../types";
import { VideoBlock } from "../blocks/video-block";
import { CMSVideoBlock, videoBlockShape } from '@maas/core-api-models';

export const VideoPlugin: EditorPlugin<"Video", CMSVideoBlock, any> = {
  name: "Video",
  displayName: "Vidéo",
  enabled: true,
  icon: "Video",
  blockType: "video",
  shape: videoBlockShape,
  inputsSections: [
    {
      name: "Video",
      hasBorder: true,
      inputs: [
        {
          type: "text",
          name: "url",
          label: "Url",
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return VideoBlock({ block: props, editMode: true });
  },
};
