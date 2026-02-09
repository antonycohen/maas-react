import { ApiError, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateProduct, UpdateProduct } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';
import { ProductFormValues } from './use-edit-product-form';

export const useEditProductActions = (
    form: UseFormReturn<ProductFormValues>,
    isCreateMode: boolean,
    productId: string
) => {
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
    const navigate = useNavigate();

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
            navigate(`${workspaceBaseUrl}/pms/products/${data.id}/info`);
            toast.success('Product created successfully');
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateProduct({
        onSuccess: () => {
            toast.success('Product updated successfully');
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteProduct({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/pms/products`);
            toast.success('Product deleted successfully');
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

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(productId);
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
