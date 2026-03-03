import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';

const ArticleDetailsPage = lazy(() =>
    import('../pages/article-details-page/article-details-page').then((m) => ({
        default: m.default,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export function ArticlesRoutes() {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                {/*TODO: Add articles listings*/}
                <Route index />
                <Route path=":id" element={<ArticleDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
