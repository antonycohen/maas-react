import React, { ReactNode, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

import { cn } from '@maas/core-utils';

import { useEditorContext } from '../store/editor-context';
import { TOOL_ID_PREFIX } from '../constants';
import { EditorPlugin } from '../types';

type ToolItemProps = {
  id: string;
  displayName: string;
  icon: ReactNode;
  onClick: () => void;
};

const ToolItem = React.memo(function ToolItem({
  id,
  displayName,
  icon,
  onClick,
}: ToolItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      className={cn(
        'h-[45px] w-full',
        'flex items-center rounded-lg',
        'mb-[10px] cursor-grab select-none gap-x-2.5 border border-border transition-colors',
        'hover:border-primary active:bg-muted active:cursor-grabbing',
        isDragging && 'opacity-50',
      )}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span className="text-foreground text-sm font-medium">{displayName}</span>
    </button>
  );
});

export const EditorTools = React.memo(function EditorTools() {
  const {
    plugins,
    addBlock,
    settings: { editMode },
  } = useEditorContext();

  const handleAddBlock = useCallback(
    (plugin: EditorPlugin<any, any, any>) => {
      const newBlock = structuredClone(plugin.shape);
      newBlock.id = crypto.randomUUID();
      addBlock(newBlock);
    },
    [addBlock],
  );

  if (!editMode) return null;

  return (
    <div className="editor-tools h-full w-[200px] flex-none overflow-y-auto bg-white p-2 ">
      {plugins.map((plugin) => (
        <ToolItem
          key={plugin.name}
          id={`${TOOL_ID_PREFIX}${plugin.name}`}
          icon={plugin.icon}
          displayName={plugin.displayName}
          onClick={() => handleAddBlock(plugin)}
        />
      ))}
    </div>
  );
});
