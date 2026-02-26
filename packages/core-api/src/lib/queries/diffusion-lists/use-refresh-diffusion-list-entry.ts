import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionListEntry } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

interface RefreshDiffusionListEntryParams {
    diffusionListId: string;
    entryId: string;
}

export const useRefreshDiffusionListEntry = (
    options?: Omit<UseMutationOptions<DiffusionListEntry, ApiError, RefreshDiffusionListEntryParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ diffusionListId, entryId }: RefreshDiffusionListEntryParams) =>
            maasApi.diffusionLists.refreshDiffusionListEntry(diffusionListId, entryId),
        onSuccess: (data, params, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-entries', params.diffusionListId] });
            onSuccess?.(data, params, onMutateResult, context);
        },
        ...restOptions,
    });
};
