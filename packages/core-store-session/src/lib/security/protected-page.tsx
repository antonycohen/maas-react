import { useOAuthStore } from '@maas/core-store-oauth';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const ProtectedPage = () => {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const navigate = useNavigate();
    const location = useLocation();
    const locationRef = useRef(location);
    locationRef.current = location;

    useEffect(() => {
        if (!accessToken) {
            const { pathname, search } = locationRef.current;
            localStorage.setItem('target-url', `${pathname}${search}`);
            navigate('/login', { replace: true });
        }
    }, [accessToken, navigate]);

    if (!accessToken) {
        return null;
    }

    return <Outlet />;
};
