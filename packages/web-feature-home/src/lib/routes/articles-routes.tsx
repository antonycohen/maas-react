import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';
import ArticleDetailsPage from '../pages/article-details-page/article-details-page';

export function ArticlesRoutes() {
    return (
        <Routes>
            {/*TODO: Add articles listings*/}
            <Route index />
            <Route path=":id" element={<ArticleDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
