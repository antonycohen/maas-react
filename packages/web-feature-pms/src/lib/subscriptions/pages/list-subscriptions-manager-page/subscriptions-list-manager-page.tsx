import { Collection } from '@maas/web-collection';
import { useSubscriptionsListColumns } from './hooks/use-subscriptions-list-columns';
import { useGetSubscriptions } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';

const useSubscriptionStatusOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'active', label: t('customers.subscriptions.statusActive') },
        { value: 'canceled', label: t('customers.subscriptions.statusCanceled') },
        { value: 'trialing', label: t('customers.subscriptions.statusTrialing') },
        { value: 'past_due', label: t('customers.subscriptions.statusPastDue') },
        { value: 'unpaid', label: t('customers.subscriptions.statusUnpaid') },
        { value: 'paused', label: t('customers.subscriptions.statusPaused') },
    ];
};

export function SubscriptionsListManagerPage() {
    const { t } = useTranslation();
    const columns = useSubscriptionsListColumns();
    const statusOptions = useSubscriptionStatusOptions();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('subscriptions.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader pageTitle={t('subscriptions.title')} />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('subscriptions.searchPlaceholder'),
                            queryParamName: 'term',
                        },
                        facetedFilters: [
                            {
                                columnId: 'status',
                                queryParamName: 'status',
                                title: t('field.status'),
                                options: statusOptions,
                            },
                        ],
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
