import { EditorPlugin } from '../../../types';
import { CardsBlock } from '../blocks/cards-block';
import {
  cardsTextWithImageBlockShape,
  CMSCardsTextWithImageBlock,
} from '@maas/core-api-models';

export const CardsTextWithImagePlugin: EditorPlugin<
  'CardsTextWithImage',
  CMSCardsTextWithImageBlock,
  any
> = {
  name: 'CardsTextWithImage',
  displayName: 'Card(s) information avec visuel',
  enabled: true,
  icon: 'CardTextWithImage',
  blockType: 'cards-text-with-image',
  shape: cardsTextWithImageBlockShape,
  inputsSections: [
    {
      name: 'Data',
      hasBorder: false,
      inputs: [
        {
          type: 'multi_group',
          name: 'cards',
          label: 'Test',
          titlePath: 'title',
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
              type: 'select',
              name: 'variant',
              label: 'Type',
              options: [
                { value: 'white', label: 'Blanc' },
                { value: 'green', label: 'Vert' },
              ],
              required: true,
            },
            {
              type: 'text',
              name: 'title',
              label: 'Titre',
              required: true,
            },
            {
              type: 'rte',
              name: 'text',
              label: 'Contenu',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return CardsBlock({ block: props });
  },
};
