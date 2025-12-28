import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Enum, UpdateEnum } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateEnumParams = {
  enumId: string;
  data: UpdateEnum;
};

export const updateEnum = async (params: UpdateEnumParams): Promise<Enum> => {
  return await maasApi.enums.patchEnum(params.enumId, params.data);
};

export const useUpdateEnum = (
  options?: Omit<
    UseMutationOptions<Enum, ApiError, UpdateEnumParams>,
    'mutationFn'
  >
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEnum,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['enums'] });
      queryClient.invalidateQueries({
        queryKey: ['enum', variables.enumId],
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
