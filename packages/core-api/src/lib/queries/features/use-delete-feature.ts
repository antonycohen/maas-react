import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteFeature = async (featureId: string): Promise<void> => {
    return await maasApi.features.deleteFeature(featureId);
};

export const useDeleteFeature = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
        },
        ...options,
    });
};
