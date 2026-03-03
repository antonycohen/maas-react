import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const SubscriptionsListManagerPage = lazy(() =>
    import('../pages/list-subscriptions-manager-page/subscriptions-list-manager-page').then((m) => ({
        default: m.SubscriptionsListManagerPage,
    }))
);
const ViewSubscriptionManagerPage = lazy(() =>
    import('../pages/view-subscription-manager-page/view-subscription-manager-page').then((m) => ({
        default: m.ViewSubscriptionManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const SubscriptionsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<SubscriptionsListManagerPage />} />
                <Route path=":subscriptionId" element={<ViewSubscriptionManagerPage />} />
            </Routes>
        </Suspense>
    );
};
