import {
  ApiError,
  useCreateIssue,
  useDeleteIssue,
  useUpdateIssue,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateIssue, UpdateIssue } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';
import { IssueFormValues } from './use-edit-issue-form';

export const useEditIssueActions = (
  form: UseFormReturn<IssueFormValues>,
  isCreateMode: boolean,
  issueId: string,
) => {
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
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
      navigate(`${workspaceBaseUrl}/issues/${data.id}/info`);
      toast.success('Issue created successfully');
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateIssue({
    onSuccess: () => {
      toast.success('Issue updated successfully');
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteIssue({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/issues`);
      toast.success('Issue deleted successfully');
    },
  });

  function onSubmit(data: IssueFormValues) {
    if (isCreateMode) {
      const { folders, ...createData } = data as CreateIssue & { folders?: unknown };
      createMutation.mutate(createData as CreateIssue);
    } else {
      const updateData = data as UpdateIssue;
      // Transform folders to include article refs
      const foldersRefs = updateData.folders?.map((f) => ({
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

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      deleteMutation.mutate(issueId);
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
