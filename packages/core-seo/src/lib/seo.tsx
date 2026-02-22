import { useEffect } from 'react';

const SITE_NAME = 'Tangente Magazine';

export interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    jsonLd?: Record<string, unknown>;
    article?: {
        publishedTime?: string;
        author?: string;
        section?: string;
        tags?: string[];
    };
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
    document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function setLink(rel: string, href: string) {
    let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function removeLink(rel: string) {
    document.querySelector(`link[rel="${rel}"]`)?.remove();
}

export function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    noindex,
    jsonLd,
    article,
}: SeoProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    useEffect(() => {
        const prevTitle = document.title;
        document.title = fullTitle;
        return () => {
            document.title = prevTitle;
        };
    }, [fullTitle]);

    useEffect(() => {
        const desc = description || '';
        setMeta('name', 'description', desc);
        setMeta('property', 'og:description', desc);
        setMeta('name', 'twitter:description', desc);
    }, [description]);

    useEffect(() => {
        setMeta('property', 'og:title', fullTitle);
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:site_name', SITE_NAME);
    }, [fullTitle, type]);

    useEffect(() => {
        if (keywords && keywords.length > 0) {
            setMeta('name', 'keywords', keywords.join(', '));
        } else {
            removeMeta('name', 'keywords');
        }
    }, [keywords]);

    useEffect(() => {
        if (noindex) {
            setMeta('name', 'robots', 'noindex, nofollow');
        }
        return () => {
            removeMeta('name', 'robots');
        };
    }, [noindex]);

    useEffect(() => {
        if (url) {
            setLink('canonical', url);
            setMeta('property', 'og:url', url);
        }
        return () => {
            removeLink('canonical');
            removeMeta('property', 'og:url');
        };
    }, [url]);

    useEffect(() => {
        if (image) {
            setMeta('property', 'og:image', image);
            setMeta('name', 'twitter:image', image);
            setMeta('name', 'twitter:card', 'summary_large_image');
        } else {
            setMeta('name', 'twitter:card', 'summary');
            removeMeta('property', 'og:image');
            removeMeta('name', 'twitter:image');
        }
    }, [image]);

    useEffect(() => {
        if (article?.publishedTime) {
            setMeta('property', 'article:published_time', article.publishedTime);
        }
        if (article?.author) {
            setMeta('property', 'article:author', article.author);
        }
        if (article?.section) {
            setMeta('property', 'article:section', article.section);
        }
        article?.tags?.forEach((tag) => {
            const el = document.createElement('meta');
            el.setAttribute('property', 'article:tag');
            el.setAttribute('content', tag);
            el.setAttribute('data-seo', 'true');
            document.head.appendChild(el);
        });
        return () => {
            removeMeta('property', 'article:published_time');
            removeMeta('property', 'article:author');
            removeMeta('property', 'article:section');
            document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove());
        };
    }, [article?.publishedTime, article?.author, article?.section, article?.tags]);

    useEffect(() => {
        if (!jsonLd) return;
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(jsonLd);
        script.setAttribute('data-seo', 'true');
        document.head.appendChild(script);
        return () => {
            script.remove();
        };
    }, [jsonLd]);

    return null;
}
