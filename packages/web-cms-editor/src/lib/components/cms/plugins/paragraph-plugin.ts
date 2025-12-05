import { EditorPlugin } from "../../../types";
import { ParagraphBlock } from "../blocks/paragraph-block";
import { CMSParagraphBlock, paragraphBlockShape } from '@maas/core-api-models';

export const ParagraphPlugin: EditorPlugin<
  "Paragraph",
  CMSParagraphBlock,
  any
> = {
  name: "Paragraph",
  displayName: "Texte",
  enabled: true,
  icon: "Text",
  blockType: "paragraph",
  shape: paragraphBlockShape,
  inputsSections: [
    {
      name: "Paragraph",
      hasBorder: true,
      inputs: [
        {
          type: "rte",
          name: "text",
          label: "Text",
          required: true,
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return ParagraphBlock({ block: props });
  },
};
