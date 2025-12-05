import { AudioLines } from 'lucide-react';

import { EditorPlugin } from "../../../types";
import { AudioBlock } from "../blocks/audio-block";
import { audioBlockShape, CMSIAudioBlock } from '@maas/core-api-models';

export const AudioPlugin: EditorPlugin<"Audio", CMSIAudioBlock, any> = {
  name: "Audio",
  displayName: "Audio",
  enabled: true,
  icon: <AudioLines />,
  blockType: "audio",
  shape: audioBlockShape,
  inputsSections: [
    {
      name: "Paragraph",
      hasBorder: true,
      inputs: [
        {
          type: "text",
          name: "height",
          label: "Hauteur",
          required: false,
        },
        {
          type: "text",
          name: "width",
          label: "Largeur",
          required: false,
        },
        {
          type: "text",
          name: "url",
          label: "Url iFrame",
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return AudioBlock({ block: props, editMode: true });
  },
};
