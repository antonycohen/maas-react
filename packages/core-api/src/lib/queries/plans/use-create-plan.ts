import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Plan, CreatePlan } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createPlan = async (data: CreatePlan): Promise<Plan> => {
    return await maasApi.plans.createPlan(data);
};

export const useCreatePlan = (options?: Omit<UseMutationOptions<Plan, ApiError, CreatePlan>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
        ...options,
    });
};
