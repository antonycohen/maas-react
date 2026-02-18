import { ApiError, useCreateFolder, useDeleteFolder, useUpdateFolder } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateFolder, UpdateFolder } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix, useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { FolderFormValues } from './use-edit-folder-form';

export const useEditFolderActions = (
    form: UseFormReturn<FolderFormValues>,
    isCreateMode: boolean,
    folderId: string
) => {
    const { t } = useTranslation();
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
    const workspaceId = useGetCurrentWorkspaceId();
    const navigate = useNavigate();

    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CreateFolder | keyof UpdateFolder, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const createMutation = useCreateFolder({
        onSuccess: (data) => {
            navigate(`${workspaceBaseUrl}/folders/${data.id}/info`);
            toast.success(t('message.success.created', { entity: t('folders.title') }));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateFolder({
        onSuccess: () => {
            toast.success(t('message.success.updated', { entity: t('folders.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteFolder({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/folders`);
            toast.success(t('message.success.deleted', { entity: t('folders.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('folders.title') }));
        },
    });

    function onSubmit(data: FolderFormValues) {
        const articlesRefs = data.articles?.map((a) => ({ id: a.id })) ?? null;

        if (isCreateMode) {
            const { articles, ...createData } = data;
            createMutation.mutate({
                organization: { id: workspaceId as string },
                articles: articlesRefs,
                ...createData,
            } as CreateFolder);
        } else {
            const { articles, ...updateData } = data;
            updateMutation.mutate({
                folderId,
                data: {
                    ...updateData,
                    articles: articlesRefs,
                },
            });
        }
    }

    function handleDelete() {
        if (window.confirm(t('message.confirm.delete', { entity: 'folder' }))) {
            deleteMutation.mutate(folderId);
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
