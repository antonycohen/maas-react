import { useCallback, useRef, useState } from 'react';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { CMSBlock, CMSFrameBlock } from '@maas/core-api-models';
import {
  deleteBlockFromTree,
  findBlockInTree,
  updateBlockInTree,
} from '@maas/core-utils';

import { EditorPlugin } from '../types';
import { GHOST_BLOCK_ID, TOOL_ID_PREFIX } from '../constants';

const DRAG_THROTTLE_MS = 50;

// ============================================================================
// DRAG & DROP RULES:
// 1. Tool drag: Creates ghost block, can drop at root or inside frames
// 2. Block reorder: Same container only during drag, cross-container on drop
// 3. Frames cannot be nested inside other frames
// 4. Root blocks ignore nested drop zones during reorder
// ============================================================================

type DragContext = {
  activeId: string;
  overId: string;
  activeParentId: string | null;
  targetParentId: string | null;
  isToolDrag: boolean;
  isNestedTarget: boolean;
};

function parseDragContext(
  active: DragOverEvent['active'],
  over: NonNullable<DragOverEvent['over']>,
  plugins: EditorPlugin<any, any, any>[],
  content: CMSBlock[],
): DragContext {
  const activeId = active.id as string;
  const overId = over.id as string;
  const activeData = active.data.current;
  const overData = over.data.current;

  const isToolDrag = activeId.startsWith(TOOL_ID_PREFIX);
  const activeParentId = activeData?.parentId ?? null;

  // Check if hovering over a container block (e.g., frame)
  let isOverContainer = false;
  if (!overData?.isNestedDropZone && !overData?.isNested) {
    const overBlock = content.find((b) => b.id === overId);
    if (overBlock) {
      const overPlugin = plugins.find((p) => p.blockType === overBlock.type);
      isOverContainer = overPlugin?.dragDrop?.canContainChildren === true;
    }
  }

  // Determine target container
  let targetParentId: string | null = null;
  if (overData?.isNestedDropZone) {
    targetParentId = overData.parentId;
  } else if (isOverContainer) {
    // Hovering over a container block - target is inside it
    targetParentId = overId;
  } else if (overData?.parentId) {
    targetParentId = overData.parentId;
  }

  return {
    activeId,
    overId,
    activeParentId,
    targetParentId,
    isToolDrag,
    isNestedTarget:
      overData?.isNested || overData?.isNestedDropZone || isOverContainer,
  };
}

// ===========================================================================
// HELPER: Insert block at index in array
// ===========================================================================
function insertAt<T>(arr: T[], index: number, item: T): T[] {
  const result = [...arr];
  result.splice(index, 0, item);
  return result;
}

export interface UseEditorDragDropOptions {
  content: CMSBlock[];
  setContent: (content: CMSBlock[]) => void;
  plugins: EditorPlugin<any, any, any>[];
}

export interface UseEditorDragDropResult {
  activeId: string | null;
  ghostBlock: CMSBlock | null;
  isDraggingFromToolbar: boolean;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

export function useEditorDragDrop({
  content,
  setContent,
  plugins,
}: UseEditorDragDropOptions): UseEditorDragDropResult {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ghostBlock, setGhostBlock] = useState<CMSBlock | null>(null);
  const [ghostParentId, setGhostParentId] = useState<string | null>(null);

  const lastOverIdRef = useRef<string | null>(null);
  const lastDragTimeRef = useRef<number>(0);

  const isDraggingFromToolbar = activeId?.startsWith(TOOL_ID_PREFIX) ?? false;

  // ===========================================================================
  // HELPER: Get insertion index for root level
  // ===========================================================================
  const getRootInsertIndex = useCallback(
    (overId: string): number => {
      if (overId === 'editor-preview-drop-zone') {
        return content.length;
      }

      // Check for drop indicator
      if (overId.startsWith('drop-indicator-')) {
        return parseInt(overId.replace('drop-indicator-', ''), 10);
      }

      const index = content.findIndex((b) => b.id === overId);
      return index !== -1 ? index : content.length;
    },
    [content],
  );

