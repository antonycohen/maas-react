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
        type: {
          fields: {
            id: null,
            name: null,
            fields: {
              fields: {
                label: null,
                type: null,
                key: null,
              },
            },
          },
        },
        visibility: null,
        keywords: null,
        isPublished: null,
        customFields: null,
        publishedAt: null,
        author: { fields: { id: null, firstName: null, lastName: null } },
        featuredImage: null,
        cover: null,
        pdf: null,
        tags: null,
        metadata: null,
        categories: { fields: { id: null, name: null } },
      },
    },
    {
      enabled: !isCreateMode && !!selectedArticleId,
    },
  );

  return {
    article: selectedArticleId ? (article ?? null) : null,
    isLoading: isCreateMode || !selectedArticleId ? false : isLoading,
    refetch,
  };
}
