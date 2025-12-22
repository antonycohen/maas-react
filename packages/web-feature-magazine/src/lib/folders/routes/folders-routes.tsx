import { Route, Routes } from 'react-router-dom';
import { FoldersListManagerPage } from '../pages/list-folders-manager-page/folders-list-manager-page';

export const FoldersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FoldersListManagerPage
      />} />
    </Routes>
  );
};
