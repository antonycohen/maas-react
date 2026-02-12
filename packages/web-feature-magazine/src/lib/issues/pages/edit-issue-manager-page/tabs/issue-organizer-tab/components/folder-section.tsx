import { Article, Folder } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@maas/web-components';
import { IconChevronDown, IconEdit, IconFolder, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { ArticleItem } from './article-item';

// Extended Folder type with full Article data for UI display
export type FolderWithArticles = Omit<Folder, 'articles'> & {
    articles: Article[];
};

type FolderSectionProps = {
    folder: FolderWithArticles;
    onEditFolder?: (folder: FolderWithArticles) => void;
    onDeleteFolder?: (folderId: string) => void;
    onEditArticle?: (article: Article, folderId: string) => void;
    onDeleteArticle?: (articleId: string) => void;
    onAddArticle?: (folderId: string) => void;
};

export function FolderSection({
    folder,
    onEditFolder,
    onDeleteFolder,
    onEditArticle,
    onDeleteArticle,
    onAddArticle,
}: FolderSectionProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/folder">
            <div
                className="bg-card flex items-center gap-2 rounded-lg border p-3"
                style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: 'var(--border)',
                }}
            >
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                    </Button>
                </CollapsibleTrigger>
                <IconFolder className="h-5 w-5" style={{ color: 'currentColor' }} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{folder.name}</span>
                        <span className="text-muted-foreground text-xs">
                            {folder.articles.length} article{folder.articles.length !== 1 ? 's' : ''}
                        </span>
                        {folder.isPublished === false && (
                            <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                                {t('status.draft')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/folder:opacity-100">
                    <Button type="button" variant="ghost" size="sm" onClick={() => onAddArticle?.(folder.id)}>
                        <IconPlus className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onEditFolder?.(folder)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteFolder?.(folder.id)}
                        className="text-destructive hover:text-destructive"
                    >
                        <IconTrash className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <CollapsibleContent>
                <div className="mt-2 ml-6 space-y-2 border-l-2 pl-4">
                    {folder.articles.length === 0 ? (
                        <div className="text-muted-foreground py-4 text-center text-sm">
                            {t('folders.noArticlesInFolder')}{' '}
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => onAddArticle?.(folder.id)}
                            >
                                {t('folders.addOne')}
                            </button>
                        </div>
                    ) : (
                        folder.articles.map((article) => (
                            <ArticleItem
                                key={article.id}
                                article={article}
                                onEdit={() => onEditArticle?.(article, folder.id)}
                                onDelete={() => onDeleteArticle?.(article.id)}
                            />
                        ))
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
