import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/login-page/login-page';
import { OauthCallbackPage } from '../pages/oauth-callback-page/oauth-callback-page';
import { DispatcherPage } from '../pages/dipatcher-page/dispatcher-page';

export const LoginRoutes = () => {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="callback" index element={<OauthCallbackPage />} />
      <Route path="dispatcher" index element={<DispatcherPage />} />
    </Routes>
  );
};
