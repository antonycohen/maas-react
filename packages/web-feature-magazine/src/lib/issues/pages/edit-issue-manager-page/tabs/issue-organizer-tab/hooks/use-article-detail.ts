import { useGetArticleById } from '@maas/core-api';
import { useEditIssueContext } from '../context';

export function useArticleDetail() {
  const { selectedArticleId, isCreateMode } = useEditIssueContext();

  const {
    data: article,
    isLoading,
    refetch,
  } = useGetArticleById(
    {
      id: selectedArticleId ?? '',
      fields: {
        id: null,
        title: null,
        description: null,
        content: null,
        type: null,
        visibility: null,
        position: null,
        keywords: null,
        isPublished: null,
        isFeatured: null,
        publishedAt: null,
        author: { fields: { id: null, firstName: null, lastName: null } },
        featuredImage: null,
        cover: null,
        pdf: null,
        tags: null,
        metadata: null,
        categories: { fields: { id: null, name: null } },
        folder: { fields: { id: null, name: null } },
        issue: { fields: { id: null, title: null } },
      },
    },
    {
      enabled: !isCreateMode && !!selectedArticleId,
    },
  );

  return {
    article: selectedArticleId ? article ?? null : null,
    isLoading: isCreateMode || !selectedArticleId ? false : isLoading,
    refetch,
  };
}
