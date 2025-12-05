import { EditorPlugin } from "../../../types";
import { HighlightBlock } from "../blocks/highlight-block";
import { CMSHighlightBlock, highlightSHape } from '@maas/core-api-models';

export const HighlightPlugin: EditorPlugin<
  "Highlight",
  CMSHighlightBlock,
  any
> = {
  name: "Highlight",
  displayName: "Highlight",
  enabled: true,
  icon: "CmsHighlight",
  blockType: "highlight",
  shape: highlightSHape,
  inputsSections: [
    {
      name: "Data",
      hasBorder: false,
      inputs: [
        {
          type: "multi_group",
          name: "elements",
          label: "Text",
          subtitle: "highlight element",
          required: true,
          items: [
            {
              type: "rte",
              name: "content",
              label: "Contenu",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return HighlightBlock({ block: props });
  },
};
