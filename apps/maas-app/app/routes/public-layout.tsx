import { Layout } from '@maas/web-layout';
import { useConnectedUser } from '@maas/core-store-session';
import { ErrorBoundary } from '@maas/web-components';

export default function PublicLayout() {
    const connectedUser = useConnectedUser();
    return (
        <ErrorBoundary>
            <Layout connectedUser={connectedUser} />
        </ErrorBoundary>
    );
}
