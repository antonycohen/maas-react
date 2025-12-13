import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';
import { Organization } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getOrganizations = async (
  params: GetCollectionQueryParams<Organization>,
): Promise<ApiCollectionResponse<Organization>> => {
  return await maasApi.organizations.getOrganizations(params);
};

export const useGetOrganizations = (
  params: GetCollectionQueryParams<Organization>,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Organization>, ApiError>,
    'queryKey'
  >,
) =>
  useQuery({
    queryKey: ['organizations', params],
    queryFn: () => getOrganizations(params),
    ...options,
  });
