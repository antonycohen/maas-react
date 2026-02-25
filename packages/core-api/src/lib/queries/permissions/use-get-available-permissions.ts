import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AvailablePermissionsResponse, maasApi } from '../../api';

export const useGetAvailablePermissions = (
    options?: Omit<UseQueryOptions<AvailablePermissionsResponse>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: ['permissions', 'available'],
        queryFn: () => maasApi.permissions.getAvailablePermissions(),
        ...options,
    });
};
