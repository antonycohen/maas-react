import { Route, Routes } from 'react-router-dom';
import { UsersListManagerPage } from '../pages/list-users-manager-page/users-list-manager-page';
import { EditUserManagerPage } from '../pages/edit-user-manager-page/edit-user-manager-page';

export const UsersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersListManagerPage />} />
      <Route path="/:userId" element={<EditUserManagerPage />} />
    </Routes>
  );
};
