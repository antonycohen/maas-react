import { CategoryPage } from '@maas/web-feature-home';
import { NotFoundPage } from '@maas/web-components';

import { maasApi } from '@maas/core-api';
import { buildPageMeta } from '@maas/core-seo';
import type { Route } from './+types/category';

// Server loader — only runs on SSR for SEO meta tags
export async function loader({ params }: Route.LoaderArgs) {
    try {
        const response = await maasApi.categories.getCategories({
            offset: 0,
            limit: 1,
            filters: { slug: params.slug },
            fields: { id: null, name: null, description: null },
        });
        const category = response.data?.[0];
        if (!category) {
            throw new Response(null, { status: 404 });
        }
        return { category };
    } catch (error) {
        if (error instanceof Response) throw error;
        return { category: null };
    }
}

// Client loader — skip server round-trip on client-side navigation
export async function clientLoader() {
    return { category: null };
}
clientLoader.hydrate = true as const;

export function meta({ data }: Route.MetaArgs) {
    if (!data?.category) {
        return buildPageMeta({
            title: 'Catégorie',
            description: 'Articles de mathématiques par catégorie.',
        });
    }
    return buildPageMeta({
        title: data.category.name ?? undefined,
        description: data.category.description ?? `Articles dans la catégorie ${data.category.name}.`,
    });
}

export function ErrorBoundary() {
    return <NotFoundPage />;
}

export default function Category() {
    return <CategoryPage />;
}
