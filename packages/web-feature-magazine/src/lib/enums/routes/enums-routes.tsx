import { Route, Routes } from 'react-router';
import { EnumsListManagerPage } from '../pages/list-enums-manager-page';
import { EditEnumManagerPage } from '../pages/edit-enum-manager-page';

export const EnumsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<EnumsListManagerPage />} />
            <Route path="/:enumId" element={<EditEnumManagerPage />} />
        </Routes>
    );
};
