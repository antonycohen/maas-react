import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PermissionAlias, maasApi } from '../../api';

export const useGetPermissionAliases = (options?: Omit<UseQueryOptions<PermissionAlias[]>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
        queryKey: ['permissions', 'aliases'],
        queryFn: () => maasApi.permissions.getAliases(),
        ...options,
    });
};
