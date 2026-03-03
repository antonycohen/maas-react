import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const ArticlesListManagerPage = lazy(() =>
    import('../pages/list-articles-manager-page/articles-list-manager-page').then((m) => ({
        default: m.ArticlesListManagerPage,
    }))
);
const EditArticleManagerPage = lazy(() =>
    import('../pages/edit-article-manager-page').then((m) => ({
        default: m.EditArticleManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const ArticlesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<ArticlesListManagerPage />} />
                <Route path="/:articleId" element={<EditArticleManagerPage />} />
            </Routes>
        </Suspense>
    );
};
