export function loader() {
    const isProduction = process.env.NODE_ENV === 'production';

    const content = isProduction
        ? `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /logout
Disallow: /account/

Sitemap: ${process.env.VITE_SITE_URL || 'https://tangente-mag.com'}/sitemap.xml`
        : `User-agent: *
Disallow: /`;

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
