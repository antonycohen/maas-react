import { FolderDetailsPages } from '@maas/web-feature-home';
import { NotFoundPage } from '@maas/web-components';

import { maasApi, ApiError } from '@maas/core-api';
import { buildPageMeta } from '@maas/core-seo';
import type { Route } from './+types/folders-detail';

// Server loader — only runs on SSR for SEO meta tags
export async function loader({ params }: Route.LoaderArgs) {
    try {
        const folder = await maasApi.folders.getFolder({
            id: params.id ?? '',
            fields: {
                name: null,
                description: null,
                cover: { fields: { url: null } },
            },
        });
        return { folder };
    } catch (error) {
        if (error instanceof ApiError && error.httpCode === 404) {
            throw new Response(null, { status: 404 });
        }
        return { folder: null };
    }
}

// Client loader — skip server round-trip on client-side navigation
export async function clientLoader() {
    return { folder: null };
}
clientLoader.hydrate = true as const;

export function meta({ data }: Route.MetaArgs) {
    if (!data?.folder) {
        return buildPageMeta({ title: 'Dossier' });
    }
    return buildPageMeta({
        title: data.folder.name ?? undefined,
        description: data.folder.description ?? undefined,
        image: data.folder.cover?.url ?? undefined,
    });
}

export function ErrorBoundary() {
    return <NotFoundPage />;
}

export default function FoldersDetail() {
    return <FolderDetailsPages />;
}