  // ===========================================================================
  // TOOL DRAG: Handle dragging new blocks from toolbar
  // ===========================================================================
  const handleToolDrag = useCallback(
    (ctx: DragContext) => {
      const { activeId, overId, targetParentId } = ctx;
      const pluginName = activeId.replace(TOOL_ID_PREFIX, '');
      const plugin = plugins.find((p) => p.name === pluginName);

      if (!plugin) return;

      // Rule: Non-nestable plugins cannot go inside containers
      if (plugin.dragDrop?.canBeNested === false && targetParentId !== null) {
        return;
      }

      // Create ghost if not exists
      if (!ghostBlock) {
        const newGhost: CMSBlock = {
          ...structuredClone(plugin.shape),
          id: GHOST_BLOCK_ID,
        };
        setGhostBlock(newGhost);

        if (targetParentId) {
          // Insert into frame
          setContent(
            updateBlockInTree(content, targetParentId, (parent) => {
              const frame = parent as CMSFrameBlock;
              return {
                ...frame,
                data: {
                  ...frame.data,
                  children: [...(frame.data.children || []), newGhost],
                },
              };
            }),
          );
          setGhostParentId(targetParentId);
        } else {
          // Insert at root
          const index = getRootInsertIndex(overId);
          setContent(insertAt(content, index, newGhost));
          setGhostParentId(null);
        }
        return;
      }

      // Ghost exists - move it
      const currentParentId = ghostParentId;

      if (currentParentId === targetParentId) {
        // Same container - reorder
        if (targetParentId === null) {
          const ghostIndex = content.findIndex((b) => b.id === GHOST_BLOCK_ID);
          let newIndex = getRootInsertIndex(overId);

          // Adjust for ghost position when using drop indicators
          if (overId.startsWith('drop-indicator-') && ghostIndex < newIndex) {
            newIndex--;
          }

          if (ghostIndex !== -1 && newIndex !== -1 && ghostIndex !== newIndex) {
            setContent(arrayMove(content, ghostIndex, newIndex));
          }
        } else {
          // Reorder in frame
          setContent(
            updateBlockInTree(content, targetParentId, (parent) => {
              const frame = parent as CMSFrameBlock;
              const children = frame.data.children || [];
              const ghostIndex = children.findIndex(
                (b) => b.id === GHOST_BLOCK_ID,
              );
              const newIndex = children.findIndex((b) => b.id === overId);

              if (
                ghostIndex !== -1 &&
                newIndex !== -1 &&
                ghostIndex !== newIndex
              ) {
                return {
                  ...frame,
                  data: {
                    ...frame.data,
                    children: arrayMove(children, ghostIndex, newIndex),
                  },
                };
              }
              return frame;
            }),
          );
        }
      } else {
        // Different container - move ghost
        let updated = deleteBlockFromTree(content, GHOST_BLOCK_ID);

        if (targetParentId) {
          updated = updateBlockInTree(updated, targetParentId, (parent) => {
            const frame = parent as CMSFrameBlock;
            return {
              ...frame,
              data: {
                ...frame.data,
                children: [...(frame.data.children || []), ghostBlock],
              },
            };
          });
        } else {
          const index = getRootInsertIndex(overId);
          updated = insertAt(updated, index, ghostBlock);
        }

        setContent(updated);
        setGhostParentId(targetParentId);
      }
    },
    [
      content,
      ghostBlock,
      ghostParentId,
      plugins,
      setContent,
      getRootInsertIndex,
    ],
  );

  // ===========================================================================
  // BLOCK REORDER: Handle reordering existing blocks
  // ===========================================================================
  const handleBlockReorder = useCallback(
    (ctx: DragContext, overData: Record<string, unknown> | undefined) => {
      const {
        activeId,
        overId,
        activeParentId,
        targetParentId,
        isNestedTarget,
      } = ctx;

      // Skip invalid targets
      if (
        overId === activeId ||
        overId.startsWith(TOOL_ID_PREFIX) ||
        overId === GHOST_BLOCK_ID ||
        overId.startsWith('drop-indicator-')
      ) {
        return;
      }

      // Rule: Root blocks ignore nested drop zones during reorder
      if (activeParentId === null && overData?.isNestedDropZone) {
        return;
      }

      // Same container reordering
      if (activeParentId === targetParentId) {
        if (activeParentId === null) {
          // Root level reorder
          const oldIndex = content.findIndex((b) => b.id === activeId);
          const newIndex = content.findIndex((b) => b.id === overId);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            setContent(arrayMove(content, oldIndex, newIndex));
          }
        } else {
          // Nested reorder within same frame
          setContent(
            updateBlockInTree(content, activeParentId, (parent) => {
              const frame = parent as CMSFrameBlock;
              const children = frame.data.children || [];
              const oldIndex = children.findIndex((b) => b.id === activeId);
              const newIndex = children.findIndex((b) => b.id === overId);

              if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                return {
                  ...frame,
                  data: {
                    ...frame.data,
                    children: arrayMove(children, oldIndex, newIndex),
                  },
                };
              }
              return frame;
            }),
          );
        }
        return;
      }

