import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Country } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetCountriesParams = GetCollectionQueryParams<Country>;

export const getCountries = async (params: GetCountriesParams): Promise<ApiCollectionResponse<Country>> => {
    return await maasApi.countries.getCountries(params);
};

export const useCountries = (
    params: GetCountriesParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Country>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['countries', params],
        queryFn: () => getCountries(params),
        ...options,
    });
