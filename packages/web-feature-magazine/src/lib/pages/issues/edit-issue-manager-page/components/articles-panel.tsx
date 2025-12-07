import { Article, Folder } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import { IconEdit, IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react';

type ArticlesPanelProps = {
  folder: Folder | null;
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onAddArticle: () => void;
  onEditFolder?: () => void;
  onDeleteFolder?: () => void;
  onDeleteArticle: (articleId: string) => void;
  isLoading?: boolean;
};

export function ArticlesPanel({
  folder,
  articles,
  selectedArticleId,
  onSelectArticle,
  onAddArticle,
  onEditFolder,
  onDeleteFolder,
  onDeleteArticle,
  isLoading,
}: ArticlesPanelProps) {
  const title = folder?.name || 'Select a folder';

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
                variant="ghost"
                size="sm"
                onClick={onEditFolder}
                className="h-7 w-7 p-0"
              >
                <IconEdit className="h-4 w-4" />
              </Button>
              <Button
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
              {articles.map((article) => (
                <div
                  key={article.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectArticle(article.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectArticle(article.id);
                    }
                  }}
                  className={`group w-full flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors cursor-pointer ${
                    selectedArticleId === article.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <IconGripVertical className="h-3 w-3 shrink-0 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{article.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {article.type && (
                        <span className="text-xs text-muted-foreground">
                          {article.type}
                        </span>
                      )}
                      {article.isPublished === false && (
                        <span className="text-xs text-orange-600">Draft</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArticle(article.id);
                    }}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                  >
                    <IconTrash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>No articles in this folder</p>
                  <Button
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
