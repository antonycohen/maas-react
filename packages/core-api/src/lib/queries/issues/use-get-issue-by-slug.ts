import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Issue } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryBySlugParams } from '../../types';

export const getIssueBySlug = async (params: GetQueryBySlugParams<Issue>): Promise<Issue> => {
    return await maasApi.issues.getIssueBySlug(params);
};

export const useGetIssueBySlug = (
    params: GetQueryBySlugParams<Issue>,
    options?: Omit<UseQueryOptions<Issue, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['issue', 'slug', params.slug, params.fields],
        queryFn: () => getIssueBySlug(params),
        ...options,
    });
