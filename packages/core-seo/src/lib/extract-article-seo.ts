import type { Article } from '@maas/core-api-models';
import type { SeoProps } from './seo';

/**
 * SEO custom fields as stored in the article's customFields (camelCase from API).
 *
 * Maps to BDD fields:
 *   seo_title         → seoTitle
 *   seo_description   → seoDescription
 *   seo_keywords      → seoKeywords
 *   seo_og_image      → seoOgImage
 *   seo_canonical_url  → seoCanonicalUrl
 *   seo_no_index      → seoNoIndex
 *   seo_json_ld       → seoJsonLd
 */
interface ArticleSeoCustomFields {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    seoOgImage?: string | null;
    seoCanonicalUrl?: string;
    seoNoIndex?: boolean | null;
    seoJsonLd?: Record<string, unknown> | null;
}

export function extractArticleSeo(article: Article): SeoProps {
    const cf = (article.customFields ?? {}) as ArticleSeoCustomFields;

    const keywords = cf.seoKeywords
        ? cf.seoKeywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
        : (article.keywords ?? undefined);

    const authorName = article.author
        ? `${article.author.firstName ?? ''} ${article.author.lastName ?? ''}`.trim()
        : undefined;

    return {
        title: cf.seoTitle || article.title,
        description: cf.seoDescription || article.description || undefined,
        keywords,
        image: cf.seoOgImage || article.featuredImage?.url || article.cover?.url || undefined,
        url: cf.seoCanonicalUrl || undefined,
        noindex: cf.seoNoIndex ?? false,
        type: 'article',
        jsonLd: cf.seoJsonLd ?? undefined,
        article: {
            publishedTime: article.publishedAt ?? article.createdAt ?? undefined,
            author: authorName,
            section: article.categories?.[0]?.name ?? undefined,
            tags: article.keywords ?? undefined,
        },
    };
}
