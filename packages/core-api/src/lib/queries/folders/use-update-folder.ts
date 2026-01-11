import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Folder, UpdateFolder } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateFolderParams = {
  folderId: string;
  data: UpdateFolder;
};

export const updateFolder = async (
  params: UpdateFolderParams,
): Promise<Folder> => {
  console.log('Updating folder:', params.folderId, params.data);
  return await maasApi.folders.patchFolder(params.folderId, params.data);
};

export const useUpdateFolder = (
  options?: Omit<
    UseMutationOptions<Folder, ApiError, UpdateFolderParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFolder,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({
        queryKey: ['folder', variables.folderId],
      });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
