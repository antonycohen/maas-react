import {
  ApiError,
  useCreateArticleType,
  useDeleteArticleType,
  useUpdateArticleType,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateArticleType, UpdateArticleType } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';

export const useEditActions = (
  form: UseFormReturn<CreateArticleType | UpdateArticleType>,
  isCreateMode: boolean,
  articleTypeId: string,
) => {
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
  const navigate = useNavigate();

  const handleApiError = (error: ApiError) => {
    if (error.parametersErrors) {
      Object.entries(error.parametersErrors).forEach(([field, messages]) => {
        form.setError(field as keyof CreateArticleType | keyof UpdateArticleType, {
          type: 'server',
          message: messages.join(', '),
        });
      });
    }
  };

  const createMutation = useCreateArticleType({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/article-types`);
      toast.success('Article type created successfully');
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateArticleType({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/article-types`);
      toast.success('Article type updated successfully');
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteArticleType({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/article-types`);
      toast.success('Article type deleted successfully');
    },
  });

  function onSubmit(data: CreateArticleType | UpdateArticleType) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateArticleType);
    } else {
      updateMutation.mutate({
        articleTypeId,
        data: data as UpdateArticleType,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this article type?')) {
      deleteMutation.mutate(articleTypeId);
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
