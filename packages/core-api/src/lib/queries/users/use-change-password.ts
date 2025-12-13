import {useMutation, UseMutationOptions, useQueryClient,} from '@tanstack/react-query';
import {ChangePasswordRequest} from '@maas/core-api-models';
import {ApiError, maasApi} from '../../api';

export type ChangePasswordParams = {
  userId: string;
  data: ChangePasswordRequest;
};

export const changePassword = async (params: ChangePasswordParams): Promise<void> => {
  return await maasApi.users.changePassword(params.userId, params.data);
};

export const useChangePassword = (
  options?: Omit<
    UseMutationOptions<void, ApiError, ChangePasswordParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSuccess?.(...args);
    },
    ...restOptions,
  });
};
