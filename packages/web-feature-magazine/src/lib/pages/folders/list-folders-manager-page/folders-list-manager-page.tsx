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

export function FoldersListManagerPage() {
  const columns = useFoldersListColumns();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Folders' },
          ]}
        />
        <LayoutHeader
          pageTitle="Folders"
          actions={
            <Button asChild>
              <Link to="/folders/new">
                <IconPlus className="mr-2 h-4 w-4" />
                New Folder
              </Link>
            </Button>
          }
        />
      </header>
      <LayoutContent>
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
            color: null,
            isPublished: null,
            articleCount: null,
            cover: null,
          }}
        />
      </LayoutContent>
    </div>
  );
}
