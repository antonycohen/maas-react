import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const InvoicesListManagerPage = lazy(() =>
    import('../pages/list-invoices-manager-page/invoices-list-manager-page').then((m) => ({
        default: m.InvoicesListManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const InvoicesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<InvoicesListManagerPage />} />
            </Routes>
        </Suspense>
    );
};
