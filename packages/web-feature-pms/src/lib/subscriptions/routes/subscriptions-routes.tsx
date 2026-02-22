import { Route, Routes } from 'react-router';
import { SubscriptionsListManagerPage } from '../pages/list-subscriptions-manager-page/subscriptions-list-manager-page';
import { ViewSubscriptionManagerPage } from '../pages/view-subscription-manager-page/view-subscription-manager-page';

export const SubscriptionsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SubscriptionsListManagerPage />} />
            <Route path=":subscriptionId" element={<ViewSubscriptionManagerPage />} />
        </Routes>
    );
};
