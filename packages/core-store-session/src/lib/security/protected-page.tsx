import { useOAuthStore } from '@maas/core-store-oauth';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const ProtectedPage = () => {
  const accessToken = useOAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      localStorage.setItem(
        'target-url',
        `${location.pathname}${location.search}`,
      );
      navigate('/login');
    }
  }, [accessToken, navigate, location.pathname, location.search]);

  return <Outlet />;
};
