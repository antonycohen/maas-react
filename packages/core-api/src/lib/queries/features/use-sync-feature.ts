import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Feature } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const syncFeature = async (lookupKey: string): Promise<Feature> => {
    return await maasApi.features.syncFeature(lookupKey);
};

export const useSyncFeature = (options?: Omit<UseMutationOptions<Feature, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
        },
        ...options,
    });
};
