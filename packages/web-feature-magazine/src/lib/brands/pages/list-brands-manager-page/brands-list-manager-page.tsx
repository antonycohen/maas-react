import { Collection } from '@maas/web-collection';
import { useBrandsListColumns } from './hooks/use-brands-list-columns';
import { useGetBrands } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function BrandsListManagerPage() {
    const { t } = useTranslation();
    const columns = useBrandsListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('brands.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('brands.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.brandNew()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('brands.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('brands.search'),
                            queryParamName: 'name',
                        },
                    }}
                    useQueryFn={useGetBrands}
                    queryFields={{
                        id: null,
                        name: null,
                        description: null,
                        isActive: null,
                        issueCount: null,
                        logo: null,
                        issueConfiguration: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
