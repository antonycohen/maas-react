import { HomePage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import { RouteErrorFallback } from '../components/route-error-fallback';

export function headers() {
    return {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=240',
    };
}

export function meta() {
    return buildPageMeta({
        title: undefined,
        description:
            'Tangente Magazine - La revue des mathématiques accessibles. Découvrez nos articles, dossiers et numéros.',
    });
}

export function ErrorBoundary() {
    return <RouteErrorFallback />;
}

export default function Home() {
    return <HomePage />;
}
