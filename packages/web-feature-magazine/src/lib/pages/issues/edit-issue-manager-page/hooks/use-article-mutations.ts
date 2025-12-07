import { CreateArticle, UpdateArticle } from '@maas/core-api-models';
import { useCreateArticle, useUpdateArticle, useDeleteArticle } from '@maas/core-api';
import { useEditIssueContext } from '../context';

export function useArticleMutations() {
  const {
    issueId,
    selectedFolderId,
    setSelectedArticleId,
    setSelectedFolderId,
    setArticleSheetOpen,
  } = useEditIssueContext();

  const createMutation = useCreateArticle({
    onSuccess: (newArticle) => {
      setSelectedArticleId(newArticle.id);
      setArticleSheetOpen(false);
      // If article was created in a different folder, select that folder
      if (newArticle.folder?.id && newArticle.folder.id !== selectedFolderId) {
        setSelectedFolderId(newArticle.folder.id);
      }
    },
  });

  const updateMutation = useUpdateArticle({
    onSuccess: (updatedArticle) => {
      // If article was moved to a different folder, select that folder
      if (
        updatedArticle.folder?.id &&
        updatedArticle.folder.id !== selectedFolderId
      ) {
        setSelectedFolderId(updatedArticle.folder.id);
      }
    },
  });

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      setSelectedArticleId(null);
    },
  });

  const handleSaveArticle = (
    data: CreateArticle | UpdateArticle,
    articleId?: string,
  ) => {
    if (articleId) {
      updateMutation.mutate({
        articleId,
        data: data as UpdateArticle,
      });
    } else {
      const createData = data as CreateArticle;
      createMutation.mutate({
        ...createData,
        issue: { id: issueId },
        folder: selectedFolderId ? { id: selectedFolderId } : createData.folder,
      });
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(articleId);
    }
  };

  return {
    handleSaveArticle,
    handleDeleteArticle,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
