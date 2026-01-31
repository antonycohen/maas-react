import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Issue } from '@maas/core-api-models';
import { ApiError, maasApi, GetIssuesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetIssuesParams<S = undefined> = GetCollectionQueryParams<Issue, S> & {
  filters?: GetIssuesFilter;
};

export const getIssues = async <S = undefined>(
  params: GetIssuesParams<S>
): Promise<ApiCollectionResponse<Issue>> => {
  return await maasApi.issues.getIssues(params as any);
};

export const useGetIssues = <S = undefined>(
  params: GetIssuesParams<S>,
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
