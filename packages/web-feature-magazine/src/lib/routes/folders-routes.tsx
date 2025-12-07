import { Route, Routes } from 'react-router-dom';
import { FoldersListManagerPage } from '../pages/folders';

export const FoldersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FoldersListManagerPage />} />
    </Routes>
  );
};
