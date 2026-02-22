import { Route, Routes } from 'react-router';
import { IssueOrganizerTab } from '../pages/edit-issue-manager-page/tabs/issue-organizer-tab/issue-organizer-tab';
import { IssueInfoTab } from '../pages/edit-issue-manager-page/tabs/issue-info-tab/issue-info-tab';
import { EditIssueManagerPage } from '../pages/edit-issue-manager-page/edit-issue-manager-page';
import { IssuesListManagerPage } from '../pages/list-issues-manager-page/issues-list-manager-page';

export const IssuesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<IssuesListManagerPage />} />
            <Route path=":issueId" element={<EditIssueManagerPage />}>
                <Route path="info" element={<IssueInfoTab />} />
                <Route path="organizer" element={<IssueOrganizerTab />} />
            </Route>
        </Routes>
    );
};
