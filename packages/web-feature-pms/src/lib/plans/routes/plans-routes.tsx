import { Route, Routes } from 'react-router';
import { PlansListManagerPage } from '../pages/list-plans-manager-page/plans-list-manager-page';
import { EditPlanManagerPage } from '../pages/edit-plan-manager-page/edit-plan-manager-page';
import { PlanInfoTab } from '../pages/edit-plan-manager-page/tabs/plan-info-tab';
import { PlanProductsTab } from '../pages/edit-plan-manager-page/tabs/plan-products-tab';

export const PlansRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PlansListManagerPage />} />
            <Route path=":planId" element={<EditPlanManagerPage />}>
                <Route path="info" element={<PlanInfoTab />} />
                <Route path="products" element={<PlanProductsTab />} />
            </Route>
        </Routes>
    );
};
