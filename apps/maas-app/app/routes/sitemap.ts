import { maasApi } from '@maas/core-api';

export async function loader() {
    const siteUrl = process.env.VITE_SITE_URL || 'https://tangente-mag.com';

    // Static routes
    const staticRoutes = ['/', '/magazines', '/dossiers', '/articles', '/pricing', '/mathematical-themes'];

    // Dynamic routes — fetched from backend (Redis-cached)
    let dynamicUrls: string[] = [];

    try {
        const sitemap = await maasApi.sitemap.getSitemap();

        const articleUrls = sitemap.articles.map((slug) => `/articles/${slug}`);
        const issueUrls = sitemap.issues.map((slug) => `/magazines/${slug}`);
        const folderUrls = sitemap.folders.map((slug) => `/dossiers/${slug}`);
        const categoryUrls = sitemap.categories.filter((c) => c.slug).map((c) => `/categories/${c.slug}`);
        const themeUrls = sitemap.themes.map((theme) => `/mathematical-themes/${theme}`);

        dynamicUrls = [...articleUrls, ...issueUrls, ...folderUrls, ...categoryUrls, ...themeUrls];
    } catch {
        // If API is unreachable, generate sitemap with static routes only
    }

    const allUrls = [...staticRoutes, ...dynamicUrls];
    const now = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
    .map(
        (url) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : url.startsWith('/articles/') ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
