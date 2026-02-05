import { Collection } from '@maas/web-collection';
import { useProductsListColumns } from './hooks/use-products-list-columns';
import { useGetProducts } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function ProductsListManagerPage() {
    const columns = useProductsListColumns();
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Products"
                    actions={
                        <Button asChild>
                            <Link to={`${currentWorkspaceBaseUrl}/pms/products/new/info`}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New Product
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search products...',
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
