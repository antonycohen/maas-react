import { ArticlesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Articles',
        description: 'Tous les articles de Tangente Magazine.',
    });
}

export default function ArticlesList() {
    return <ArticlesPage />;
}
