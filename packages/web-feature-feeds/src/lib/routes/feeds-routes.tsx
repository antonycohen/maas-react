import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const FeedPage = lazy(() => import('../feed-page/feed-page').then((m) => ({ default: m.FeedPage })));
const BrowserPage = lazy(() => import('../feed-page/browser-page').then((m) => ({ default: m.BrowserPage })));

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const FeedsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route index element={<FeedPage />} />
                <Route path="browse" element={<BrowserPage />} />
            </Routes>
        </Suspense>
    );
};
