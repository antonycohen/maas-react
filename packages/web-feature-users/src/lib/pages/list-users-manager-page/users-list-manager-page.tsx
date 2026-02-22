import { Collection } from '@maas/web-collection';
import { useUsersListColumns } from './hooks/use-users-list-columns';
import { useGetUsers } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useRoutes } from '@maas/core-workspace';
import { Button } from '@maas/web-components';
import { Link } from 'react-router';
import { IconPlus } from '@tabler/icons-react';

export function UsersListManagerPage() {
    const columns = useUsersListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: 'Users', to: routes.users() },
                    ]}
                />
                <LayoutHeader
                    pageTitle="Users"
                    actions={
                        <Button asChild>
                            <Link to={routes.userEdit('new')}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New User
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
