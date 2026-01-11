import {
  ApiError,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateCategory, UpdateCategory } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export const useEditActions = (
  form: UseFormReturn<CreateCategory | UpdateCategory>,
  isCreateMode: boolean,
  categoryId: string,
) => {
  const navigate = useNavigate();
  const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const handleApiError = (error: ApiError) => {
    if (error.parametersErrors) {
      Object.entries(error.parametersErrors).forEach(([field, messages]) => {
        form.setError(field as keyof CreateCategory | keyof UpdateCategory, {
          type: 'server',
          message: messages.join(', '),
        });
      });
    }
  };

  const createMutation = useCreateCategory({
    onSuccess: () => {
      navigate(`${currentWorkspaceBaseUrl}/categories`);
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateCategory({
    onSuccess: () => {
      navigate(`${currentWorkspaceBaseUrl}/categories`);
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteCategory({
    onSuccess: () => {
      navigate(`${currentWorkspaceBaseUrl}/categories`);
    },
  });

  function onSubmit(data: CreateCategory | UpdateCategory) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateCategory);
    } else {
      updateMutation.mutate({
        categoryId,
        data: data as UpdateCategory,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(categoryId);
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
