import type { MetaDescriptor } from 'react-router';

const SITE_NAME = 'Tangente Magazine';

export interface PageMetaProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    keywords?: string[];
    article?: {
        publishedTime?: string;
        author?: string;
        section?: string;
        tags?: string[];
    };
    jsonLd?: Record<string, unknown>;
}

export function buildPageMeta(props: PageMetaProps): MetaDescriptor[] {
    const { title, description, image, url, type = 'website', noindex, keywords, article, jsonLd } = props;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    const meta: MetaDescriptor[] = [
        { title: fullTitle },
        { property: 'og:title', content: fullTitle },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: SITE_NAME },
        { name: 'twitter:title', content: fullTitle },
    ];

    if (description) {
        meta.push(
            { name: 'description', content: description },
            { property: 'og:description', content: description },
            { name: 'twitter:description', content: description }
        );
    }

    if (image) {
        meta.push(
            { property: 'og:image', content: image },
            { name: 'twitter:image', content: image },
            { name: 'twitter:card', content: 'summary_large_image' }
        );
    } else {
        meta.push({ name: 'twitter:card', content: 'summary' });
    }

    if (url) {
        meta.push({ property: 'og:url', content: url }, { tagName: 'link', rel: 'canonical', href: url });
    }

    if (noindex) {
        meta.push({ name: 'robots', content: 'noindex, nofollow' });
    }

    if (keywords && keywords.length > 0) {
        meta.push({ name: 'keywords', content: keywords.join(', ') });
    }

    if (article?.publishedTime) {
        meta.push({ property: 'article:published_time', content: article.publishedTime });
    }
    if (article?.author) {
        meta.push({ property: 'article:author', content: article.author });
    }
    if (article?.section) {
        meta.push({ property: 'article:section', content: article.section });
    }
    if (article?.tags) {
        article.tags.forEach((tag) => meta.push({ property: 'article:tag', content: tag }));
    }

    if (jsonLd) {
        meta.push({ 'script:ld+json': jsonLd });
    }

    return meta;
}

export function buildArticleMeta(article: {
    title?: string | null;
    description?: string | null;
    keywords?: string[] | null;
    featuredImage?: { url?: string | null } | null;
    cover?: { url?: string | null } | null;
    publishedAt?: string | null;
    createdAt?: string | null;
    author?: { firstName?: string | null; lastName?: string | null } | null;
    categories?: { name?: string | null }[] | null;
    customFields?: Record<string, unknown> | null;
}): MetaDescriptor[] {
    const cf = (article.customFields ?? {}) as Record<string, unknown>;

    const keywords = cf['seoKeywords']
        ? String(cf['seoKeywords'])
              .split(',')
              .map((k: string) => k.trim())
              .filter(Boolean)
        : (article.keywords ?? undefined);

    const authorName = article.author
        ? `${article.author.firstName ?? ''} ${article.author.lastName ?? ''}`.trim()
        : undefined;

    return buildPageMeta({
        title: (cf['seoTitle'] as string) || article.title || undefined,
        description: (cf['seoDescription'] as string) || article.description || undefined,
        keywords,
        image: (cf['seoOgImage'] as string) || article.featuredImage?.url || article.cover?.url || undefined,
        url: (cf['seoCanonicalUrl'] as string) || undefined,
        noindex: (cf['seoNoIndex'] as boolean) ?? false,
        type: 'article',
        jsonLd: (cf['seoJsonLd'] as Record<string, unknown>) ?? undefined,
        article: {
            publishedTime: article.publishedAt ?? article.createdAt ?? undefined,
            author: authorName,
            section: article.categories?.[0]?.name ?? undefined,
            tags: article.keywords ?? undefined,
        },
    });
}
