import { Route, Routes } from 'react-router-dom';
import { FeaturesListManagerPage } from '../pages/list-features-manager-page/features-list-manager-page';
import { EditFeatureManagerPage } from '../pages/edit-feature-manager-page/edit-feature-manager-page';

export const FeaturesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FeaturesListManagerPage />} />
            <Route path=":featureId" element={<EditFeatureManagerPage />} />
        </Routes>
    );
};
