import { GetQueryByIdParams } from '../../types';
import { User } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getUserById = async (
  params: GetQueryByIdParams<User>
): Promise<User> => {
  return await maasApi.users.getUser(params);
};


export const useGetUserById = (
  params: GetQueryByIdParams<User>,
  options?: Omit<UseQueryOptions<User, ApiError>, "queryKey">,
) =>
  useQuery({
    queryKey: [params.id, params.fields],
    queryFn: () => getUserById(params),
    ...options,
  });
