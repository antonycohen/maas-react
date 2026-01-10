import { LayoutTemplate } from 'lucide-react';

import { EditorPlugin } from '../../../types';
import { FrameBlock } from '../blocks/frame-block';
import { CMSFrameBlock, frameBlockShape } from '@maas/core-api-models';

export const FramePlugin: EditorPlugin<'Frame', CMSFrameBlock, any> = {
  name: 'Frame',
  displayName: 'Cadre',
  enabled: true,
  icon: <LayoutTemplate />,
  blockType: 'frame',
  shape: frameBlockShape,
  inputsSections: [
    {
      name: 'Frame',
      hasBorder: true,
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Titre',
          required: false,
        },
      ],
    },
  ],
  renderingBlock: (props, editorSettings) => {
    return <FrameBlock block={props} settings={editorSettings} />;
  },
  dragDrop: {
    canContainChildren: true,
    childrenDataPath: 'children',
    canBeNested: false, // Frames cannot be nested inside other frames
  },
};
