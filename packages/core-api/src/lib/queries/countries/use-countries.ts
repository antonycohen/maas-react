import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CountriesMap } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const getCountries = async (): Promise<CountriesMap> => {
    return await maasApi.countries.getCountries();
};

export const useCountries = (options?: Omit<UseQueryOptions<CountriesMap, ApiError>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        ...options,
    });
