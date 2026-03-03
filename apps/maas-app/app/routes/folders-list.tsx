import { FoldersPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import { RouteErrorFallback } from '../components/route-error-fallback';

export function meta() {
    return buildPageMeta({
        title: 'Dossiers',
        description: 'Explorez nos dossiers thématiques de mathématiques.',
    });
}

export function ErrorBoundary() {
    return <RouteErrorFallback />;
}

export default function FoldersList() {
    return <FoldersPage />;
}
