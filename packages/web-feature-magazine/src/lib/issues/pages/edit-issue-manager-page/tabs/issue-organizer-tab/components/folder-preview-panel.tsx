import { Folder } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { Badge, Button, ScrollArea, Separator, Skeleton } from '@maas/web-components';
import { useRoutes } from '@maas/core-workspace';
import { publicUrlBuilders } from '@maas/core-routes';
import { IconEdit, IconExternalLink, IconEye, IconFileText, IconFolder, IconPhoto } from '@tabler/icons-react';
import { Link } from 'react-router';

type FolderPreviewPanelProps = {
    folder: Folder | null;
    isLoading?: boolean;
};

export function FolderPreviewPanel({ folder, isLoading }: FolderPreviewPanelProps) {
    const { t } = useTranslation();
    const routes = useRoutes();

    if (!folder && !isLoading) {
        return (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                <IconFolder className="mb-4 h-12 w-12 opacity-50" />
                <p className="text-sm">{t('folders.selectFolderToPreview')}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-4 py-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <div className="space-y-4 p-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                    <IconEye className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-semibold">{t('common.preview')}</span>
                </div>
                <div className="flex items-center gap-2">
                    {folder?.slug && (
                        <Button asChild size="sm" variant="outline">
                            <a
                                href={`${window.location.origin}${publicUrlBuilders.folder(folder.slug)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconExternalLink className="mr-1.5 h-4 w-4" />
                                {t('common.preview')}
                            </a>
                        </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                        <Link to={routes.folderInfo(folder?.id ?? '')}>
                            <IconEdit className="mr-1.5 h-4 w-4" />
                            {t('common.edit')}
                        </Link>
                    </Button>
                </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-4 p-4">
                    {/* Cover Image */}
                    {folder?.cover?.url ? (
                        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                            <img src={folder.cover.url} alt={folder.name} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg">
                            <IconPhoto className="text-muted-foreground/50 h-12 w-12" />
                        </div>
                    )}

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {folder?.isPublished ? (
                            <Badge variant="default">{t('status.published')}</Badge>
                        ) : (
                            <Badge variant="secondary">{t('status.draft')}</Badge>
                        )}
                        <Badge variant="outline">
                            <IconFolder className="mr-1 h-3 w-3" />
                            {t('common.folder')}
                        </Badge>
                    </div>

                    {/* Name */}
                    <h2 className="text-lg leading-tight font-semibold">{folder?.name}</h2>

                    {/* Description */}
                    {folder?.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{folder.description}</p>
                    )}

                    <Separator />

                    {/* Metadata */}
                    <div className="space-y-3 text-sm">
                        {/* Article Count */}
                        {folder?.articleCount != null && (
                            <div className="text-muted-foreground flex items-center gap-2">
                                <IconFileText className="h-4 w-4 shrink-0" />
                                <span>
                                    {t('articles.title')}: {folder.articleCount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
