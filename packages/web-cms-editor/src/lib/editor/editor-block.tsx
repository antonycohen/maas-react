import React, { useCallback, useMemo } from 'react';
import { GripVertical, Copy, Trash2 } from 'lucide-react';

import { CMSBlock } from '@maas/core-api-models';
import { cn, useOnClickOutside, findBlockInTree } from '@maas/core-utils';
import { Button } from '@maas/web-components';

import { useEditorContext } from '../store/editor-context';

export const EditorBlock = React.memo(function EditorBlock(
  blockProps: CMSBlock
) {
  const { id: blockId, type: blockType } = blockProps;

  const {
    content,
    context,
    settings,
    selectedBlockId,
    selectedBlockContent,
    addBlock,
    setSelectedBlockId,
    setSettings,
    setSelectedPlugin,
    getPluginFromBlockType,
    deleteBlockById,
  } = useEditorContext();

  const { hoveredBlockId, pluginInputsHovered, previewMode, editMode } =
    settings;

  const blockRef = React.useRef<HTMLDivElement>(null);
  const isSelected = blockId === selectedBlockId;

  const selectBlock = useCallback(() => {
    if (previewMode) return;
    setSelectedBlockId(blockId);
    setSelectedPlugin(getPluginFromBlockType(blockType));
  }, [
    previewMode,
    blockId,
    blockType,
    setSelectedBlockId,
    setSelectedPlugin,
    getPluginFromBlockType,
  ]);

  const unselectBlock = useCallback(() => {
    if (hoveredBlockId === null && !pluginInputsHovered) {
      setSelectedBlockId(null);
      setSelectedPlugin(null);
    }
  }, [
    hoveredBlockId,
    pluginInputsHovered,
    setSelectedBlockId,
    setSelectedPlugin,
  ]);

  useOnClickOutside(blockRef, unselectBlock);

  const deleteBlock = useCallback(() => {
    setSelectedBlockId(null);
    setSelectedPlugin(null);
    deleteBlockById(blockId);
  }, [blockId, deleteBlockById, setSelectedBlockId, setSelectedPlugin]);

  const duplicateBlock = useCallback(() => {
    if (selectedBlockContent) {
      addBlock(structuredClone(selectedBlockContent));
    }
  }, [selectedBlockContent, addBlock]);

  const setHoveredBlockId = useCallback(
    (value: string | null) => {
      setSettings((prev) => ({
        ...prev,
        hoveredBlockId: value,
      }));
    },
    [setSettings]
  );

  const handleMouseEnter = useCallback(
    () => setHoveredBlockId(blockId),
    [blockId, setHoveredBlockId]
  );

  const handleMouseLeave = useCallback(
    () => setHoveredBlockId(null),
    [setHoveredBlockId]
  );

  // Only run effect when block is removed from content (recursive search for nested blocks)
  const blockExists = useMemo(
    () => findBlockInTree(content, blockId) !== null,
    [content, blockId]
  );

  React.useEffect(() => {
    if (!blockExists) {
      setSelectedBlockId(null);
      setSelectedPlugin(null);
    }
  }, [blockExists, setSelectedBlockId, setSelectedPlugin]);

  const plugin = useMemo(
    () => getPluginFromBlockType(blockType),
    [blockType, getPluginFromBlockType]
  );

  return (
    <div
      ref={blockRef}
      onClick={selectBlock}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('editor-block relative transition-colors', {
        'border-2 border-dashed border-muted p-2': editMode,
        'border-primary border-2 border-solid hover:border-solid':
          editMode && isSelected,
        'hover:border-primary/50': editMode && !isSelected,
        'h-[153px]': blockType === 'video' && previewMode === 'mobile',
        'h-[430px]': blockType === 'video' && previewMode !== 'mobile',
      })}
    >
      {isSelected && (
        <div className="absolute -top-9 -left-px flex h-9 w-fit cursor-default items-center justify-center gap-x-2 rounded-t-lg border border-muted p-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          {plugin?.icon}
        </div>
      )}

      {plugin?.renderingBlock({ ...blockProps, context }, settings)}

      {isSelected && (
        <div className="absolute -top-9 -right-px flex h-9 w-fit cursor-default items-center justify-center gap-x-2 rounded-t-lg border border-muted p-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={duplicateBlock}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={deleteBlock}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});
