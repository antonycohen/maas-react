import { Collection } from '@maas/web-collection';
import { useFoldersListColumns } from './hooks/use-folders-list-columns';
import { useGetFolders } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function FoldersListManagerPage() {
  const columns = useFoldersListColumns();

  const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Folders' }]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle="Folders"
          actions={
            <Button asChild>
              <Link to={`${currentWorkspaceBaseUrl}/folders/new/info`}>
                <IconPlus className="mr-2 h-4 w-4" />
                New Folder
              </Link>
            </Button>
          }
        />
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search folders...',
              queryParamName: 'term',
            },
          }}
          useQueryFn={useGetFolders}
          queryFields={{
            id: null,
            name: null,
            description: null,
            issue: null,
            isPublished: null,
            articleCount: null,
            cover: null,
          }}
        />
      </LayoutContent>
    </div>
  );
}
