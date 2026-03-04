import { HomePage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import { getHomepage } from '@maas/core-api';
import { RouteErrorFallback } from '../components/route-error-fallback';
import type { Route } from './+types/home';

export async function loader() {
    try {
        const homepage = await getHomepage({
            issueFields: 'id,title,slug,cover,published_at,issue_number',
            articleFields: 'id,title,cover,categories,slug,published_at,author,description',
        });
        return { homepage };
    } catch (error) {
        console.error('[Home loader] Failed to fetch homepage:', error);
        return { homepage: null };
    }
}

// Client-side navigation skips server round-trip — component fetches its own data
export async function clientLoader() {
    return { homepage: null };
}
clientLoader.hydrate = true as const;

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

export default function Home({ loaderData }: Route.ComponentProps) {
    return <HomePage initialData={loaderData?.homepage} />;
}
