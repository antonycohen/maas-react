import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IssuesListManagerPage = lazy(() =>
    import('../pages/list-issues-manager-page/issues-list-manager-page').then((m) => ({
        default: m.IssuesListManagerPage,
    }))
);
const EditIssueManagerPage = lazy(() =>
    import('../pages/edit-issue-manager-page/edit-issue-manager-page').then((m) => ({
        default: m.EditIssueManagerPage,
    }))
);
const IssueInfoTab = lazy(() =>
    import('../pages/edit-issue-manager-page/tabs/issue-info-tab/issue-info-tab').then((m) => ({
        default: m.IssueInfoTab,
    }))
);
const IssueOrganizerTab = lazy(() =>
    import('../pages/edit-issue-manager-page/tabs/issue-organizer-tab/issue-organizer-tab').then((m) => ({
        default: m.IssueOrganizerTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const IssuesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<IssuesListManagerPage />} />
                <Route path=":issueId" element={<EditIssueManagerPage />}>
                    <Route path="info" element={<IssueInfoTab />} />
                    <Route path="organizer" element={<IssueOrganizerTab />} />
                </Route>
            </Routes>
        </Suspense>
    );
};
