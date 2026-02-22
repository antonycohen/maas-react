// eslint-disable-next-line @nx/enforce-module-boundaries
import { CategoryPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Catégorie',
        description: 'Articles de mathématiques par catégorie.',
    });
}

export default function Category() {
    return <CategoryPage />;
}
