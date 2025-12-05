import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Brand, CreateBrand } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createBrand = async (data: CreateBrand): Promise<Brand> => {
  return await maasApi.brands.createBrand(data);
};

export const useCreateBrand = (
  options?: Omit<UseMutationOptions<Brand, ApiError, CreateBrand>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
