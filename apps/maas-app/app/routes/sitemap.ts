import { maasApi } from '@maas/core-api';

export async function loader() {
    const siteUrl = process.env.VITE_SITE_URL || 'https://tangente-mag.com';

    // Static routes
    const staticRoutes = ['/', '/magazines', '/dossiers', '/pricing', '/mathematical-themes'];

    // Dynamic routes — fetch published content
    let articleUrls: string[] = [];
    let issueUrls: string[] = [];
    let folderUrls: string[] = [];
    let categoryUrls: string[] = [];

    try {
        const [articles, issues, folders, categories] = await Promise.all([
            maasApi.articles.getArticles({
                offset: 0,
                limit: 1000,
                filters: { isPublished: true },
                fields: { id: null } as never,
            }),
            maasApi.issues.getIssues({
                offset: 0,
                limit: 500,
                filters: { isPublished: true },
                fields: { id: null } as never,
            }),
            maasApi.folders.getFolders({
                offset: 0,
                limit: 500,
                filters: { isPublished: true },
                fields: { id: null } as never,
            }),
            maasApi.categories.getCategories({
                offset: 0,
                limit: 200,
                fields: { slug: null } as never,
            }),
        ]);

        articleUrls = articles.data.map((a) => `/articles/${a.id}`);
        issueUrls = issues.data.map((i) => `/magazines/${i.id}`);
        folderUrls = folders.data.map((f) => `/dossiers/${f.id}`);
        categoryUrls = categories.data
            .filter((c) => (c as { slug?: string }).slug)
            .map((c) => `/categories/${(c as { slug: string }).slug}`);
    } catch {
        // If API is unreachable, generate sitemap with static routes only
    }

    const allUrls = [...staticRoutes, ...articleUrls, ...issueUrls, ...folderUrls, ...categoryUrls];
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
