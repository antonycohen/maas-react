import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export type RemoveDiffusionListEntryParams = {
    diffusionListId: string;
    entryId: string;
};

export const useRemoveDiffusionListEntry = (
    options?: Omit<UseMutationOptions<void, ApiError, RemoveDiffusionListEntryParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ diffusionListId, entryId }: RemoveDiffusionListEntryParams) =>
            maasApi.diffusionLists.removeDiffusionListEntry(diffusionListId, entryId),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', variables.diffusionListId] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list-entries', variables.diffusionListId] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
};
