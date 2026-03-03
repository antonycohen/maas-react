import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CreatePlanWizardPage = lazy(() =>
    import('../pages/create-plan-wizard-page/create-plan-wizard-page').then((m) => ({
        default: m.CreatePlanWizardPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const WizardRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="create-plan" element={<CreatePlanWizardPage />} />
            </Routes>
        </Suspense>
    );
};
