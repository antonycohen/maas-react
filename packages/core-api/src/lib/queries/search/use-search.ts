import { useQuery } from '@tanstack/react-query';
import { SearchResponse } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const useSearch = (term: string) =>
    useQuery<SearchResponse, ApiError>({
        queryKey: ['search', term],
        queryFn: () => maasApi.search.search(term),
        enabled: term.length >= 2,
    });
