import { TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import {
  EditIssueProvider,
  useEditIssueContext,
} from './tabs/issue-organizer-tab/context';
import { useIssueData } from './tabs/issue-organizer-tab/hooks';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

const getTabItems = (baseUrl: string, issueId: string) => {
  if (issueId === 'new') {
    return [{ title: 'Info', url: `${baseUrl}/issues/new/info` }];
  }

  return [
    { title: 'Info', url: `${baseUrl}/issues/${issueId}/info` },
    { title: 'Organizer', url: `${baseUrl}/issues/${issueId}/organizer` },
  ];
};

function EditIssueContent() {
  const { isCreateMode, issueId } = useEditIssueContext();

  const workspaceUrl = useCurrentWorkspaceUrlPrefix();
  // Data fetching
  const { issue, isLoading: isLoadingIssue } = useIssueData();

  if (!isCreateMode && isLoadingIssue) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isCreateMode && !issue) {
    return (
      <div className="flex h-screen items-center justify-center">
        Issue not found
      </div>
    );
  }
  const breadcrumbLabel = isCreateMode ? 'New' : (issue?.title ?? '');

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <header className="shrink-0">
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceUrl}/` },
            { label: 'Issues', to: `${workspaceUrl}/issues` },
            { label: breadcrumbLabel },
          ]}
        />
        <TabNavLinks items={getTabItems(workspaceUrl, issueId)} />
      </header>
      <Outlet />
    </div>
  );
}

export function EditIssueManagerPage() {
  const { issueId = '' } = useParams<{ issueId: string }>();

  return (
    <EditIssueProvider issueId={issueId}>
      <EditIssueContent />
    </EditIssueProvider>
  );
}
