import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Brand, UpdateBrand } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateBrandParams = {
  brandId: string;
  data: UpdateBrand;
};

export const updateBrand = async (
  params: UpdateBrandParams,
): Promise<Brand> => {
  return await maasApi.brands.patchBrand(params.brandId, params.data);
};

export const useUpdateBrand = (
  options?: Omit<
    UseMutationOptions<Brand, ApiError, UpdateBrandParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({
        queryKey: ['brand', variables.brandId],
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
