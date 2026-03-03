import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const TeamManagerPage = lazy(() =>
    import('../pages/team-manager-page/team-manager-page').then((m) => ({
        default: m.TeamManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const TeamsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<TeamManagerPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};
