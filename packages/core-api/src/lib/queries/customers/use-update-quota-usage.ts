import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Quota } from '@maas/core-api-models';
import { ApiError, maasApi, UpdateQuotaUsageData } from '../../api';

export type UpdateQuotaUsageParams = {
    customerId: string;
    data: UpdateQuotaUsageData;
};

export const useUpdateQuotaUsage = (
    options?: Omit<UseMutationOptions<Quota, ApiError, UpdateQuotaUsageParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: UpdateQuotaUsageParams) =>
            maasApi.customers.updateQuotaUsage(customerId, data),
        onSuccess: (_, { customerId }) => {
            queryClient.invalidateQueries({ queryKey: ['quotas', customerId] });
        },
        ...options,
    });
};
