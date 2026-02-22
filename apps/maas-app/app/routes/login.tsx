import { LoginRoutes } from '@maas/web-feature-login';
import { useIsClient } from '@maas/core-utils';

export default function Login() {
    const isClient = useIsClient();
    if (!isClient) return null;
    return <LoginRoutes />;
}
