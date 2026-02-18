import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const useDeleteDiffusionList = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => maasApi.diffusionLists.deleteDiffusionList(id),
        onSuccess: (data, id, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['diffusion-lists'] });
            queryClient.invalidateQueries({ queryKey: ['diffusion-list', id] });
            onSuccess?.(data, id, onMutateResult, context);
        },
        ...restOptions,
    });
};
