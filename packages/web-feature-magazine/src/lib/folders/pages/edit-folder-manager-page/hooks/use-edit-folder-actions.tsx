import {
  ApiError,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
} from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreateFolder, UpdateFolder } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import {
  useCurrentWorkspaceUrlPrefix,
  useGetCurrentWorkspaceId,
} from '@maas/core-workspace';
import { toast } from 'sonner';
import { FolderFormValues } from './use-edit-folder-form';

export const useEditFolderActions = (
  form: UseFormReturn<FolderFormValues>,
  isCreateMode: boolean,
  folderId: string,
) => {
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
      toast.success('Folder created successfully');
    },
    onError: handleApiError,
  });

  const updateMutation = useUpdateFolder({
    onSuccess: () => {
      toast.success('Folder updated successfully');
    },
    onError: handleApiError,
  });

  const deleteMutation = useDeleteFolder({
    onSuccess: () => {
      navigate(`${workspaceBaseUrl}/folders`);
      toast.success('Folder deleted successfully');
    },
  });

  function onSubmit(data: FolderFormValues) {
    console.log(data);
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
        }
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this folder?')) {
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
