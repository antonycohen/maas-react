import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const FeaturesListManagerPage = lazy(() =>
    import('../pages/list-features-manager-page/features-list-manager-page').then((m) => ({
        default: m.FeaturesListManagerPage,
    }))
);
const EditFeatureManagerPage = lazy(() =>
    import('../pages/edit-feature-manager-page/edit-feature-manager-page').then((m) => ({
        default: m.EditFeatureManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const FeaturesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<FeaturesListManagerPage />} />
                <Route path=":featureId" element={<EditFeatureManagerPage />} />
            </Routes>
        </Suspense>
    );
};
