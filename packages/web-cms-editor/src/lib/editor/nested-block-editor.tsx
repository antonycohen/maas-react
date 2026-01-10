import React, { useCallback, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';

import { CMSBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@maas/web-components';

import { useEditorContext } from '../store/editor-context';
import { NestedEditorBlock } from './nested-editor-block';
import { GHOST_BLOCK_ID } from '../constants';

interface NestedBlockEditorProps {
  parentId: string;
  blocks: CMSBlock[];
}

interface NestedSortableBlockProps {
  block: CMSBlock;
  parentId: string;
}

const NestedSortableBlock = React.memo(function NestedSortableBlock({
  block,
  parentId,
}: NestedSortableBlockProps) {
  const isGhost = block.id === GHOST_BLOCK_ID;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      parentId,
      isNested: true,
    },
  });

  const style = useMemo<React.CSSProperties>(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition,
      opacity: isDragging ? 0.5 : isGhost ? 0.7 : 1,
      zIndex: isDragging ? 10 : isGhost ? 5 : 0,
      position: 'relative' as const,
    }),
    [transform, transition, isDragging, isGhost]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded',
        isGhost && 'border-2 border-dashed border-primary/50 rounded-lg'
      )}
      {...attributes}
      {...listeners}
    >
      <NestedEditorBlock block={block} parentId={parentId} />
    </div>
  );
});

export const NestedBlockEditor = React.memo(function NestedBlockEditor({
  parentId,
  blocks,
}: NestedBlockEditorProps) {
  const { getPluginsForContext, addBlockToParent } = useEditorContext();

  // Get plugins available for nested context (excludes frame)
  const availablePlugins = useMemo(
    () => getPluginsForContext(true),
    [getPluginsForContext]
  );

  // Full container is a drop zone
  const { setNodeRef } = useDroppable({
    id: `nested-drop-zone-${parentId}`,
    data: {
      parentId,
      isNestedDropZone: true,
    },
  });

  const blockIds = useMemo(() => blocks.map((block) => block.id), [blocks]);

  const handleAddBlock = useCallback(
    (pluginName: string) => {
      const plugin = availablePlugins.find((p) => p.name === pluginName);
      if (plugin) {
        addBlockToParent(structuredClone(plugin.shape), parentId);
      }
    },
    [availablePlugins, addBlockToParent, parentId]
  );

  return (
    <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className="nested-block-editor min-h-[60px] space-y-3"
      >
        {blocks.map((block) => (
          <NestedSortableBlock key={block.id} block={block} parentId={parentId} />
        ))}

        {/* Add block button */}
        <div className="flex justify-center pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Ajouter un bloc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {availablePlugins.map((plugin) => (
                <DropdownMenuItem
                  key={plugin.name}
                  onClick={() => handleAddBlock(plugin.name)}
                  className="gap-2"
                >
                  <span className="[&>svg]:h-4 [&>svg]:w-4">{plugin.icon}</span>
                  {plugin.displayName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </SortableContext>
  );
});
