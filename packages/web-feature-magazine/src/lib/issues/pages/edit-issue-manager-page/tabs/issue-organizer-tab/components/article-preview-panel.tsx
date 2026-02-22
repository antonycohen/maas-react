import { Article, ArticleTypeField } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { Badge, Button, ScrollArea, Separator, Skeleton } from '@maas/web-components';
import { useRoutes } from '@maas/core-workspace';
import {
    IconCalendar,
    IconEdit,
    IconEye,
    IconFileText,
    IconFolder,
    IconPhoto,
    IconSettings,
    IconTag,
    IconUser,
    IconVideo,
} from '@tabler/icons-react';
import { Link } from 'react-router';
import { camelCase } from 'change-case';

type ArticlePreviewPanelProps = {
    article: Article | null;
    isLoading?: boolean;
};

type CustomFieldValueProps = {
    field: ArticleTypeField;
    value: unknown;
};

function CustomFieldValue({ field, value }: CustomFieldValueProps) {
    const { t } = useTranslation();
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground/50 italic">{t('common.notSet')}</span>;
    }

    switch (field.type) {
        case 'string':
        case 'text':
        case 'number':
            return <span>{String(value)}</span>;

        case 'enum':
            return <Badge variant="outline">{String(value)}</Badge>;

        case 'category':
            if (typeof value === 'object' && value !== null && 'name' in value) {
                return <Badge variant="secondary">{(value as { name: string }).name}</Badge>;
            }
            return <span className="text-muted-foreground/50 italic">{t('common.notSet')}</span>;

        case 'image':
            if (typeof value === 'object' && value !== null && 'url' in value) {
                const imageValue = value as { url?: string };
                if (imageValue.url) {
                    return (
                        <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-md">
                            <img src={imageValue.url} alt={field.label} className="h-full w-full object-cover" />
                        </div>
                    );
                }
            }
            return <span className="text-muted-foreground/50 italic">{t('articles.noImage')}</span>;

        case 'video':
            if (typeof value === 'object' && value !== null && 'url' in value) {
                const videoValue = value as { url?: string; title?: string };
                if (videoValue.url) {
                    return (
                        <div className="flex items-center gap-2">
                            <IconVideo className="text-muted-foreground h-4 w-4" />
                            <span className="max-w-[150px] truncate text-xs">{videoValue.title || videoValue.url}</span>
                        </div>
                    );
                }
            }
            return <span className="text-muted-foreground/50 italic">{t('articles.noVideo')}</span>;

        case 'cms':
            if (Array.isArray(value) && value.length > 0) {
                return <span className="text-muted-foreground">{t('articles.blocks', { count: value.length })}</span>;
            }
            return <span className="text-muted-foreground/50 italic">{t('articles.noContent')}</span>;

        default:
            if (typeof value === 'object') {
                return <span className="text-muted-foreground">{t('articles.complexValue')}</span>;
            }
            return <span>{String(value)}</span>;
    }
}

export function ArticlePreviewPanel({ article, isLoading }: ArticlePreviewPanelProps) {
    const { t } = useTranslation();
    const routes = useRoutes();

    const articleTypeData = article?.type;

    if (!article && !isLoading) {
        return (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                <IconFileText className="mb-4 h-12 w-12 opacity-50" />
                <p className="text-sm">{t('folders.selectArticleToPreview')}</p>
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

    const publishedDate = article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : null;

    const updatedDate = article?.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : null;

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                    <IconEye className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-semibold">{t('common.preview')}</span>
                </div>
                <Button asChild size="sm" variant="outline">
                    <Link to={routes.articleEdit(article?.id ?? '')}>
                        <IconEdit className="mr-1.5 h-4 w-4" />
                        {t('common.edit')}
                    </Link>
                </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-4 p-4">
                    {/* Featured Image */}
                    {article?.featuredImage?.url ? (
                        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                            <img
                                src={article.featuredImage.url}
                                alt={article.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg">
                            <IconPhoto className="text-muted-foreground/50 h-12 w-12" />
                        </div>
                    )}

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {article?.isPublished ? (
                            <Badge variant="default">{t('status.published')}</Badge>
                        ) : (
                            <Badge variant="secondary">{t('status.draft')}</Badge>
                        )}
                        {article?.type && <Badge variant="outline">{article.type.name}</Badge>}
                        {article?.visibility && (
                            <Badge variant="outline" className="capitalize">
                                {article.visibility}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg leading-tight font-semibold">{article?.title}</h2>

                    {/* Description */}
                    {article?.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{article.description}</p>
                    )}

                    <Separator />

                    {/* Metadata */}
                    <div className="space-y-3 text-sm">
                        {/* Author */}
                        {article?.author && (
                            <div className="text-muted-foreground flex items-center gap-2">
                                <IconUser className="h-4 w-4 shrink-0" />
                                <span>
                                    {article.author.firstName} {article.author.lastName}
                                </span>
                            </div>
                        )}

                        {/* Folder */}
                        {article?.folders && article.folders.length > 0 && (
                            <div className="text-muted-foreground flex items-center gap-2">
                                <IconFolder className="h-4 w-4 shrink-0" />
                                <span>{article.folders.map((f) => f.name).join(', ')}</span>
                            </div>
                        )}

                        {/* Published Date */}
                        {publishedDate && (
                            <div className="text-muted-foreground flex items-center gap-2">
                                <IconCalendar className="h-4 w-4 shrink-0" />
                                <span>
                                    {t('common.published')}: {publishedDate}
                                </span>
                            </div>
                        )}

                        {/* Updated Date */}
                        {updatedDate && (
                            <div className="text-muted-foreground flex items-center gap-2">
                                <IconCalendar className="h-4 w-4 shrink-0" />
                                <span>
                                    {t('common.updated')}: {updatedDate}
                                </span>
                            </div>
                        )}

                        {/* Categories */}
                        {article?.categories && article.categories.length > 0 && (
                            <div className="text-muted-foreground flex items-start gap-2">
                                <IconTag className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                    {article.categories.map((cat) => (
                                        <Badge key={cat.id} variant="secondary" className="text-xs">
                                            {cat.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keywords */}
                        {article?.keywords && article.keywords.length > 0 && (
                            <div className="text-muted-foreground flex items-start gap-2">
                                <IconTag className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                    {article.keywords.map((keyword, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Custom Fields */}
                    {article &&
                        articleTypeData?.fields &&
                        articleTypeData.fields.length > 0 &&
                        article.customFields && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <IconSettings className="h-4 w-4" />
                                        <span>{t('field.customFields')}</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {articleTypeData.fields.map((field) => {
                                            const fieldKey = camelCase(field.key);
                                            const customFields = article.customFields;
                                            const value = customFields ? customFields[fieldKey] : undefined;
                                            return (
                                                <div key={field.key} className="flex flex-col gap-1">
                                                    <span className="text-muted-foreground text-xs font-medium">
                                                        {field.label}
                                                    </span>
                                                    <CustomFieldValue field={field} value={value} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            </ScrollArea>
        </div>
    );
}
