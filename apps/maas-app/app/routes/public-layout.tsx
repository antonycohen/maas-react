import { Layout } from '@maas/web-layout';
import { useConnectedUser } from '@maas/core-store-session';

export default function PublicLayout() {
    const connectedUser = useConnectedUser();
    return <Layout connectedUser={connectedUser} />;
}
