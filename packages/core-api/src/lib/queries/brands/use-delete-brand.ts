import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteBrand = async (brandId: string): Promise<void> => {
  return await maasApi.brands.deleteBrand(brandId);
};

export const useDeleteBrand = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
