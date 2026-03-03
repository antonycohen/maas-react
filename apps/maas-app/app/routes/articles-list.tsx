import { ArticlesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import { RouteErrorFallback } from '../components/route-error-fallback';

export function meta() {
    return buildPageMeta({
        title: 'Articles',
        description: 'Tous les articles de Tangente Magazine.',
    });
}

export function ErrorBoundary() {
    return <RouteErrorFallback />;
}

export default function ArticlesList() {
    return <ArticlesPage />;
}
