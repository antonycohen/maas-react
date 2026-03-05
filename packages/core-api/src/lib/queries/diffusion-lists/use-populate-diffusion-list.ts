import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionListEntry } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type PopulateDiffusionListParams = {
    id: string;
    keepManual?: boolean;
};

export const usePopulateDiffusionList = (
    options?: Omit<UseMutationOptions<DiffusionListEntry[], ApiError, PopulateDiffusionListParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, keepManual }: PopulateDiffusionListParams) =>
            maasApi.diffusionLists.populateDiffusionList(id, { keepManual }),
        onSuccess: (data, params, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', params.id] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-entries', params.id] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-available-customers'] });
            onSuccess?.(data, params, onMutateResult, context);
        },
        ...restOptions,
    });
};
