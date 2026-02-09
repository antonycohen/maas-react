import { Collection } from '@maas/web-collection';
import { usePricesListColumns } from './hooks/use-prices-list-columns';
import { useGetPrices } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function PricesListManagerPage() {
    const columns = usePricesListColumns();
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Prices' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Prices"
                    actions={
                        <Button asChild>
                            <Link to={`${currentWorkspaceBaseUrl}/pms/prices/new`}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New Price
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search prices...',
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetPrices}
                    queryFields={{
                        id: null,
                        currency: null,
                        unitAmountInCents: null,
                        lookupKey: null,
                        active: null,
                        recurringInterval: null,
                        recurringIntervalCount: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
