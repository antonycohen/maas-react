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
      const updateData = data as UpdateArticle;
      // Extract just the ids for ref fields before sending to API
      updateMutation.mutate({
        articleId,
        data: {
          ...updateData,
          folder: updateData.folder?.id ? { id: updateData.folder.id } : null,
          featuredImage: updateData.featuredImage?.id
            ? { id: updateData.featuredImage.id }
            : null,
          cover: updateData.cover?.id ? { id: updateData.cover.id } : null,
        } as UpdateArticle,
      });
    } else {
      const createData = data as CreateArticle;
      // Extract just the ids for ref fields before sending to API
      const folderId = selectedFolderId ?? createData.folder?.id;
      createMutation.mutate({
        ...createData,
        issue: { id: issueId },
        folder: folderId ? { id: folderId } : null,
        featuredImage: createData.featuredImage?.id
          ? { id: createData.featuredImage.id }
          : null,
        cover: createData.cover?.id ? { id: createData.cover.id } : null,
      } as CreateArticle);
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
