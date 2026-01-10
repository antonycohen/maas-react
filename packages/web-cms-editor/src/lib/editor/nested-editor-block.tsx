import React, { useCallback, useMemo } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';

import { CMSBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { Button } from '@maas/web-components';

import { useEditorContext } from '../store/editor-context';

interface NestedEditorBlockProps {
  block: CMSBlock;
  parentId: string;
}

export const NestedEditorBlock = React.memo(function NestedEditorBlock({
  block,
  parentId,
}: NestedEditorBlockProps) {
  const { id: blockId, type: blockType } = block;

  const {
    context,
    settings,
    selectedBlockId,
    setSelectedBlockId,
    setSettings,
    setSelectedPlugin,
    getPluginFromBlockType,
    deleteBlockById,
  } = useEditorContext();

  const { previewMode, editMode } = settings;

  const blockRef = React.useRef<HTMLDivElement>(null);
  const isSelected = blockId === selectedBlockId;

  const selectBlock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent parent frame from being selected
      if (previewMode) return;
      setSelectedBlockId(blockId, parentId);
      setSelectedPlugin(getPluginFromBlockType(blockType));
    },
    [
      previewMode,
      blockId,
      parentId,
      blockType,
      setSelectedBlockId,
      setSelectedPlugin,
      getPluginFromBlockType,
    ],
  );

  const deleteBlock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedBlockId(null);
      setSelectedPlugin(null);
      deleteBlockById(blockId);
    },
    [blockId, deleteBlockById, setSelectedBlockId, setSelectedPlugin],
  );

  const setHoveredBlockId = useCallback(
    (value: string | null) => {
      setSettings((prev) => ({
        ...prev,
        hoveredBlockId: value,
      }));
    },
    [setSettings],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredBlockId(blockId);
    },
    [blockId, setHoveredBlockId],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredBlockId(null);
    },
    [setHoveredBlockId],
  );

  const plugin = useMemo(
    () => getPluginFromBlockType(blockType),
    [blockType, getPluginFromBlockType],
  );

  return (
    <div
      ref={blockRef}
      onClick={selectBlock}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('nested-editor-block relative transition-colors rounded', {
        'border border-dashed border-muted p-2': editMode,
        'border-primary border border-solid hover:border-solid':
          editMode && isSelected,
        'hover:border-primary/50': editMode && !isSelected,
      })}
    >
      {isSelected && (
        <div className="absolute -top-7 -left-px flex h-7 w-fit cursor-default items-center justify-center gap-x-1 rounded-t-md border border-muted bg-white px-2 text-xs">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
          <span className="[&>svg]:h-3 [&>svg]:w-3">{plugin?.icon}</span>
        </div>
      )}

      {plugin?.renderingBlock({ ...block, context }, settings)}

      {isSelected && (
        <div className="absolute -top-7 -right-px flex h-7 w-fit cursor-default items-center justify-center rounded-t-md border border-muted bg-white px-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-destructive hover:text-destructive"
            onClick={deleteBlock}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
});
