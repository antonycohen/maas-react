import { Article, Folder } from '@maas/core-api-models';
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/folder">
      <div
        className="flex items-center gap-2 rounded-lg border bg-card p-3"
        style={{
          borderLeftWidth: '4px',
          borderLeftColor: folder.color || 'var(--border)',
        }}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <IconChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`}
            />
          </Button>
        </CollapsibleTrigger>
        <IconFolder
          className="h-5 w-5"
          style={{ color: folder.color || 'currentColor' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{folder.name}</span>
            <span className="text-xs text-muted-foreground">
              {folder.articles.length} article{folder.articles.length !== 1 ? 's' : ''}
            </span>
            {folder.isPublished === false && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                Draft
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/folder:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onAddArticle?.(folder.id)}>
            <IconPlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEditFolder?.(folder)}>
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
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
        <div className="ml-6 mt-2 space-y-2 border-l-2 pl-4">
          {folder.articles.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No articles in this folder.{' '}
              <button
                className="text-primary hover:underline"
                onClick={() => onAddArticle?.(folder.id)}
              >
                Add one
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
