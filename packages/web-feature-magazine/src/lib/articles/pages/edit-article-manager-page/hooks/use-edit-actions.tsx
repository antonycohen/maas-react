import { useState } from 'react';
import { ApiError, useCreateArticle, useDeleteArticle, useUpdateArticle } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateArticle, UpdateArticle } from '@maas/core-api-models';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const useEditActions = (
    form: UseFormReturn<CreateArticle | UpdateArticle>,
    isCreateMode: boolean,
    articleId: string
) => {
    const { t } = useTranslation();
    const routes = useRoutes();
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
        onSuccess: (data) => {
            toast.success(t('message.success.created', { entity: t('articles.title') }));
            navigate(routes.articleEdit(data.id), { replace: true });
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateArticle({
        onSuccess: () => {
            toast.success(t('message.success.updated', { entity: t('articles.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteArticle({
        onSuccess: () => {
            navigate(routes.articles());
            toast.success(t('message.success.deleted', { entity: t('articles.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('articles.title') }));
        },
    });

    function onSubmit(data: CreateArticle | UpdateArticle) {
        if (isCreateMode) {
            createMutation.mutate(data as CreateArticle);
        } else {
            // Strip read-only fields that shouldn't be sent on update
            const { slug, ...updateData } = data as UpdateArticle & { slug?: unknown };
            updateMutation.mutate({
                articleId,
                data: updateData,
            });
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    function handleDelete() {
        setDeleteDialogOpen(true);
    }

    function confirmDelete() {
        deleteMutation.mutate(articleId);
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
