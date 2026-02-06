import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Plan, UpdatePlan } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdatePlanParams = {
    planId: string;
    data: UpdatePlan;
};

export const updatePlan = async ({ planId, data }: UpdatePlanParams): Promise<Plan> => {
    return await maasApi.plans.updatePlan(planId, data);
};

export const useUpdatePlan = (options?: Omit<UseMutationOptions<Plan, ApiError, UpdatePlanParams>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePlan,
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            queryClient.invalidateQueries({ queryKey: ['plan', planId] });
        },
        ...options,
    });
};
