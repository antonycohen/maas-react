import { useForm } from 'react-hook-form';
import {
  Article,
  UpdateArticle,
  updateArticleSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditArticleForm = (article: Article | null) => {
  const form = useForm<UpdateArticle>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      folder: null,
      title: '',
      description: null,
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
    },
    values: article
      ? {
          folder: article.folder ? { id: article.folder.id } : null,
          title: article.title,
          description: article.description,
          content: article.content,
          author: article.author ? { id: article.author.id } : null,
          featuredImage: article.featuredImage
            ? { id: article.featuredImage.id }
            : null,
          cover: article.cover ? { id: article.cover.id } : null,
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

  return { form };
};
