import { Newspaper } from 'lucide-react';

import { EditorPlugin } from '../../../types';
import { CardPressCoverageBlock } from '../blocks/card-press-coverage-block';
import {
  cardPressCoverageShape,
  CMSCardPressCoverageBlock,
} from '@maas/core-api-models';

export const CardPressCoveragePlugin: EditorPlugin<
  'CardPressCoverage',
  CMSCardPressCoverageBlock,
  any
> = {
  name: 'CardPressCoverage',
  displayName: 'Card(s) presse',
  enabled: true,
  icon: <Newspaper />,
  blockType: 'card-press-coverage',
  shape: cardPressCoverageShape,
  inputsSections: [
    {
      name: 'Data',
      hasBorder: false,
      inputs: [
        {
          type: 'multi_group',
          name: 'cards',
          label: 'Text',
          titlePath: 'date',
          subtitle: 'Element Card',
          required: true,
          items: [
            {
              type: 'image',
              name: 'image',
              label: 'Image',
              required: true,
            },
            {
              type: 'rte',
              name: 'content',
              label: 'Contenu',
              required: true,
            },
            {
              type: 'date',
              name: 'date',
              label: 'Date',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return CardPressCoverageBlock({ block: props });
  },
};
