import { Article } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import { IconGripVertical, IconTrash, IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

type ArticlesListProps = {
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onRemoveArticle: (articleId: string) => void;
  isLoading?: boolean;
};

export function ArticlesList({
  articles,
  selectedArticleId,
  onSelectArticle,
  onRemoveArticle,
  isLoading,
}: ArticlesListProps) {
  const workspaceUrl = useCurrentWorkspaceUrlPrefix();

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
      <div className="p-2 space-y-1">
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
                    {article.type.name}
                  </span>
                )}
                {article.isPublished === false && (
                  <span className="text-xs text-orange-600">Draft</span>
                )}
                {article.isFeatured && (
                  <span className="text-xs text-blue-600">Featured</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <Link to={`${workspaceUrl}/articles/${article.id}`}>
                  <IconExternalLink className="h-3 w-3" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveArticle(article.id);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
              >
                <IconTrash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
