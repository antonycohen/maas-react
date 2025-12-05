import { EditorPlugin } from "../../../types";
import { HeadingBlock } from "../blocks/heading-block";
import { CMSHeadingBlock, headingBlockShape } from '@maas/core-api-models';

export const HeadingPlugin: EditorPlugin<"Heading", CMSHeadingBlock, any> = {
  name: "Heading",
  displayName: "Titre",
  enabled: true,
  icon: "Heading",
  blockType: "heading",
  shape: headingBlockShape,
  inputsSections: [
    {
      name: "Heading",
      hasBorder: true,
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          required: true,
        },
        {
          type: "select",
          name: "level",
          label: "Type",
          options: [
            { value: 1, label: "H1" },
            { value: 2, label: "H2" },
            { value: 3, label: "H3" },
            { value: 4, label: "H4" },
            { value: 5, label: "H5" },
            { value: 6, label: "H6" },
          ],
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return HeadingBlock({ block: props, editMode: true });
  },
};
