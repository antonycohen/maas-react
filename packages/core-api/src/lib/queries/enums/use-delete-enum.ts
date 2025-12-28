import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteEnum = async (enumId: string): Promise<void> => {
  return await maasApi.enums.deleteEnum(enumId);
};

export const useDeleteEnum = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEnum,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['enums'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
