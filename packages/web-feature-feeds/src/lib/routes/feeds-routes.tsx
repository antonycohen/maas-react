import { Route, Routes } from 'react-router-dom';
import { FeedPage } from '../feed-page/feed-page';
import { BrowserPage } from '../feed-page/browser-page';

export const FeedsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/browse" element={<BrowserPage />} />
    </Routes>
  );
};
