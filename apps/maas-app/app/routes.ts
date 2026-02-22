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
        route('magazines/*', 'routes/magazines.tsx'),
        route('dossiers/*', 'routes/folders.tsx'),
        route('categories/:slug', 'routes/category.tsx'),
        route('mathematical-themes/:theme?', 'routes/math-themes.tsx'),
        route('articles/*', 'routes/articles.tsx'),
        route('pricing/*', 'routes/pricing.tsx'),
        route('account/*', 'routes/account.tsx'),
        route('*', 'routes/not-found.tsx'),
    ]),
] satisfies RouteConfig;
