import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionList } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const useConfirmDiffusionList = (
    options?: Omit<UseMutationOptions<DiffusionList, ApiError, string>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => maasApi.diffusionLists.confirmDiffusionList(id),
        onSuccess: (data, id, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', id] });
            onSuccess?.(data, id, onMutateResult, context);
        },
        ...restOptions,
    });
};