      // Cross-container move: show preview during drag
      const block = findBlockInTree(content, activeId);
      if (!block) return;

      // Rule: Non-nestable blocks cannot move into containers
      const plugin = plugins.find((p) => p.blockType === block.type);
      if (plugin?.dragDrop?.canBeNested === false && targetParentId !== null) {
        return;
      }

      // Remove from current location
      let updated = deleteBlockFromTree(content, activeId);

      if (targetParentId) {
        // Moving to nested container
        updated = updateBlockInTree(updated, targetParentId, (parent) => {
          const frame = parent as CMSFrameBlock;
          const children = frame.data.children || [];
          // Find insertion index if over a nested block
          let insertIndex = children.length;
          if (overData?.isNested && !overData?.isNestedDropZone) {
            const overIndex = children.findIndex((b) => b.id === overId);
            if (overIndex !== -1) insertIndex = overIndex;
          }
          const newChildren = [...children];
          newChildren.splice(insertIndex, 0, block);
          return {
            ...frame,
            data: { ...frame.data, children: newChildren },
          };
        });
      } else {
        // Moving to root
        // If over nested content, use parent frame's position
        let insertIndex = updated.length;
        if (isNestedTarget && overData?.parentId) {
          insertIndex = updated.findIndex((b) => b.id === overData.parentId);
          if (insertIndex === -1) insertIndex = updated.length;
        } else {
          const overIndex = updated.findIndex((b) => b.id === overId);
          if (overIndex !== -1) insertIndex = overIndex;
        }
        updated = insertAt(updated, insertIndex, block);
      }

      setContent(updated);
    },
    [content, plugins, setContent],
  );

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  const handleDragStart = useCallback((event: DragStartEvent) => {
    lastOverIdRef.current = null;
    lastDragTimeRef.current = 0;
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const ctx = parseDragContext(active, over, plugins, content);

      // Skip if same target
      if (lastOverIdRef.current === ctx.overId) return;

      // Throttle only tool drags
      if (ctx.isToolDrag) {
        const now = Date.now();
        if (now - lastDragTimeRef.current < DRAG_THROTTLE_MS) return;
        lastDragTimeRef.current = now;
      }

      lastOverIdRef.current = ctx.overId;

      if (ctx.isToolDrag) {
        handleToolDrag(ctx);
      } else {
        handleBlockReorder(ctx, over.data.current);
      }
    },
    [handleToolDrag, handleBlockReorder, plugins, content],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      const activeIdStr = active.id as string;

      // Only tool drags need finalization (convert ghost to real block)
      if (activeIdStr.startsWith(TOOL_ID_PREFIX)) {
        if (over && ghostBlock) {
          const realId = crypto.randomUUID();

          if (ghostParentId) {
            setContent(
              updateBlockInTree(content, ghostParentId, (parent) => {
                const frame = parent as CMSFrameBlock;
                return {
                  ...frame,
                  data: {
                    ...frame.data,
                    children: (frame.data.children || []).map((b) =>
                      b.id === GHOST_BLOCK_ID ? { ...b, id: realId } : b,
                    ),
                  },
                };
              }),
            );
          } else {
            setContent(
              content.map((b) =>
                b.id === GHOST_BLOCK_ID ? { ...b, id: realId } : b,
              ),
            );
          }
        } else {
          // Cancelled - remove ghost
          setContent(deleteBlockFromTree(content, GHOST_BLOCK_ID));
        }

        setGhostBlock(null);
        setGhostParentId(null);
      }
      // Block reordering is already handled in handleDragOver with live preview
    },
    [content, ghostBlock, ghostParentId, setContent],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    if (ghostBlock) {
      setContent(deleteBlockFromTree(content, GHOST_BLOCK_ID));
    }
    setGhostBlock(null);
    setGhostParentId(null);
  }, [content, ghostBlock, setContent]);

  return {
    activeId,
    ghostBlock,
    isDraggingFromToolbar,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
