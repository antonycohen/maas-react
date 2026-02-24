import { Article } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

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
};

function SortableArticleItem({ article, isSelected, onSelect, onRemove }: SortableArticleItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.id });

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
            className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
            }`}
        >
            <button
                type="button"
                className="text-muted-foreground flex h-6 w-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
            >
                <IconGripVertical className="h-3 w-3" />
            </button>
            <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{article.title}</div>
                <div className="mt-0.5 flex items-center gap-2">
                    {article.type && <span className="text-muted-foreground text-xs">{article.type.name}</span>}
                    {article.isPublished === false && <span className="text-xs text-orange-600">Draft</span>}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="text-destructive hover:text-destructive h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
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
            <div className="space-y-2 p-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm">No articles in this folder</p>
                <p className="mt-1 text-xs">Click "Add Article" to get started</p>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={articles.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1 p-2">
                        {articles.map((article) => (
                            <SortableArticleItem
                                key={article.id}
                                article={article}
                                isSelected={selectedArticleId === article.id}
                                onSelect={() => onSelectArticle(article.id)}
                                onRemove={() => onRemoveArticle(article.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </ScrollArea>
    );
}
