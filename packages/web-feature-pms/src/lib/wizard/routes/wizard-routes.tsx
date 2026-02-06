import { Route, Routes } from 'react-router-dom';
import { CreatePlanWizardPage } from '../pages/create-plan-wizard-page/create-plan-wizard-page';

export const WizardRoutes = () => {
    return (
        <Routes>
            <Route path="/create-plan" element={<CreatePlanWizardPage />} />
        </Routes>
    );
};
