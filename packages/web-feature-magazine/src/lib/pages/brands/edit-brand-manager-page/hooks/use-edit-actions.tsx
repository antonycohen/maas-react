import {
  ApiError,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateBrand, UpdateBrand } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';

export const useEditActions = (
  form: UseFormReturn<CreateBrand | UpdateBrand>,
  isCreateMode: boolean,
  brandId: string,
) => {
  const navigate = useNavigate();

  const handleApiError = (error: ApiError) => {
    if (error.parametersErrors) {
      Object.entries(error.parametersErrors).forEach(([field, messages]) => {
        form.setError(field as keyof CreateBrand | keyof UpdateBrand, {
          type: 'server',
          message: messages.join(', '),
        });
      });
    }
  };

  const createMutation = useCreateBrand({
    onSuccess: () => {
      navigate('/brands');
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateBrand({
    onSuccess: () => {
      navigate('/brands');
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteBrand({
    onSuccess: () => {
      navigate('/brands');
    },
  });

  function onSubmit(data: CreateBrand | UpdateBrand) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateBrand);
    } else {
      updateMutation.mutate({
        brandId,
        data: data as UpdateBrand,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteMutation.mutate(brandId);
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
