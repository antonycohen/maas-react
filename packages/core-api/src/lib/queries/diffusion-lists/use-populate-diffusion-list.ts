import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionListEntry } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const usePopulateDiffusionList = (
    options?: Omit<UseMutationOptions<DiffusionListEntry[], ApiError, string>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => maasApi.diffusionLists.populateDiffusionList(id),
        onSuccess: (data, id, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', id] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-entries', id] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            onSuccess?.(data, id, onMutateResult, context);
        },
        ...restOptions,
    });
};
