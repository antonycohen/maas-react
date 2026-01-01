import { Route, Routes } from 'react-router-dom';
import { MagazineDetailsPage } from '../pages/magazine-details-page/magazine-details-page';
import { MagazinesPage } from '../pages/magazines-page/magazines-page';

export function MagazinesRoutes() {
  return (
    <Routes>
      <Route index element={<MagazinesPage />} />
      <Route path=":id" element={<MagazineDetailsPage />} />
    </Routes>
  );
}
