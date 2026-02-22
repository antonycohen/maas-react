import { ApiError, useCreateArticleType, useDeleteArticleType, useUpdateArticleType } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateArticleType, UpdateArticleType } from '@maas/core-api-models';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const useEditActions = (
    form: UseFormReturn<CreateArticleType | UpdateArticleType>,
    isCreateMode: boolean,
    articleTypeId: string
) => {
    const { t } = useTranslation();
    const routes = useRoutes();
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
            navigate(routes.articleTypes());
            toast.success(t('message.success.created', { entity: t('articleTypes.title') }));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateArticleType({
        onSuccess: () => {
            navigate(routes.articleTypes());
            toast.success(t('message.success.updated', { entity: t('articleTypes.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteArticleType({
        onSuccess: () => {
            navigate(routes.articleTypes());
            toast.success(t('message.success.deleted', { entity: t('articleTypes.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('articleTypes.title') }));
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
        if (window.confirm(t('message.confirm.delete', { entity: 'article type' }))) {
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
