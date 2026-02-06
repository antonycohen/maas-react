import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Feature, CreateFeature } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createFeature = async (data: CreateFeature): Promise<Feature> => {
    return await maasApi.features.createFeature(data);
};

export const useCreateFeature = (
    options?: Omit<UseMutationOptions<Feature, ApiError, CreateFeature>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
        },
        ...options,
    });
};
