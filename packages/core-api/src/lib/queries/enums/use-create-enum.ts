import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Enum, CreateEnum } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createEnum = async (data: CreateEnum): Promise<Enum> => {
  return await maasApi.enums.createEnum(data);
};

export const useCreateEnum = (
  options?: Omit<UseMutationOptions<Enum, ApiError, CreateEnum>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEnum,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['enums'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
