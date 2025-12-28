import { Route, Routes } from 'react-router-dom';
import { ArticlesListManagerPage } from '../pages/list-articles-manager-page/articles-list-manager-page';
import { EditArticleManagerPage } from '../pages/edit-article-manager-page';

export const ArticlesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ArticlesListManagerPage />} />
      <Route path="/:articleId" element={<EditArticleManagerPage />} />
    </Routes>
  );
};
