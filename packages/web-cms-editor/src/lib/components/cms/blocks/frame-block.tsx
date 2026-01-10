import { CMSFrameBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';

import { EditorSettings } from '../../../types';
import { useEditorContext } from '../../../store/editor-context';
import { NestedBlockEditor } from '../../../editor/nested-block-editor';

interface FrameBlockProps {
  block: CMSFrameBlock;
  settings?: EditorSettings;
}

export const FrameBlock = ({ block, settings }: FrameBlockProps) => {
  const { getPluginFromBlockType } = useEditorContext();
  const { editMode } = settings || {};

  if (!block.data) return null;

  const { title, children = [] } = block.data;

  return (
    <div
      className={cn(
        'frame-block rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-4',
        {
          'min-h-[100px]': editMode,
        }
      )}
    >
      {title && (
        <h3 className="mb-3 text-sm font-medium text-neutral-700">{title}</h3>
      )}

      {editMode ? (
        <NestedBlockEditor parentId={block.id} blocks={children} />
      ) : (
        // Preview mode - render children directly
        <div className="space-y-4">
          {children.map((child) => {
            const plugin = getPluginFromBlockType(child.type);
            if (!plugin) return null;
            return (
              <div key={child.id}>
                {plugin.renderingBlock(
                  { ...child, context: undefined },
                  settings
                )}
              </div>
            );
          })}
        </div>
      )}

      {editMode && children.length === 0 && (
        <div className="flex items-center justify-center py-8 text-sm text-neutral-400">
          Glissez des blocs ici
        </div>
      )}
    </div>
  );
};
