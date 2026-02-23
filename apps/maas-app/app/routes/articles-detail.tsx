import { ArticleDetailsPage } from '@maas/web-feature-home';
import { NotFoundPage } from '@maas/web-components';
import { maasApi, ApiError } from '@maas/core-api';
import { buildArticleMeta, buildPageMeta } from '@maas/core-seo';
import { useParams } from 'react-router';
import type { Route } from './+types/articles-detail';

// Server loader — only runs on SSR for SEO meta tags
export async function loader({ params }: Route.LoaderArgs) {
    try {
        const article = await maasApi.articles.getArticleBySlug({
            slug: params.slug ?? '',
            fields: {
                title: null,
                description: null,
                keywords: null,
                publishedAt: null,
                featuredImage: { fields: { url: null } },
                cover: { fields: { url: null } },
                categories: { fields: { name: null }, offset: 0, limit: 10 },
                customFields: null,
                author: { fields: { firstName: null, lastName: null } },
            },
        });
        return { article };
    } catch (error) {
        if (error instanceof ApiError && error.httpCode === 404) {
            throw new Response(null, { status: 404 });
        }
        return { article: null };
    }
}

// Client loader — skip server round-trip on client-side navigation
// The component fetches its own data via useGetArticleById
export async function clientLoader() {
    return { article: null };
}
clientLoader.hydrate = true as const;

export function meta({ data }: Route.MetaArgs) {
    if (!data?.article) {
        return buildPageMeta({ title: 'Article' });
    }
    return buildArticleMeta(data.article);
}

export function ErrorBoundary() {
    return <NotFoundPage />;
}

export default function ArticlesDetail() {
    const { slug } = useParams();
    // Key forces remount when navigating between articles (e.g. similar articles)
    return <ArticleDetailsPage key={slug} />;
}
