import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useConnectedUser } from '@maas/core-store-session';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useTranslation } from '@maas/core-translations';

export const DispatcherPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const connectedUser = useConnectedUser();
    const accessToken = useOAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (!connectedUser && !accessToken) {
            navigate('/login', { replace: true });
            return;
        }

        if (!connectedUser && accessToken) {
            return;
        }

        const targetUrl = localStorage.getItem('target-url');
        if (targetUrl) {
            localStorage.removeItem('target-url');
            navigate(targetUrl, { replace: true });
            return;
        }

        navigate('/', { replace: true });
    }, [accessToken, connectedUser, navigate]);

    return (
        <div>
            <h1>{t('login.redirecting')}</h1>
        </div>
    );
};
