import { useState } from 'react';
import { ApiError, useCreateIssue, useDeleteIssue, useUpdateIssue } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateIssue, UpdateIssue } from '@maas/core-api-models';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { IssueFormValues } from './use-edit-issue-form';

export const useEditIssueActions = (form: UseFormReturn<IssueFormValues>, isCreateMode: boolean, issueId: string) => {
    const { t } = useTranslation();
    const routes = useRoutes();
    const navigate = useNavigate();

    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CreateIssue | keyof UpdateIssue, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const createMutation = useCreateIssue({
        onSuccess: (data) => {
            navigate(routes.issueInfo(data.id));
            toast.success(t('message.success.created', { entity: t('issues.title') }));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateIssue({
        onSuccess: () => {
            toast.success(t('message.success.updated', { entity: t('issues.title') }));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeleteIssue({
        onSuccess: () => {
            navigate(routes.issues());
            toast.success(t('message.success.deleted', { entity: t('issues.title') }));
        },
        onError: () => {
            toast.error(t('message.error.deleted', { entity: t('issues.title') }));
        },
    });

    function onSubmit(data: IssueFormValues) {
        if (isCreateMode) {
            const { folders: _folders, ...createData } = data as CreateIssue & { folders?: unknown };
            createMutation.mutate(createData as CreateIssue);
        } else {
            const updateData = data as UpdateIssue;
            // Transform folders to include article refs
            const foldersRefs =
                updateData.folders?.map((f) => ({
                    id: f.id,
                    articles: f.articles?.map((a) => ({ id: a.id })) ?? null,
                })) ?? null;

            updateMutation.mutate({
                issueId,
                data: {
                    ...updateData,
                    folders: foldersRefs,
                },
            });
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    function handleDelete() {
        setDeleteDialogOpen(true);
    }

    function confirmDelete() {
        deleteMutation.mutate(issueId);
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
