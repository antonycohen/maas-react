import { ApiError, useCreateEnum, useDeleteEnum, useUpdateEnum } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateEnum, UpdateEnum } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const useEditActions = (form: UseFormReturn<CreateEnum | UpdateEnum>, isCreateMode: boolean, enumId: string) => {
    const { t } = useTranslation();
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
    const navigate = useNavigate();

    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CreateEnum | keyof UpdateEnum, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const createMutation = useCreateEnum({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/enums`);
            toast.success(t('message.success.created', { entity: t('enums.title') }));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateEnum({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/enums`);
            toast.success(t('message.success.updated', { entity: t('enums.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteEnum({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/enums`);
            toast.success(t('message.success.deleted', { entity: t('enums.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('enums.title') }));
        },
    });

    function onSubmit(data: CreateEnum | UpdateEnum) {
        if (isCreateMode) {
            createMutation.mutate(data as CreateEnum);
        } else {
            updateMutation.mutate({
                enumId,
                data: data as UpdateEnum,
            });
        }
    }

    function handleDelete() {
        if (window.confirm(t('message.confirm.delete', { entity: 'enum' }))) {
            deleteMutation.mutate(enumId);
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
