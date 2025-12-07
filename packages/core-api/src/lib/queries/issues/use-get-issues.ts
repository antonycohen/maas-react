import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Issue } from '@maas/core-api-models';
import { ApiError, maasApi, GetIssuesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetIssuesParams = GetCollectionQueryParams<Issue> & {
  filters?: GetIssuesFilter;
};

export const getIssues = async (
  params: GetIssuesParams
): Promise<ApiCollectionResponse<Issue>> => {
  return await maasApi.issues.getIssues(params);
};

export const useGetIssues = (
  params: GetIssuesParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Issue>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['issues', params],
    queryFn: () => getIssues(params),
    ...options,
  });
