import { Folder } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import {
  IconFolder,
  IconFolderPlus,
  IconGripVertical,
} from '@tabler/icons-react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorder } from '@maas/core-utils';

type FolderWithColor = Folder & { color?: string | null };

// Helper to convert dnd-kit transform to CSS string
function transformToString(
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null,
): string | undefined {
  if (!transform) return undefined;
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
}

type FoldersPanelProps = {
  folders: FolderWithColor[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onAddFolder: () => void;
  onReorder: (reorderedFolders: FolderWithColor[]) => void;
  isLoading?: boolean;
};

type SortableFolderItemProps = {
  folder: FolderWithColor;
  isSelected: boolean;
  onSelect: () => void;
};

function SortableFolderItem({
  folder,
  isSelected,
  onSelect,
}: SortableFolderItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  const style = {
    transform: transformToString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
      }`}
    >
      <button
        type="button"
        className="h-6 w-6 flex items-center justify-center shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <IconGripVertical className="h-3 w-3" />
      </button>
      <IconFolder
        className="h-4 w-4 shrink-0"
        style={{ color: folder.color || 'currentColor' }}
      />
      <span className="flex-1 truncate">{folder.name}</span>
      <span className="text-xs text-muted-foreground">
        {folder.articleCount ?? folder.articles?.length ?? 0}
      </span>
    </div>
  );
}

export function FoldersPanel({
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onReorder,
  isLoading,
}: FoldersPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = folders.findIndex((f) => f.id === active.id);
      const newIndex = folders.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(reorder(folders, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">Folders</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddFolder}
          className="h-7 w-7 p-0"
        >
          <IconFolderPlus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : (
            <>
              {folders.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={folders.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {folders.map((folder) => (
                      <SortableFolderItem
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedFolderId === folder.id}
                        onSelect={() => onSelectFolder(folder.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <IconFolderPlus className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No folders yet</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={onAddFolder}
                    className="mt-1"
                  >
                    Create one
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
