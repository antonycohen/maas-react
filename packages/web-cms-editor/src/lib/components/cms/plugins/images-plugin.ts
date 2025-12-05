import { EditorPlugin } from "../../../types";
import { ImageBlock } from "../blocks/image-block";
import { CMSImageBlock, imageBlockShape } from '@maas/core-api-models';

export const ImagesPlugin: EditorPlugin<"Image", CMSImageBlock, any> = {
  name: "Image",
  displayName: "Image(s)",
  enabled: true,
  icon: "Image",
  blockType: "images",
  shape: imageBlockShape,
  inputsSections: [
    {
      name: "Image",
      hasBorder: true,
      inputs: [
        {
          type: "select",
          name: "type",
          label: "Type",
          options: [
            { value: "single", label: "Une seule image" },
            { value: "carousel", label: "Carousel" },
            { value: "gallery", label: "Gallerie" },
          ],
          required: true,
        },
      ],
    },
    {
      name: "Single",
      hasBorder: true,
      visibilityCondition: (data) => data.type === "single",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
          required: true,
        },
      ],
    },
    {
      name: "Carousel",
      hasBorder: true,
      visibilityCondition: (data) => data.type === "carousel",
      inputs: [
        {
          type: "multi_group",
          name: "images",
          label: "Carousel",
          required: true,
          titlePath: "originalFilename",
          subtitle: "Image element",
          items: [
            {
              type: "image",
              name: "",
              label: "Image",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "Gallery",
      hasBorder: true,
      visibilityCondition: (data) => data.type === "gallery",
      inputs: [
        {
          type: "multi_group",
          name: "images",
          label: "Gallerie",
          required: true,
          titlePath: "originalFilename",
          subtitle: "Image element",
          items: [
            {
              type: "image",
              name: "",
              label: "Image",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props, editorSettings) => {
    return ImageBlock({ block: props, editMode: true, editorSettings });
  },
};
