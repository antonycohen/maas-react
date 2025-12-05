import { EditorPlugin } from "../../../types";
import { ImageAndTextBlock } from "../blocks/image-and-text-block";
import {
  CMSImageAndTextBlock,
  imageAndTextBlockShape,
} from '@maas/core-api-models';

export const ImageWithTextPlugin: EditorPlugin<
  "ImageWithText",
  CMSImageAndTextBlock,
  any
> = {
  name: "ImageWithText",
  displayName: "Texte + image",
  enabled: true,
  icon: "ImageAndText",
  blockType: "image-and-text",
  shape: imageAndTextBlockShape,
  inputsSections: [
    {
      name: "Texte + image",
      hasBorder: true,
      inputs: [
        {
          type: "select",
          name: "imagePlacement",
          label: "Type",
          options: [
            { value: "left", label: "Image à gauche" },
            { value: "right", label: "Image à droite" },
          ],
          required: true,
        },
        {
          type: "rte",
          name: "text",
          label: "Text",
          required: true,
        },
        {
          type: "image",
          name: "image",
          label: "Image",
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return ImageAndTextBlock({ block: props, editMode: true });
  },
};
