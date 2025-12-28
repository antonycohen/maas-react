import { Route, Routes } from 'react-router-dom';
import { ArticleTypesListManagerPage } from '../pages/list-article-types-manager-page';
import { EditArticleTypeManagerPage } from '../pages/edit-article-type-manager-page';

export const ArticleTypesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticleTypesListManagerPage />} />
      <Route path="/:articleTypeId" element={<EditArticleTypeManagerPage />} />
    </Routes>
  );
};
