import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { CMSBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';

import { useEditorContext } from '../store/editor-context';
import { EditorBlock } from './editor-block';
import { GHOST_BLOCK_ID } from '../constants';

type SortableBlockProps = {
  block: CMSBlock;
  disabled: boolean;
};

const SortableBlock = React.memo(function SortableBlock({
  block,
  disabled,
}: SortableBlockProps) {
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
    disabled: disabled,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  });

  const style = React.useMemo<React.CSSProperties>(
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
        'bg-white',
        isGhost && 'border-2 border-dashed border-primary/50 rounded-lg'
      )}
      {...attributes}
      {...listeners}
    >
      <EditorBlock {...block} />
    </div>
  );
});

export const EditorPreview = React.memo(function EditorPreview() {
  const {
    content,
    settings: { previewMode },
  } = useEditorContext();

  const { setNodeRef } = useDroppable({
    id: 'editor-preview-drop-zone',
  });


  const blockIds = React.useMemo(
    () => content.map((block) => block.id),
    [content]
  );

  return (
    <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={cn(
          'editor-preview',
          'h-full w-full',
          'px-6 py-[30px]',
          'overflow-y-auto',
          '@container',
          'flex justify-center',
          {
            '[&>div]:w-[322px] [&>div]:max-w-[322px]': previewMode === 'mobile',
            '[&>div]:w-[882px] [&>div]:max-w-[882px]': previewMode === 'desktop',
          }
        )}
      >
        <div
          className={cn(
            'flex min-h-screen flex-col gap-y-6 bg-white px-5 py-9 transition-colors'
          )}
        >
          {content.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground">
              Drag blocks here to add content
            </div>
          ) : (
            content.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                disabled={previewMode !== false}
              />
            ))
          )}
        </div>
      </div>
    </SortableContext>
  );
});
