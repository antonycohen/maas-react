import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deletePlan = async (planId: string): Promise<void> => {
    return await maasApi.plans.deletePlan(planId);
};

export const useDeletePlan = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
        ...options,
    });
};
