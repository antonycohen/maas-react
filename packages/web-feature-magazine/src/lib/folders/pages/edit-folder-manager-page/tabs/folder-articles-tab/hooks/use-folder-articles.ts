import { useGetArticles } from '@maas/core-api';
import { useEditFolderContext } from '../../../context';

export function useFolderArticles() {
  const { folderId, isCreateMode } = useEditFolderContext();

  const {
    data: articlesResponse,
    isLoading,
    refetch,
  } = useGetArticles(
    {
      offset: 0,
      limit: 100,
      filters: { folderId },
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
      enabled: !isCreateMode,
    },
  );

  const articles = articlesResponse?.data ?? [];

  return {
    articles,
    isLoading: isCreateMode ? false : isLoading,
    refetch,
  };
}
