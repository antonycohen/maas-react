import { Collection } from '@maas/web-collection';
import { usePricesListColumns } from './hooks/use-prices-list-columns';
import { useGetPrices } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function PricesListManagerPage() {
    const columns = usePricesListColumns();
    const routes = useRoutes();
    const { t } = useTranslation();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('prices.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('prices.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.pmsPriceEdit('new')}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('prices.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('prices.search'),
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
