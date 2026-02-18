import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { DiffusionListEntry, CreateDiffusionListEntry } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type AddDiffusionListEntryParams = {
    diffusionListId: string;
    data: CreateDiffusionListEntry;
};

export const useAddDiffusionListEntry = (
    options?: Omit<UseMutationOptions<DiffusionListEntry, ApiError, AddDiffusionListEntryParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ diffusionListId, data }: AddDiffusionListEntryParams) =>
            maasApi.diffusionLists.addDiffusionListEntry(diffusionListId, data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', variables.diffusionListId] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-entries', variables.diffusionListId] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
};
