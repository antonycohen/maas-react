import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useConnectedUser } from '@maas/core-store-session';
import { useOAuthStore } from '@maas/core-store-oauth';

export const DispatcherPage = () => {
  const navigate = useNavigate();
  const connectedUser = useConnectedUser();
  const accessToken = useOAuthStore((state) => state.accessToken);

  const targetUrl = localStorage.getItem("target-url") ?? "";

  useEffect(() => {
    if (!connectedUser && !accessToken) {
      navigate("/login");
      return;
    }

    if (!connectedUser && accessToken) {
      return;
    }

    if (targetUrl) {
      localStorage.removeItem("target-url");
      navigate(targetUrl);
      return;
    }

    navigate('/', { replace: true });
  }, [accessToken, connectedUser, navigate, targetUrl])


  return (
    <div>
      <h1>Redirecting</h1>
    </div>
  );
};
