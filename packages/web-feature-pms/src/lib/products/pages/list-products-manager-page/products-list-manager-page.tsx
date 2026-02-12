import { Collection } from '@maas/web-collection';
import { useProductsListColumns } from './hooks/use-products-list-columns';
import { useGetProducts } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function ProductsListManagerPage() {
    const columns = useProductsListColumns();
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
    const { t } = useTranslation();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: t('common.home'), to: '/' }, { label: t('products.title') }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('products.title')}
                    actions={
                        <Button asChild>
                            <Link to={`${currentWorkspaceBaseUrl}/pms/products/new/info`}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('products.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('products.search'),
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetProducts}
                    queryFields={{
                        id: null,
                        name: null,
                        description: null,
                        active: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
