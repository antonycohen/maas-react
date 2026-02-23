import { ApiError, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateProduct, UpdateProduct } from '@maas/core-api-models';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { ProductFormValues } from './use-edit-product-form';
import { useTranslation } from '@maas/core-translations';
import { useState } from 'react';

export const useEditProductActions = (
    form: UseFormReturn<ProductFormValues>,
    isCreateMode: boolean,
    productId: string
) => {
    const routes = useRoutes();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CreateProduct | keyof UpdateProduct, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const createMutation = useCreateProduct({
        onSuccess: (data) => {
            navigate(routes.pmsProductInfo(data.id));
            toast.success(t('products.createdSuccess'));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateProduct({
        onSuccess: () => {
            toast.success(t('products.updatedSuccess'));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteProduct({
        onSuccess: () => {
            navigate(routes.pmsProducts());
            toast.success(t('products.deletedSuccess'));
        },
        onError: () => {
            toast.error(t('products.deleteFailed'));
        },
    });

    function onSubmit(data: ProductFormValues) {
        if (isCreateMode) {
            createMutation.mutate(data as CreateProduct);
        } else {
            updateMutation.mutate({
                productId,
                data: data as UpdateProduct,
            });
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    function handleDelete() {
        setDeleteDialogOpen(true);
    }

    function confirmDelete() {
        deleteMutation.mutate(productId);
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return {
        onSubmit,
        handleDelete,
        confirmDelete,
        deleteDialogOpen,
        setDeleteDialogOpen,
        isSaving,
        deleteMutation,
    };
};
