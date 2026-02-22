import { Article, Folder } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
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
    transform: { x: number; y: number; scaleX: number; scaleY: number } | null
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
    const { t } = useTranslation();
    const title = folder?.name || t('folders.selectFolder');

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

    return (
        <div className="flex h-full flex-col border-x">
            <div
                className="flex items-center justify-between border-b px-3 py-2"
                style={{
                    borderTopWidth: folder?.color ? '3px' : '0',
                    borderTopColor: folder?.color || 'transparent',
                }}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-semibold">{title}</span>
                    {folder?.isPublished === false && (
                        <span className="shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
                            Draft
                        </span>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    {folder && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onDeleteFolder}
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                        >
                            <IconTrash className="h-4 w-4" />
                        </Button>
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
                <div className="space-y-1 p-2">
                    {!folder ? (
                        <div className="text-muted-foreground py-8 text-center text-sm">
                            <p>{t('folders.selectFolderToViewArticles')}</p>
                        </div>
                    ) : isLoading ? (
                        <>
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </>
                    ) : articles.length > 0 ? (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={articles.map((a) => a.id)} strategy={verticalListSortingStrategy}>
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
                        <div className="text-muted-foreground py-8 text-center text-sm">
                            <p>{t('folders.noArticles')}</p>
                            <Button type="button" variant="link" size="sm" onClick={onAddArticle} className="mt-1">
                                {t('folders.addOne')}
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
