import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const UsersListManagerPage = lazy(() =>
    import('../pages/list-users-manager-page/users-list-manager-page').then((m) => ({
        default: m.UsersListManagerPage,
    }))
);
const EditUserManagerPage = lazy(() =>
    import('../pages/edit-user-manager-page/edit-user-manager-page').then((m) => ({
        default: m.EditUserManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const UsersRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<UsersListManagerPage />} />
                <Route path="/:userId" element={<EditUserManagerPage />} />
            </Routes>
        </Suspense>
    );
};
