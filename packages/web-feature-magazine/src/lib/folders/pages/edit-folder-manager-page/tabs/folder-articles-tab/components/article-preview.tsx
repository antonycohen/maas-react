import { Article } from '@maas/core-api-models';
import { Button, Skeleton } from '@maas/web-components';
import { IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useRoutes } from '@maas/core-workspace';

type ArticlePreviewProps = {
    article: Article | null;
    isLoading?: boolean;
};

export function ArticlePreview({ article, isLoading }: ArticlePreviewProps) {
    const routes = useRoutes();

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-muted-foreground flex h-full items-center justify-center">
                <p className="text-sm">Select an article to preview</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="truncate font-semibold">{article.title}</h3>
                <Button variant="outline" size="sm" asChild>
                    <Link to={routes.articleEdit(article.id)}>
                        <IconExternalLink className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </Button>
            </div>
            <div className="flex-1 space-y-4 overflow-auto p-4">
                {article.featuredImage && (
                    <div className="bg-muted aspect-video overflow-hidden rounded-lg">
                        <img
                            src={article.featuredImage.url ?? undefined}
                            alt={article.title ?? ''}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        {article.type && <span className="bg-muted rounded px-2 py-0.5">{article.type.name}</span>}
                        {article.isPublished === false && <span className="text-orange-600">Draft</span>}
                    </div>
                    {article.description && <p className="text-muted-foreground text-sm">{article.description}</p>}
                </div>
            </div>
        </div>
    );
}
