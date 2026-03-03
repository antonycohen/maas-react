import { MagazinesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import { RouteErrorFallback } from '../components/route-error-fallback';

export function meta() {
    return buildPageMeta({
        title: 'Magazines',
        description: 'Tous les numéros de Tangente Magazine - La revue des mathématiques accessibles.',
    });
}

export function ErrorBoundary() {
    return <RouteErrorFallback />;
}

export default function MagazinesList() {
    return <MagazinesPage />;
}
