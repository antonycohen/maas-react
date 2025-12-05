import { AppWindow } from 'lucide-react';

import { EditorPlugin } from "../../../types";
import { IFrameBlock } from "../blocks/iframe-block";
import { CMSIFrameBlock, iframeBlockShape } from '@maas/core-api-models';

export const IframePlugin: EditorPlugin<"Iframe", CMSIFrameBlock, any> = {
  name: "Iframe",
  displayName: "Iframe",
  enabled: true,
  icon: <AppWindow />,
  blockType: "iframe",
  shape: iframeBlockShape,
  inputsSections: [
    {
      name: "URL",
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
          label: "Url iframe",
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return IFrameBlock({ block: props, editMode: true });
  },
};
