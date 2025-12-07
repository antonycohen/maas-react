import { useForm } from 'react-hook-form';
import {
  Article,
  CreateArticle,
  createArticleSchema,
  UpdateArticle,
  updateArticleSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Combined schema for form - uses UpdateArticle fields plus issue for create mode
const articleFormSchema = z.union([createArticleSchema, updateArticleSchema]);

export type ArticleFormData = CreateArticle | UpdateArticle;

type UseEditArticleFormOptions = {
  article: Article | null;
  issueId: string;
};

export const useEditArticleForm = ({
  article,
  issueId,
}: UseEditArticleFormOptions) => {
  const isCreateMode = article === null;

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      issue: { id: issueId },
      folder: null,
      title: '',
      description: '',
      content: null,
      author: null,
      featuredImage: null,
      cover: null,
      pdf: null,
      keywords: null,
      type: null,
      visibility: null,
      position: 0,
      publishedAt: null,
      isPublished: false,
      isFeatured: false,
      tags: null,
      metadata: null,
      categories: null,
    } as ArticleFormData,
    values: article
      ? {
          folder: article.folder
            ? { id: article.folder.id, name: article.folder.name }
            : null,
          title: article.title,
          description: article.description,
          content: article.content,
          author: article.author ? { id: article.author.id } : null,
          featuredImage: article.featuredImage ?? null,
          cover: article.cover ?? null,
          pdf: article.pdf ? { id: article.pdf.id } : null,
          keywords: article.keywords,
          type: article.type,
          visibility: article.visibility,
          position: article.position ?? 0,
          publishedAt: article.publishedAt,
          isPublished: article.isPublished ?? false,
          isFeatured: article.isFeatured ?? false,
          tags: article.tags?.map((t) => t.name).filter(Boolean) as
            | string[]
            | null,
          metadata: article.metadata,
          categories: article.categories?.map((c) => ({ id: c.id })) ?? null,
        }
      : undefined,
  });

  return { form, isCreateMode };
};
