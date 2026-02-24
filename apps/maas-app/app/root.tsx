import './env'; // Validate environment variables on boot
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { SessionProvider } from '@maas/core-store-session';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { Toaster } from '@maas/web-components';
import { TranslationProvider } from '@maas/core-translations';

import '../src/styles.css';

const ReactQueryDevtools = lazy(() =>
    import('@tanstack/react-query-devtools').then((mod) => ({ default: mod.ReactQueryDevtools }))
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});

export function meta() {
    return [{ title: 'Tangente Magazine' }, { name: 'description', content: 'Tangente Magazine - Mathématiques' }];
}

export function links() {
    return [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }];
}

export default function Root() {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body suppressHydrationWarning>
                <QueryClientProvider client={queryClient}>
                    {import.meta.env.DEV && (
                        <Suspense fallback={null}>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </Suspense>
                    )}
                    <Toaster position="bottom-right" />
                    <TranslationProvider>
                        <SessionProvider>
                            <Outlet />
                        </SessionProvider>
                    </TranslationProvider>
                </QueryClientProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
