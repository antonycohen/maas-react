import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Folder, CreateFolder } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createFolder = async (data: CreateFolder): Promise<Folder> => {
  return await maasApi.folders.createFolder(data);
};

export const useCreateFolder = (
  options?: Omit<UseMutationOptions<Folder, ApiError, CreateFolder>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
