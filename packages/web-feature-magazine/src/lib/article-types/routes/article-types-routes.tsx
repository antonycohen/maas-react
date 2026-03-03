import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const ArticleTypesListManagerPage = lazy(() =>
    import('../pages/list-article-types-manager-page').then((m) => ({
        default: m.ArticleTypesListManagerPage,
    }))
);
const EditArticleTypeManagerPage = lazy(() =>
    import('../pages/edit-article-type-manager-page').then((m) => ({
        default: m.EditArticleTypeManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const ArticleTypesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<ArticleTypesListManagerPage />} />
                <Route path="/:articleTypeId" element={<EditArticleTypeManagerPage />} />
            </Routes>
        </Suspense>
    );
};
