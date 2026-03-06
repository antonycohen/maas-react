import { useMemo } from 'react';
import { useSessionStore } from '../store/session-store';

export const useConnectedUser = () => {
    const connectedUser = useSessionStore((state) => state.connectedUser);

    return useMemo(() => {
        if (!connectedUser) return null;
        return {
            ...connectedUser,
            isAdmin: connectedUser.roles?.includes('ADMIN') ?? false,
        };
    }, [connectedUser]);
};
