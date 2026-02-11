import { Collection } from '@maas/web-collection';
import { useCustomersListColumns } from './hooks/use-customers-list-columns';
import { useGetCustomers } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useRoutes } from '@maas/core-workspace';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';

export function CustomersListManagerPage() {
    const columns = useCustomersListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: 'Customers', to: routes.customers() },
                    ]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Customers"
                    actions={
                        <Button asChild>
                            <Link to={routes.customerInfo('new')}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New Customer
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search customers...',
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetCustomers}
                    queryFields={{
                        id: null,
                        name: null,
                        email: null,
                        phone: null,
                        refId: null,
                        balance: null,
                        currency: null,
                        createdAt: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
