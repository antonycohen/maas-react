import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const PlansListManagerPage = lazy(() =>
    import('../pages/list-plans-manager-page/plans-list-manager-page').then((m) => ({
        default: m.PlansListManagerPage,
    }))
);
const EditPlanManagerPage = lazy(() =>
    import('../pages/edit-plan-manager-page/edit-plan-manager-page').then((m) => ({
        default: m.EditPlanManagerPage,
    }))
);
const PlanInfoTab = lazy(() =>
    import('../pages/edit-plan-manager-page/tabs/plan-info-tab').then((m) => ({
        default: m.PlanInfoTab,
    }))
);
const PlanProductsTab = lazy(() =>
    import('../pages/edit-plan-manager-page/tabs/plan-products-tab').then((m) => ({
        default: m.PlanProductsTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const PlansRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<PlansListManagerPage />} />
                <Route path=":planId" element={<EditPlanManagerPage />}>
                    <Route path="info" element={<PlanInfoTab />} />
                    <Route path="products" element={<PlanProductsTab />} />
                </Route>
            </Routes>
        </Suspense>
    );
};
