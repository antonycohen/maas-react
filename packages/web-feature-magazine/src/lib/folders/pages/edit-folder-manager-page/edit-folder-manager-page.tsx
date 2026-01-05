import { TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { EditFolderProvider, useEditFolderContext } from './context';
import { useGetFolderById } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

const getTabItems = (baseUrl: string, folderId: string) => {
  if (folderId === 'new') {
    return [{ title: 'Info', url: `${baseUrl}/folders/new/info` }];
  }

  return [
    { title: 'Info', url: `${baseUrl}/folders/${folderId}/info` },
    { title: 'Articles', url: `${baseUrl}/folders/${folderId}/articles` },
  ];
};

function EditFolderContent() {
  const { folderId, isCreateMode } = useEditFolderContext();

  const workspaceUrl = useCurrentWorkspaceUrlPrefix();

  // Data fetching
  const { data: folder, isLoading } = useGetFolderById(
    {
      id: folderId,
      fields: {
        id: null,
        name: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  if (!isCreateMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isCreateMode && !folder) {
    return (
      <div className="flex h-screen items-center justify-center">
        Folder not found
      </div>
    );
  }

  const breadcrumbLabel = isCreateMode ? 'New' : (folder?.name ?? '');

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <header className="shrink-0">
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceUrl}/` },
            { label: 'Folders', to: `${workspaceUrl}/folders` },
            { label: breadcrumbLabel },
          ]}
        />
        <TabNavLinks items={getTabItems(workspaceUrl, folderId)} />
      </header>
      <Outlet />
    </div>
  );
}

export function EditFolderManagerPage() {
  const { folderId = '' } = useParams<{ folderId: string }>();

  return (
    <EditFolderProvider folderId={folderId}>
      <EditFolderContent />
    </EditFolderProvider>
  );
}
