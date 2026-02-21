import { useOAuthStore } from '@maas/core-store-oauth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSessionStore } from '../store/session-store';

export function useProtectedPage() {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const resetSession = useSessionStore((state) => state.resetSession);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!accessToken) {
            resetSession();
            localStorage.setItem('target-url', `${location.pathname}${location.search}`);
            navigate('/login');
        }
    }, [accessToken, navigate, location.pathname, location.search, resetSession]);
}
