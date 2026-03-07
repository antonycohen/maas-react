import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReadComment } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { ApiCollectionResponse, FieldQuery } from '../../types';

export interface GetResourceCommentsParams {
    resource: string;
    refId: string;
    fields?: FieldQuery<ReadComment>;
    offset?: number;
    limit?: number;
    sortDirection?: string;
}

export const getResourceComments = async (
    params: GetResourceCommentsParams
): Promise<ApiCollectionResponse<ReadComment>> => {
    return await maasApi.comments.getResourceComments(params.resource, params.refId, params.fields, {
        offset: params.offset,
        limit: params.limit,
        sort_direction: params.sortDirection,
    });
};

export const useGetResourceComments = (
    params: GetResourceCommentsParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<ReadComment>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['comments', params.resource, params.refId, params.offset, params.limit, params.sortDirection],
        queryFn: () => getResourceComments(params),
        ...options,
    });
