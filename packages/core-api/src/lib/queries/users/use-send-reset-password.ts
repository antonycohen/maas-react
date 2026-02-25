import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export type SendResetPasswordParams = {
    userId: string;
};

export const useSendResetPassword = (
    options?: Omit<UseMutationOptions<void, ApiError, SendResetPasswordParams>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: (params: SendResetPasswordParams) => maasApi.users.sendResetPasswordLink(params.userId),
        ...options,
    });
};
