// eslint-disable-next-line @nx/enforce-module-boundaries
import { ArticlesRoutes } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Articles',
        description: 'Tous les articles de Tangente Magazine.',
    });
}

export default function Articles() {
    return <ArticlesRoutes />;
}
