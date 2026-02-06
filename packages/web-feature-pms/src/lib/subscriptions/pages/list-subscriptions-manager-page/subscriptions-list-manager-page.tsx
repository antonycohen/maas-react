import { Collection } from '@maas/web-collection';
import { useSubscriptionsListColumns } from './hooks/use-subscriptions-list-columns';
import { useGetSubscriptions } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';

export function SubscriptionsListManagerPage() {
    const columns = useSubscriptionsListColumns();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Subscriptions' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader pageTitle="Subscriptions" />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search subscriptions...',
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetSubscriptions}
                    queryFields={{
                        id: null,
                        status: null,
                        currentPeriodStart: null,
                        currentPeriodEnd: null,
                        cancelAtPeriodEnd: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
