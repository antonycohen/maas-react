// eslint-disable-next-line @nx/enforce-module-boundaries
import { MagazineDetailsPage } from '@maas/web-feature-home';
 
import { maasApi, ApiError } from '@maas/core-api';
import { buildPageMeta } from '@maas/core-seo';
import type { Route } from './+types/magazines-detail';

// Server loader — only runs on SSR for SEO meta tags
export async function loader({ params }: Route.LoaderArgs) {
    try {
        const issue = await maasApi.issues.getIssue({
            id: params.id!,
            fields: {
                title: null,
                description: null,
                cover: { fields: { url: null } },
                publishedAt: null,
            },
        });
        return { issue };
    } catch (error) {
        if (error instanceof ApiError && error.httpCode === 404) {
            throw new Response(null, { status: 404 });
        }
        return { issue: null };
    }
}

// Client loader — skip server round-trip on client-side navigation
export async function clientLoader() {
    return { issue: null };
}
clientLoader.hydrate = true as const;

export function meta({ data }: Route.MetaArgs) {
    if (!data?.issue) {
        return buildPageMeta({ title: 'Magazine' });
    }
    return buildPageMeta({
        title: data.issue.title ?? undefined,
        description: data.issue.description ?? undefined,
        image: data.issue.cover?.url ?? undefined,
        type: 'article',
        article: {
            publishedTime: data.issue.publishedAt ?? undefined,
        },
    });
}

export default function MagazinesDetail() {
    return <MagazineDetailsPage />;
}
