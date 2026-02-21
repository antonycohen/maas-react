import { Collection } from '@maas/web-collection';
import { useEnumsListColumns } from './hooks/use-enums-list-columns';
import { useGetEnums } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';

export function EnumsListManagerPage() {
    const columns = useEnumsListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: routes.root() }, { label: 'Enums' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Enums"
                    actions={
                        <Button asChild>
                            <Link to={routes.enumNew()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New Enum
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search enums...',
                            queryParamName: 'name',
                        },
                    }}
                    useQueryFn={useGetEnums}
                    queryFields={{
                        id: null,
                        name: null,
                        values: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
