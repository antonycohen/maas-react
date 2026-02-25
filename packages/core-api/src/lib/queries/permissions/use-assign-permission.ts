import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AssignAliasToUserData, maasApi } from '../../api';
import { ApiError } from '../../api';

export const useAssignAliasToUser = (
    options?: Omit<UseMutationOptions<void, ApiError, AssignAliasToUserData>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: (data: AssignAliasToUserData) => maasApi.permissions.assignAliasToUser(data),
        ...options,
    });
};
