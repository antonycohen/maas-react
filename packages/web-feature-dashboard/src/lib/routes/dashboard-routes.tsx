import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const DashboardPage = lazy(() => import('../pages/dashboard-page').then((m) => ({ default: m.DashboardPage })));

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const DashboardRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
            </Routes>
        </Suspense>
    );
};
