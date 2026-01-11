import { Article } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import {
  IconExternalLink,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorder } from '@maas/core-utils';

// Helper to convert dnd-kit transform to CSS string
function transformToString(
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null
): string | undefined {
  if (!transform) return undefined;
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
}

type ArticlesListProps = {
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onRemoveArticle: (articleId: string) => void;
  onReorder: (reorderedArticles: Article[]) => void;
  isLoading?: boolean;
};

type SortableArticleItemProps = {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  workspaceUrl: string;
};

function SortableArticleItem({
  article,
  isSelected,
  onSelect,
  onRemove,
  workspaceUrl,
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
      <div className="flex items-center gap-1 shrink-0">
        <Button
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
    </div>
  );
}

export function ArticlesList({
  articles,
  selectedArticleId,
  onSelectArticle,
  onRemoveArticle,
  onReorder,
  isLoading,
}: ArticlesListProps) {
  const workspaceUrl = useCurrentWorkspaceUrlPrefix();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-sm">No articles in this folder</p>
        <p className="text-xs mt-1">Click "Add Article" to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={articles.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-2 space-y-1">
            {articles.map((article) => (
              <SortableArticleItem
                key={article.id}
                article={article}
                isSelected={selectedArticleId === article.id}
                onSelect={() => onSelectArticle(article.id)}
                onRemove={() => onRemoveArticle(article.id)}
                workspaceUrl={workspaceUrl}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </ScrollArea>
  );
}
