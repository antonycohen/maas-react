import { CreateFolder, UpdateFolder } from '@maas/core-api-models';
import { useCreateFolder, useUpdateFolder, useDeleteFolder } from '@maas/core-api';
import { useEditIssueContext } from '../context';

export function useFolderMutations() {
  const {
    issueId,
    setSelectedFolderId,
    setSelectedArticleId,
    setFolderSheetOpen,
  } = useEditIssueContext();

  const createMutation = useCreateFolder({
    onSuccess: (newFolder) => {
      setSelectedFolderId(newFolder.id);
      setFolderSheetOpen(false);
    },
  });

  const updateMutation = useUpdateFolder({
    onSuccess: () => {
      setFolderSheetOpen(false);
    },
  });

  const deleteMutation = useDeleteFolder({
    onSuccess: () => {
      setSelectedFolderId(null);
      setSelectedArticleId(null);
    },
  });

  const handleSaveFolder = (
    data: CreateFolder | UpdateFolder,
    folderId?: string,
  ) => {
    if (folderId) {
      updateMutation.mutate({
        folderId,
        data: data as UpdateFolder,
      });
    } else {
      createMutation.mutate({
        ...data,
        issue: { id: issueId },
      } as CreateFolder);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this folder and all its articles?',
      )
    ) {
      deleteMutation.mutate(folderId);
    }
  };

  return {
    handleSaveFolder,
    handleDeleteFolder,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
