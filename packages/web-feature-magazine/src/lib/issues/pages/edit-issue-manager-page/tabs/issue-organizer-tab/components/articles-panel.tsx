import { Article, Folder } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import { IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';

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

type ArticlesPanelProps = {
  folder: FolderWithColor | null;
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onAddArticle: () => void;
  onDeleteFolder?: () => void;
  onDeleteArticle: (articleId: string) => void;
  onReorder: (reorderedArticles: Article[]) => void;
  isLoading?: boolean;
};

type SortableArticleItemProps = {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

function SortableArticleItem({
  article,
  isSelected,
  onSelect,
  onRemove,
}: SortableArticleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

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
      className={`group w-full flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors cursor-pointer ${
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
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium">{article.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          {article.type && (
            <span className="text-xs text-muted-foreground">
              {article.type.name}
            </span>
          )}
          {article.isPublished === false && (
            <span className="text-xs text-orange-600">Draft</span>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
      >
        <IconTrash className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function ArticlesPanel({
  folder,
  articles,
  selectedArticleId,
  onSelectArticle,
  onAddArticle,
  onDeleteFolder,
  onDeleteArticle,
  onReorder,
  isLoading,
}: ArticlesPanelProps) {
  const title = folder?.name || 'Select a folder';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = articles.findIndex((a) => a.id === active.id);
      const newIndex = articles.findIndex((a) => a.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(reorder(articles, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="flex h-full flex-col border-x">
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{
          borderTopWidth: folder?.color ? '3px' : '0',
          borderTopColor: folder?.color || 'transparent',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold truncate">{title}</span>
          {folder?.isPublished === false && (
            <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded shrink-0">
              Draft
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {folder && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDeleteFolder}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAddArticle}
            className="h-7 w-7 p-0"
            disabled={!folder}
          >
            <IconPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {!folder ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <p>Select a folder to view articles</p>
            </div>
          ) : isLoading ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : (
            <>
              {articles.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={articles.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {articles.map((article) => (
                      <SortableArticleItem
                        key={article.id}
                        article={article}
                        isSelected={selectedArticleId === article.id}
                        onSelect={() => onSelectArticle(article.id)}
                        onRemove={() => onDeleteArticle(article.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>No articles in this folder</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={onAddArticle}
                    className="mt-1"
                  >
                    Add one
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
