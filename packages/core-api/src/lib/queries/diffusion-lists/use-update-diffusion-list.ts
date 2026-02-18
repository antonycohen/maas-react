import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionList, UpdateDiffusionList } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateDiffusionListParams = {
    id: string;
    data: UpdateDiffusionList;
};

export const useUpdateDiffusionList = (
    options?: Omit<UseMutationOptions<DiffusionList, ApiError, UpdateDiffusionListParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateDiffusionListParams) => maasApi.diffusionLists.updateDiffusionList(id, data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', variables.id] });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
};
