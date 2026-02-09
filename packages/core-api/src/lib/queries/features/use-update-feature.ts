import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Feature, UpdateFeature } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateFeatureParams = {
    featureId: string;
    data: UpdateFeature;
};

export const updateFeature = async ({ featureId, data }: UpdateFeatureParams): Promise<Feature> => {
    return await maasApi.features.updateFeature(featureId, data);
};

export const useUpdateFeature = (
    options?: Omit<UseMutationOptions<Feature, ApiError, UpdateFeatureParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateFeature,
        onSuccess: (_, { featureId }) => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
            queryClient.invalidateQueries({ queryKey: ['feature', featureId] });
        },
        ...options,
    });
};
