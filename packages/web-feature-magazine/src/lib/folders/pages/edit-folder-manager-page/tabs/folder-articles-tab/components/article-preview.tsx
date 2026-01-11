import { Article } from '@maas/core-api-models';
import { Button, Skeleton } from '@maas/web-components';
import { IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

type ArticlePreviewProps = {
  article: Article | null;
  isLoading?: boolean;
};

export function ArticlePreview({ article, isLoading }: ArticlePreviewProps) {
  const workspaceUrl = useCurrentWorkspaceUrlPrefix();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">Select an article to preview</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold truncate">{article.title}</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to={`${workspaceUrl}/articles/${article.id}`}>
            <IconExternalLink className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {article.featuredImage && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={article.featuredImage.url ?? undefined}
              alt={article.title ?? ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {article.type && (
              <span className="bg-muted px-2 py-0.5 rounded">
                {article.type.name}
              </span>
            )}
            {article.isPublished === false && (
              <span className="text-orange-600">Draft</span>
            )}
          </div>
          {article.description && (
            <p className="text-sm text-muted-foreground">
              {article.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
