import { useCallback, useState } from 'react';
import { ArticleTypeRef, ReadArticleRef } from '@maas/core-api-models';
import { useCreateArticle } from '@maas/core-api';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { toast } from 'sonner';

// Form data from the modal (organization added here)
type CreateArticleFormData = {
  title: string;
  description?: string | null;
  type: ArticleTypeRef | null;
  keywords?: string[] | null;
};

type UseAddArticleModalParams = {
  onLinkExisting: (article: ReadArticleRef) => void;
  onArticleCreated: () => void;
};

export const useAddArticleModal = ({
  onLinkExisting,
  onArticleCreated,
}: UseAddArticleModalParams) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useGetCurrentWorkspaceId() as string;

  const createArticleMutation = useCreateArticle({
    onSuccess: (createdArticle) => {
      // Link the created article to the folder
      onLinkExisting({
        id: createdArticle.id,
        title: createdArticle.title,
      });
      onArticleCreated();
      toast.success('Article created successfully');
    },
    onError: (error) => {
      console.error('Create article error:', error);
      toast.error('Failed to create article');
    },
  });

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectExisting = useCallback(
    (article: ReadArticleRef) => {
      onLinkExisting(article);
      closeModal();
    },
    [onLinkExisting, closeModal],
  );

  const handleCreate = useCallback(
    (data: CreateArticleFormData) => {
      createArticleMutation.mutate({
        organization: { id: workspaceId },
        title: data.title,
        description: data.description || null,
        keywords: data.keywords ?? null,
        type: data.type,
      });
      closeModal();
    },
    [createArticleMutation, workspaceId, closeModal],
  );

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    handleSelectExisting,
    handleCreate,
    isCreating: createArticleMutation.isPending,
  };
};
