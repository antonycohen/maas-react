import {
  ApiError,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateArticle, UpdateArticle } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';

export const useEditActions = (
  form: UseFormReturn<CreateArticle | UpdateArticle>,
  isCreateMode: boolean,
  articleId: string,
) => {
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
  const navigate = useNavigate();

  const handleApiError = (error: ApiError) => {
    if (error.parametersErrors) {
      Object.entries(error.parametersErrors).forEach(([field, messages]) => {
        form.setError(field as keyof CreateArticle | keyof UpdateArticle, {
          type: 'server',
          message: messages.join(', '),
        });
      });
    }
  };

  const createMutation = useCreateArticle({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/articles`);
      toast.success('Article created successfully');
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateArticle({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/articles`);
      toast.success('Article updated successfully');
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/articles`);
      toast.success('Article deleted successfully');
    },
  });

  function onSubmit(data: CreateArticle | UpdateArticle) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateArticle);
    } else {
      updateMutation.mutate({
        articleId,
        data: data as UpdateArticle,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(articleId);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return {
    onSubmit,
    handleDelete,
    isSaving,
    deleteMutation,
  };
};
