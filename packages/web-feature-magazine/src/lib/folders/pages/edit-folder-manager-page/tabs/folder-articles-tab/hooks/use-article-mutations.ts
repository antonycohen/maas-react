import {
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from '@maas/core-api';
import { useQueryClient } from '@tanstack/react-query';
import { CreateArticle, ReadArticleRef, UpdateArticle } from '@maas/core-api-models';
import { toast } from 'sonner';
import { useEditFolderContext } from '../../../context';

export function useArticleMutations() {
  const queryClient = useQueryClient();
  const { folderId, setSelectedArticleId, setAddArticleModalOpen } = useEditFolderContext();

  const createMutation = useCreateArticle({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article created successfully');
    },
    onError: () => {
      toast.error('Failed to create article');
    },
  });

  const updateMutation = useUpdateArticle({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article updated successfully');
    },
    onError: () => {
      toast.error('Failed to update article');
    },
  });

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setSelectedArticleId(null);
      toast.success('Article removed from folder');
    },
    onError: () => {
      toast.error('Failed to remove article');
    },
  });

  const handleCreateArticle = (data: CreateArticle) => {
    createMutation.mutate({
      ...data,
      folder: { id: folderId },
    });
  };

  const handleLinkExistingArticle = (article: ReadArticleRef) => {
    updateMutation.mutate({
      articleId: article.id,
      data: {
        folder: { id: folderId },
      } as UpdateArticle,
    });
    setSelectedArticleId(article.id);
    setAddArticleModalOpen(false);
  };

  const handleRemoveArticle = (articleId: string) => {
    if (window.confirm('Remove this article from the folder?')) {
      // Update article to remove folder reference
      updateMutation.mutate({
        articleId,
        data: {
          folder: null,
        } as UpdateArticle,
      });
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      deleteMutation.mutate(articleId);
    }
  };

  return {
    handleCreateArticle,
    handleLinkExistingArticle,
    handleRemoveArticle,
    handleDeleteArticle,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
