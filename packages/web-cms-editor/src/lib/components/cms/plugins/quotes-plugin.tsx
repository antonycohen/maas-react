import { Quote } from 'lucide-react';

import { EditorPlugin } from "../../../types";
import { QuotesBlock } from "../blocks/quotes-block";
import {
  cardsQuotesBlockShape,
  CMSCardsQuotesBlock,
} from '@maas/core-api-models';

export const QuotesPlugin: EditorPlugin<
  "CardsQuote",
  CMSCardsQuotesBlock,
  any
> = {
  name: "CardsQuote",
  displayName: "Card Citation(s)",
  enabled: true,
  icon: <Quote />,
  blockType: "cards-quote",
  shape: cardsQuotesBlockShape,
  inputsSections: [
    {
      name: "Quote",
      hasBorder: false,
      inputs: [
        {
          type: "multi_group",
          name: "cards",
          label: "Test",
          titlePath: "quote",
          subtitle: "Element Card",
          required: true,
          items: [
            {
              type: "rte",
              name: "quote",
              label: "Citation",
              required: true,
            },
            {
              type: "text",
              name: "name",
              label: "Nom",
              required: true,
            },
            {
              type: "text",
              name: "job",
              label: "Poste",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return QuotesBlock({ block: props });
  },
};
