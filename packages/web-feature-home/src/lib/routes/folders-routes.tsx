import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';

const FoldersPage = lazy(() => import('../pages/folders-page/folders-page').then((m) => ({ default: m.FoldersPage })));
const FolderDetailsPages = lazy(() =>
    import('../pages/folder-details-page/folder-details-page').then((m) => ({
        default: m.FolderDetailsPages,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export function FolderRoutes() {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route index element={<FoldersPage />} />
                <Route path=":id" element={<FolderDetailsPages />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
