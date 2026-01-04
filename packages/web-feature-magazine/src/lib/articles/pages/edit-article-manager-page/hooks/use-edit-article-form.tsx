import { useGetArticleById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  ArticleCustomFields,
  ArticleType,
  CreateArticle,
  createArticleSchema,
  UpdateArticle,
  updateArticleSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { camelCase } from 'change-case';

export const useEditArticleForm = (articleId: string) => {
  const workspaceId = useGetCurrentWorkspaceId() as string;
  const isCreateMode = articleId === 'new';

  const { data: article, isLoading } = useGetArticleById(
    {
      id: articleId,
      fields: {
        id: null,
        title: null,
        description: null,
        createdAt: null,
        updatedAt: null,
        author: null,
        featuredImage: null,
        content: null,
        cover: null,
        keywords: null,
        type: {
          fields: {
            id: null,
            name: null,
            fields: {
              fields: {
                type: null,
                enum: null,
                label: null,
                isList: null,
                key: null,
                category: null,
                validators: null,
              },
            },
            isActive: null,
          },
        },
        visibility: null,
        customFields: null,
        publishedAt: null,
        isPublished: null,
        tags: null,
        categories: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const initCustomFields = (type: ArticleType): ArticleCustomFields => {
    const fields: Record<string, unknown> = {};
    if (type?.fields) {
      for (const field of type.fields) {
        const key = camelCase(field.key);
        switch (field.type) {
          case 'text':
          case 'string':
            fields[key] = field.isList ? [] : '';
            break;
          case 'number':
            fields[key] = field.isList ? [] : null;
            break;
          case 'enum':
          case 'category':
          case 'cms':
            fields[key] = field.isList ? [] : null;
            break;
          default:
            fields[key] = null;
            break;
        }
      }
    }
    return fields;
  };
  const form = useForm<CreateArticle | UpdateArticle>({
    resolver: zodResolver(
      isCreateMode ? createArticleSchema : updateArticleSchema,
    ),
    defaultValues: {
      title: '',
      description: '',
      author: null,
      featuredImage: null,
      cover: null,
      keywords: null,
      type: null,
      content: [],
      visibility: null,
      customFields: {},
      tags: null,
      categories: null,
      ...(isCreateMode && {
        organization: { id: workspaceId },
      }),
    },
    values:
      !isCreateMode && article
        ? {
            title: article.title,
            description: article.description ?? '',
            author: article.author ?? null,
            featuredImage: article.featuredImage ?? null,
            cover: article.cover ?? null,
            content: article.content ?? [],
            keywords: article.keywords,
            type: article.type ?? null,
            visibility: article.visibility,
            customFields: article.customFields
              ? article.customFields
              : article.type
                ? initCustomFields(article.type)
                : {},
            publishedAt: article.publishedAt,
            isPublished: article.isPublished ?? undefined,
            tags:
              (article.tags?.map((t) => t.name).filter(Boolean) as string[]) ??
              null,
            categories:
              article.categories?.map((c) => ({ id: c.id, name: c.name })) ??
              null,
          }
        : undefined,
  });

  return { isCreateMode, article, isLoading, form };
};
