import { useGetFolders } from '@maas/core-api';
import { useEditIssueContext } from '../context';
import { useEffect } from 'react';

export function useIssueFolders() {
  const { issueId, isCreateMode, selectedFolderId, setSelectedFolderId } =
    useEditIssueContext();

  const {
    data: foldersResponse,
    isLoading,
    refetch,
  } = useGetFolders(
    {
      offset: 0,
      limit: 100,
      filters: { issueId },
      fields: {
        id: null,
        name: null,
        description: null,
        position: null,
        color: null,
        cover: null,
        isPublished: null,
        type: null,
        isDefault: null,
        metadata: null,
        articleCount: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const folders = foldersResponse?.data ?? [];

  // Auto-select first folder when folders are loaded and nothing is selected
  useEffect(() => {
    if (!selectedFolderId && folders.length > 0) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folders, selectedFolderId, setSelectedFolderId]);

  const currentFolder = selectedFolderId
    ? folders.find((f) => f.id === selectedFolderId) ?? null
    : null;

  return {
    folders,
    currentFolder,
    isLoading: isCreateMode ? false : isLoading,
    refetch,
  };
}
