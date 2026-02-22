import { Navigate, Route, Routes } from 'react-router';
import { TeamManagerPage } from '../pages/team-manager-page/team-manager-page';

export const TeamsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<TeamManagerPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};
