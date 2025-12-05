import { Collection } from '@maas/web-collection';
import { useUsersListColumns } from './hooks/use-users-list-columns';
import { useGetUsers } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';

export function UsersListManagerPage() {
  const columns = useUsersListColumns();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Users', to: '/users' },
          ]}
        />
        <LayoutHeader pageTitle={'Users'} />
      </header>
      <LayoutContent>
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search users...',
              queryParamName: 'term',
            },
            facetedFilters: [
              {
                columnId: 'roles',
                title: 'Roles',
                queryParamName: 'roles',
                options: [
                  { value: 'admin', label: 'Admin' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' },
                ],
              },
            ],
          }}
          useQueryFn={useGetUsers}
          queryFields={{
            id: null,
            firstName: null,
            lastName: null,
            email: null,
          }}
        />
      </LayoutContent>
    </div>
  );
}
