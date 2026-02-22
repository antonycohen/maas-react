import { Route, Routes } from 'react-router';
import { FeedPage } from '../feed-page/feed-page';
import { BrowserPage } from '../feed-page/browser-page';

export const FeedsRoutes = () => {
    return (
        <Routes>
            <Route index element={<FeedPage />} />
            <Route path="browse" element={<BrowserPage />} />
        </Routes>
    );
};
