import { Route, Routes } from 'react-router-dom';
import { EditIssueManagerPage } from '../pages/edit-issue-manager-page';

export const IssuesRoutes = () => {
  return (
    <Routes>
      <Route path="/:issueId" element={<EditIssueManagerPage />} />
    </Routes>
  );
};
