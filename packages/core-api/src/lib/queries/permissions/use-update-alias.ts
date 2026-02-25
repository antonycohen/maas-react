import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { CreatePermissionAliasData, PermissionAlias, maasApi } from '../../api';
import { ApiError } from '../../api';

export const useUpdatePermissionAlias = (
    options?: Omit<UseMutationOptions<PermissionAlias, ApiError, CreatePermissionAliasData>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePermissionAliasData) => maasApi.permissions.updateAlias(data),
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['permissions', 'aliases'] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};
