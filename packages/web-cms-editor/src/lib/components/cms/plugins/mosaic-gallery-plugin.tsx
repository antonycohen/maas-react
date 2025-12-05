import { LayoutGrid } from 'lucide-react';

import { EditorPlugin } from "../../../types";
import { MosaicGalleryBlock } from "../blocks/mosaic-gallery-block";
import {
  CMSMosaicGalleryBlock,
  mosaicGalleryShape,
} from '@maas/core-api-models';

export const MosaicGalleryPlugin: EditorPlugin<
  "MosaicGallery",
  CMSMosaicGalleryBlock,
  any
> = {
  name: "MosaicGallery",
  displayName: "MosaicGallery",
  enabled: true,
  icon: <LayoutGrid />,
  blockType: "mosaic-gallery",
  shape: mosaicGalleryShape,
  inputsSections: [
    {
      name: "Data",
      hasBorder: false,
      inputs: [
        {
          type: "multi_group",
          name: "elements",
          label: "Text",
          subtitle: "Image",
          required: true,
          items: [
            {
              type: "image",
              name: "image",
              label: "Image",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return MosaicGalleryBlock({ block: props });
  },
};
