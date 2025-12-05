import { CalendarDays } from 'lucide-react';

import { EditorPlugin } from "../../../types";
import { CardEventBlock } from "../blocks/card-event-block";
import { cardEventShape, CMSEventBlock } from '@maas/core-api-models';

export const CardEventPlugin: EditorPlugin<"Card Event", CMSEventBlock, any> = {
  name: "Card Event",
  displayName: "Card Event",
  enabled: true,
  icon: <CalendarDays />,
  blockType: "card-event",
  shape: cardEventShape,
  inputsSections: [
    {
      name: "Paragraph",
      hasBorder: true,
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Titre",
          required: true,
        },
        {
          type: "rte",
          name: "description",
          label: "Description",
          required: true,
        },
        {
          type: "rte",
          name: "subDescription",
          label: "Sous Description",
          required: true,
        },
        {
          type: "image",
          name: "image",
          label: "Image",
          required: true,
        },
        {
          type: "text",
          name: "ctaLabel",
          label: "Label CTA",
          required: true,
        },
        {
          type: "text",
          name: "ctaUrl",
          label: "URL du CTA",
          required: true,
        },
        {
          type: "text",
          name: "topChipLabel",
          label: "Chip Label",
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return CardEventBlock({ block: props });
  },
};
