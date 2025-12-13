import { GetQueryByIdParams } from '../../types';
import { Organization } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getOrganizationById = async (
  params: GetQueryByIdParams<Organization>,
): Promise<Organization> => {
  return await maasApi.organizations.getOrganization(params);
};

export const useGetOrganizationById = (
  params: GetQueryByIdParams<Organization>,
  options?: Omit<UseQueryOptions<Organization, ApiError>, 'queryKey'>,
) =>
  useQuery({
    queryKey: [params.id, params.fields],
    queryFn: () => getOrganizationById(params),
    ...options,
  });
