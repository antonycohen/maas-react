import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionList, CreateDiffusionList } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type CreateDiffusionListParams = {
    organizationId: string;
    data: CreateDiffusionList;
};

export const useCreateDiffusionList = (
    options?: Omit<UseMutationOptions<DiffusionList, ApiError, CreateDiffusionListParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ organizationId, data }: CreateDiffusionListParams) =>
            maasApi.diffusionLists.createDiffusionList(organizationId, data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
};
