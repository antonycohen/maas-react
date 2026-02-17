import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard-page';

export const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    );
};
