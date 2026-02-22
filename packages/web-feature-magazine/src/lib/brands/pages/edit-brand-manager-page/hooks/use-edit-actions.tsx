import { ApiError, useCreateBrand, useDeleteBrand, useUpdateBrand } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateBrand, UpdateBrand } from '@maas/core-api-models';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const useEditActions = (
    form: UseFormReturn<CreateBrand | UpdateBrand>,
    isCreateMode: boolean,
    brandId: string
) => {
    const { t } = useTranslation();
    const routes = useRoutes();
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
            navigate(routes.brands());
            toast.success(t('message.success.created', { entity: t('brands.title') }));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateBrand({
        onSuccess: () => {
            navigate(routes.brands());
            toast.success(t('message.success.updated', { entity: t('brands.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteBrand({
        onSuccess: () => {
            navigate(routes.brands());
            toast.success(t('message.success.deleted', { entity: t('brands.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('brands.title') }));
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
        if (window.confirm(t('message.confirm.delete', { entity: 'brand' }))) {
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
