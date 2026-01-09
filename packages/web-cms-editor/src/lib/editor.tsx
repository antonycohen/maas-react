import React, { useRef } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';

import { CMSBlock } from '@maas/core-api-models';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@maas/web-components';

import { EditorActionsBar } from './editor/editor-actions-bar';
import { EditorContainer } from './editor/editor-container';
import { EditorContextualPanel } from './editor/editor-contextual-panel';
import { EditorPreview } from './editor/editor-preview';
import { EditorTools } from './editor/editor-tools';
import { EditorProvider } from './store/editor-provider';
import { useEditorContext } from './store/editor-context';
import { EditorPlugin } from './types';
import { GHOST_BLOCK_ID, TOOL_ID_PREFIX } from './constants';

export interface EditorProps<T> {
  field: {
    data: CMSBlock[];
    errors: string[] | undefined;
    onSave: (content: CMSBlock[]) => void;
  };
  plugins?: EditorPlugin<any, any, T>[];
  children?: React.ReactNode;
  context?: T;
  onSave: () => void;
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

// Throttle interval in ms - adjust for performance vs responsiveness
const DRAG_THROTTLE_MS = 50;

function EditorMain() {
  const { content, setContent, plugins, context, settings } =
    useEditorContext();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [ghostBlock, setGhostBlock] = React.useState<CMSBlock | null>(null);

  // Refs for throttling drag over updates
  const lastOverIdRef = useRef<string | null>(null);
  const lastDragUpdateRef = useRef<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const removeGhostBlock = React.useCallback(() => {
    setGhostBlock(null);
    setContent(content.filter((block) => block.id !== GHOST_BLOCK_ID));
  }, [content, setContent]);

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    // Reset throttle refs on drag start
    lastOverIdRef.current = null;
    lastDragUpdateRef.current = 0;
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      // Skip if over same element (no change)
      if (lastOverIdRef.current === overIdStr) return;

      // Throttle updates for performance
      const now = Date.now();
      if (now - lastDragUpdateRef.current < DRAG_THROTTLE_MS) return;

      lastOverIdRef.current = overIdStr;
      lastDragUpdateRef.current = now;

      // Handle tool item being dragged over preview
      if (activeIdStr.startsWith(TOOL_ID_PREFIX)) {
        const pluginName = activeIdStr.replace(TOOL_ID_PREFIX, '');
        const plugin = plugins.find((p) => p.name === pluginName);

        if (plugin) {
          // Create ghost block if it doesn't exist
          if (!ghostBlock) {
            const newGhost: CMSBlock = {
              ...structuredClone(plugin.shape),
              id: GHOST_BLOCK_ID,
            };
            setGhostBlock(newGhost);

            // Insert ghost at the appropriate position
            if (overIdStr === 'editor-preview-drop-zone') {
              setContent([...content, newGhost]);
            } else {
              const overIndex = content.findIndex(
                (block) => block.id === overIdStr,
              );
              if (overIndex !== -1) {
                const newContent = [...content];
                newContent.splice(overIndex, 0, newGhost);
                setContent(newContent);
              } else {
                setContent([...content, newGhost]);
              }
            }
          } else {
            // Ghost exists, move it to new position
            const ghostIndex = content.findIndex(
              (block) => block.id === GHOST_BLOCK_ID,
            );

            if (overIdStr === 'editor-preview-drop-zone') {
              // Move to end if dropping on the drop zone
              if (ghostIndex !== content.length - 1) {
                const withoutGhost = content.filter(
                  (block) => block.id !== GHOST_BLOCK_ID,
                );
                setContent([...withoutGhost, ghostBlock]);
              }
            } else if (overIdStr !== GHOST_BLOCK_ID) {
              const overIndex = content.findIndex(
                (block) => block.id === overIdStr,
              );
              if (
                overIndex !== -1 &&
                ghostIndex !== -1 &&
                ghostIndex !== overIndex
              ) {
                setContent(arrayMove(content, ghostIndex, overIndex));
              }
            }
          }
        }
      } else {
        // Handle reordering existing blocks
        if (
          overIdStr !== activeIdStr &&
          !overIdStr.startsWith(TOOL_ID_PREFIX) &&
          overIdStr !== 'editor-preview-drop-zone' &&
          overIdStr !== GHOST_BLOCK_ID
        ) {
          const oldIndex = content.findIndex(
            (block) => block.id === activeIdStr,
          );
          const newIndex = content.findIndex((block) => block.id === overIdStr);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            setContent(arrayMove(content, oldIndex, newIndex));
          }
        }
      }
    },
    [content, ghostBlock, plugins, setContent],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      const activeIdStr = active.id as string;

      // Check if dragging a tool item
      if (activeIdStr.startsWith(TOOL_ID_PREFIX)) {
        if (over && ghostBlock) {
          // Convert ghost to real block
          const realId = crypto.randomUUID();
          setContent(
            content.map((block) =>
              block.id === GHOST_BLOCK_ID ? { ...block, id: realId } : block,
            ),
          );
        } else {
          // Drag cancelled or dropped outside - remove ghost
          removeGhostBlock();
        }
        setGhostBlock(null);
      }
    },
    [content, ghostBlock, removeGhostBlock, setContent],
  );

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null);
    removeGhostBlock();
    setGhostBlock(null);
  }, [removeGhostBlock]);

  // Memoized computed values for overlay
  const activePlugin = React.useMemo(
    () =>
      activeId?.startsWith(TOOL_ID_PREFIX)
        ? plugins.find((p) => p.name === activeId.replace(TOOL_ID_PREFIX, ''))
        : null,
    [activeId, plugins],
  );

  const activeBlock = React.useMemo(
    () =>
      activeId && !activeId.startsWith(TOOL_ID_PREFIX)
        ? content.find((block) => block.id === activeId)
        : null,
    [activeId, content],
  );

  const activeBlockPlugin = React.useMemo(
    () =>
      activeBlock
        ? plugins.find((p) => p.blockType === activeBlock.type)
        : null,
    [activeBlock, plugins],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="editor-blocks flex h-full w-full flex-1 overflow-hidden bg-muted">
        <EditorTools />
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize={70} minSize={30}>
            <EditorPreview />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={'326px'}>
            <EditorContextualPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activePlugin ? (
          <div className="flex h-[45px] w-[80px] items-center justify-center gap-x-2.5 rounded-lg border border-primary bg-white shadow-lg">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground [&>svg]:h-4 [&>svg]:w-4">
              {activePlugin.icon}
            </span>
          </div>
        ) : activeBlock && activeBlockPlugin ? (
          <div className="bg-white shadow-xl rounded-lg border-2 border-primary overflow-hidden">
            {activeBlockPlugin.renderingBlock(
              { ...activeBlock, context },
              settings,
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function Editor<T>(props: EditorProps<T>) {
  const { field, plugins = [], onSave, children, context } = props;

  return (
    <EditorProvider field={field} plugins={plugins} context={context}>
      {children}
      <EditorContainer>
        <EditorActionsBar onSave={onSave} />
        <EditorMain />
      </EditorContainer>
    </EditorProvider>
  );
}

Editor.displayName = 'Editor';

export { Editor };
