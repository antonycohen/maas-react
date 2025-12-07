import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Issue } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getIssueById = async (
  params: GetQueryByIdParams<Issue>
): Promise<Issue> => {
  return await maasApi.issues.getIssue(params);
};

export const useGetIssueById = (
  params: GetQueryByIdParams<Issue>,
  options?: Omit<UseQueryOptions<Issue, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['issue', params.id, params.fields],
    queryFn: () => getIssueById(params),
    ...options,
  });
