import { Article, ArticleTypeField } from '@maas/core-api-models';
import {
  Badge,
  Button,
  ScrollArea,
  Separator,
  Skeleton,
} from '@maas/web-components';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
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
import { Link } from 'react-router-dom';
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
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground/50 italic">Not set</span>;
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
        return (
          <Badge variant="secondary">{(value as { name: string }).name}</Badge>
        );
      }
      return <span className="text-muted-foreground/50 italic">Not set</span>;

    case 'image':
      if (
        typeof value === 'object' &&
        value !== null &&
        'url' in value
      ) {
        const imageValue = value as { url?: string };
        if (imageValue.url) {
          return (
            <div className="relative w-20 h-20 overflow-hidden rounded-md bg-muted">
              <img
                src={imageValue.url}
                alt={field.label}
                className="h-full w-full object-cover"
              />
            </div>
          );
        }
      }
      return <span className="text-muted-foreground/50 italic">No image</span>;

    case 'video':
      if (typeof value === 'object' && value !== null && 'url' in value) {
        const videoValue = value as { url?: string; title?: string };
        if (videoValue.url) {
          return (
            <div className="flex items-center gap-2">
              <IconVideo className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs truncate max-w-[150px]">
                {videoValue.title || videoValue.url}
              </span>
            </div>
          );
        }
      }
      return <span className="text-muted-foreground/50 italic">No video</span>;

    case 'cms':
      if (Array.isArray(value) && value.length > 0) {
        return (
          <span className="text-muted-foreground">{value.length} block(s)</span>
        );
      }
      return (
        <span className="text-muted-foreground/50 italic">No content</span>
      );

    default:
      if (typeof value === 'object') {
        return <span className="text-muted-foreground">Complex value</span>;
      }
      return <span>{String(value)}</span>;
  }
}

export function ArticlePreviewPanel({
  article,
  isLoading,
}: ArticlePreviewPanelProps) {
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const articleTypeData = article?.type;

  if (!article && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <IconFileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">Select an article to preview</p>
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
        <div className="p-4 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  const publishedDate = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString()
    : null;

  const updatedDate = article?.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString()
    : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <IconEye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Preview</span>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to={`${workspaceBaseUrl}/articles/${article?.id}`}>
            <IconEdit className="h-4 w-4 mr-1.5" />
            Edit
          </Link>
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Featured Image */}
          {article?.featuredImage?.url ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={article.featuredImage.url}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              <IconPhoto className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {article?.isPublished ? (
              <Badge variant="default">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {article?.type && (
              <Badge variant="outline">{article.type.name}</Badge>
            )}
            {article?.visibility && (
              <Badge variant="outline" className="capitalize">
                {article.visibility}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold leading-tight">
            {article?.title}
          </h2>

          {/* Description */}
          {article?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-3 text-sm">
            {/* Author */}
            {article?.author && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconUser className="h-4 w-4 shrink-0" />
                <span>
                  {article.author.firstName} {article.author.lastName}
                </span>
              </div>
            )}

            {/* Folder */}
            {article?.folders && article.folders.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconFolder className="h-4 w-4 shrink-0" />
                <span>{article.folders.map((f) => f.name).join(', ')}</span>
              </div>
            )}

            {/* Published Date */}
            {publishedDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCalendar className="h-4 w-4 shrink-0" />
                <span>Published: {publishedDate}</span>
              </div>
            )}

            {/* Updated Date */}
            {updatedDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCalendar className="h-4 w-4 shrink-0" />
                <span>Updated: {updatedDate}</span>
              </div>
            )}

            {/* Categories */}
            {article?.categories && article.categories.length > 0 && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <IconTag className="h-4 w-4 shrink-0 mt-0.5" />
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
              <div className="flex items-start gap-2 text-muted-foreground">
                <IconTag className="h-4 w-4 shrink-0 mt-0.5" />
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
                    <span>Custom Fields</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {articleTypeData.fields.map((field) => {
                      const fieldKey = camelCase(field.key);
                      const customFields = article.customFields;
                      const value = customFields
                        ? customFields[fieldKey]
                        : undefined;
                      return (
                        <div key={field.key} className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium">
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
