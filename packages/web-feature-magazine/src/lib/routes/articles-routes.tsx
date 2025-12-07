import { Route, Routes } from 'react-router-dom';
import { ArticlesListManagerPage } from '../pages/articles';

export const ArticlesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticlesListManagerPage />} />
    </Routes>
  );
};
