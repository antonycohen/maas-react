import React, { useMemo } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';

import { CMSBlock } from '@maas/core-api-models';
import { cn, findBlockInTree } from '@maas/core-utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@maas/web-components';

import { EditorActionsBar } from './editor/editor-actions-bar';
import { EditorContainer } from './editor/editor-container';
import { EditorContextualPanel } from './editor/editor-contextual-panel';
import { EditorPreview } from './editor/editor-preview';
import { EditorTools } from './editor/editor-tools';
import { useEditorDragDrop } from './editor/use-editor-drag-drop';
import { EditorProvider } from './store/editor-provider';
import { useEditorContext } from './store/editor-context';
import { EditorPlugin } from './types';
import { TOOL_ID_PREFIX } from './constants';

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

function EditorMain() {
  const { content, setContent, plugins, context, settings } =
    useEditorContext();

  const {
    activeId,
    isDraggingFromToolbar,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useEditorDragDrop({ content, setContent, plugins });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ===========================================================================
  // OVERLAY RENDERING
  // ===========================================================================
  const activePlugin = useMemo(
    () =>
      activeId?.startsWith(TOOL_ID_PREFIX)
        ? plugins.find((p) => p.name === activeId.replace(TOOL_ID_PREFIX, ''))
        : null,
    [activeId, plugins],
  );

  const activeBlock = useMemo(
    () =>
      activeId && !activeId.startsWith(TOOL_ID_PREFIX)
        ? findBlockInTree(content, activeId)
        : null,
    [activeId, content],
  );

  const activeBlockPlugin = useMemo(
    () =>
      activeBlock
        ? plugins.find((p) => p.blockType === activeBlock.type)
        : null,
    [activeBlock, plugins],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
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
            <EditorPreview isDraggingFromToolbar={isDraggingFromToolbar} />
          </ResizablePanel>
          {settings.previewMode === false && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={'326px'}>
                <EditorContextualPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </main>

      <DragOverlay
        modifiers={[restrictToFirstScrollableAncestor]}
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
          <div
            className={cn(
              '@container bg-white',
              settings.previewMode === 'mobile' ? 'w-[322px]' : 'w-[882px]',
            )}
          >
            {activeBlockPlugin.renderingBlock(
              { ...activeBlock, context },
              { ...settings, isDragging: true },
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
