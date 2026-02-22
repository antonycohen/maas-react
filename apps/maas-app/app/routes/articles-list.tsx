import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Articles',
        description: 'Tous les articles de Tangente Magazine.',
    });
}

export default function ArticlesList() {
    return null;
}
