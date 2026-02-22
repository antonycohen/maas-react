import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';
import { MagazineDetailsPage } from '../pages/magazine-details-page/magazine-details-page';
import { MagazinesPage } from '../pages/magazines-page/magazines-page';

export function MagazinesRoutes() {
    return (
        <Routes>
            <Route index element={<MagazinesPage />} />
            <Route path=":id" element={<MagazineDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
