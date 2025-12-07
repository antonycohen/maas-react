import { useGetArticles } from '@maas/core-api';
import { useEditIssueContext } from '../context';

export function useFolderArticles() {
  const { selectedFolderId, isCreateMode } = useEditIssueContext();

  const {
    data: articlesResponse,
    isLoading,
    refetch,
  } = useGetArticles(
    {
      offset: 0,
      limit: 100,
      filters: { folderId: selectedFolderId ?? undefined },
      fields: {
        id: null,
        title: null,
        description: null,
        type: null,
        position: null,
        isPublished: null,
        isFeatured: null,
        folder: { fields: { id: null, name: null } },
      },
    },
    {
      enabled: !isCreateMode && !!selectedFolderId,
    },
  );

  const articles = articlesResponse?.data ?? [];

  return {
    articles,
    isLoading: isCreateMode || !selectedFolderId ? false : isLoading,
    refetch,
  };
}
