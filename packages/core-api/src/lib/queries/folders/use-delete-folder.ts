import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteFolder = async (folderId: string): Promise<void> => {
  return await maasApi.folders.deleteFolder(folderId);
};

export const useDeleteFolder = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
