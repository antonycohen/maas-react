import { Route, Routes } from 'react-router-dom';
import { IssuesListManagerPage } from '../pages/issues/list-issues-manager-page';
import { EditIssueManagerPage } from '../pages/issues/edit-issue-manager-page';

export const IssuesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IssuesListManagerPage />} />
      <Route path="/:issueId" element={<EditIssueManagerPage />} />
    </Routes>
  );
};
