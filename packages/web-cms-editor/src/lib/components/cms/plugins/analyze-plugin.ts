import { EditorPlugin } from "../../../types";
import { AnalyzeBlock } from "../blocks/analyze-block";
import { analyzeBlockShape, CMSAnalyzeBlock } from '@maas/core-api-models';

export const AnalyzePlugin: EditorPlugin<"Analyze", CMSAnalyzeBlock, any> = {
  name: "Analyze",
  displayName: "Analyze",
  enabled: true,
  icon: "CmsAnalyze",
  blockType: "analyze",
  shape: analyzeBlockShape,
  inputsSections: [
    {
      name: "Paragraph",
      hasBorder: true,
      inputs: [
        {
          type: "text",
          name: "author",
          label: "Auteur",
          required: true,
        },
        {
          type: "text",
          name: "subtitle",
          label: "Sous-Titre",
          required: true,
        },
        {
          type: "rte",
          name: "content",
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
    return AnalyzeBlock({ block: props, editMode: true });
  },
};
