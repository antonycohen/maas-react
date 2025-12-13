import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';
import { Organization } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getUserOrganizations = async (
  userId: string,
  params: GetCollectionQueryParams<Organization>,
): Promise<ApiCollectionResponse<Organization>> => {
  return await maasApi.organizations.getUserOrganizations(userId, params);
};

export const useGetUserOrganizations = (
  userId: string,
  params: GetCollectionQueryParams<Organization>,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Organization>, ApiError>,
    'queryKey'
  >,
) =>
  useQuery({
    queryKey: ['organizations', { userId, ...params }],
    queryFn: () => getUserOrganizations(userId, params),
    ...options,
  });
