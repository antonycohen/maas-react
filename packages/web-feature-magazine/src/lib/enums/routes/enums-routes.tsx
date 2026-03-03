import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const EnumsListManagerPage = lazy(() =>
    import('../pages/list-enums-manager-page').then((m) => ({
        default: m.EnumsListManagerPage,
    }))
);
const EditEnumManagerPage = lazy(() =>
    import('../pages/edit-enum-manager-page').then((m) => ({
        default: m.EditEnumManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const EnumsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<EnumsListManagerPage />} />
                <Route path="/:enumId" element={<EditEnumManagerPage />} />
            </Routes>
        </Suspense>
    );
};
