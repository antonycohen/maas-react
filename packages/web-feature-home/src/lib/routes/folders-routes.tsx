import { Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '@maas/web-components';
import { FoldersPage } from '../pages/folders-page/folders-page';
import { FolderDetailsPages } from '../pages/folder-details-page/folder-details-page';

export function FolderRoutes() {
    return (
        <Routes>
            <Route index element={<FoldersPage />} />
            <Route path=":id" element={<FolderDetailsPages />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
