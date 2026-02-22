// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { BrowserRouter } from 'react-router';
import { SessionProvider } from '@maas/core-store-session';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { RootRoutes } from './routes/root-routes';
import { Toaster } from 'sonner';
import { TranslationProvider } from '@maas/core-translations';

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

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
            <Toaster />
            <TranslationProvider>
                <SessionProvider>
                    <BrowserRouter>
                        <RootRoutes />
                    </BrowserRouter>
                </SessionProvider>
            </TranslationProvider>
        </QueryClientProvider>
    );
}

export default App;
