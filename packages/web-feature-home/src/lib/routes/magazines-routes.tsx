import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';

const MagazinesPage = lazy(() =>
    import('../pages/magazines-page/magazines-page').then((m) => ({ default: m.MagazinesPage }))
);
const MagazineDetailsPage = lazy(() =>
    import('../pages/magazine-details-page/magazine-details-page').then((m) => ({
        default: m.MagazineDetailsPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export function MagazinesRoutes() {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route index element={<MagazinesPage />} />
                <Route path=":id" element={<MagazineDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
