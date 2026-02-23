import { type RouteConfig, route, layout } from '@react-router/dev/routes';

export default [
    // SEO routes
    route('robots.txt', 'routes/robots.ts'),
    route('sitemap.xml', 'routes/sitemap.ts'),

    // Auth routes (no layout)
    route('login/*', 'routes/login.tsx'),
    route('logout', 'routes/logout.tsx'),

    // Admin — SPA-only, no SSR needed
    route('admin/*', 'routes/admin.tsx'),

    // Public routes — wrapped in Layout
    layout('routes/public-layout.tsx', [
        route('/', 'routes/home.tsx', { index: true }),
        // Split: listing + detail (for per-entity SSR SEO)
        route('magazines', 'routes/magazines-list.tsx'),
        route('magazines/:slug', 'routes/magazines-detail.tsx'),
        route('dossiers', 'routes/folders-list.tsx'),
        route('dossiers/:slug', 'routes/folders-detail.tsx'),
        route('articles', 'routes/articles-list.tsx'),
        route('articles/:slug', 'routes/articles-detail.tsx'),
        // Unchanged
        route('categories/:slug', 'routes/category.tsx'),
        route('mathematical-themes/:theme?', 'routes/math-themes.tsx'),
        route('pricing/*', 'routes/pricing.tsx'),
        route('account/*', 'routes/account.tsx'),
        route('*', 'routes/not-found.tsx'),
    ]),
] satisfies RouteConfig;
