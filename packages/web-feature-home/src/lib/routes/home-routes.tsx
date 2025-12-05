import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/home-page/home-page';

export const HomeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
