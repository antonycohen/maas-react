import { Collection } from '@maas/web-collection';
import { useCustomersListColumns } from './hooks/use-customers-list-columns';
import { useGetCustomers } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useRoutes } from '@maas/core-workspace';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

export function CustomersListManagerPage() {
    const columns = useCustomersListColumns();
    const routes = useRoutes();
    const { t } = useTranslation();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: t('common.home'), to: routes.root() },
                        { label: t('customers.title'), to: routes.customers() },
                    ]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('customers.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.customerInfo('new')}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('customers.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('customers.search'),
                            queryParamName: 'query',
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
