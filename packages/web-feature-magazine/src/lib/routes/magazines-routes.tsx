import { Route, Routes } from 'react-router-dom';
import { MagazinesListPage } from '../pages/magazines-list-page/magazines-list-page';

export const MagazinesRoutes = () => {
  return (
    <Routes>
      <Route path="/magazines" element={<MagazinesListPage />} />
    </Routes>
  );
};
