import { Collection } from '@maas/web-collection';
import { useBrandsListColumns } from './hooks/use-brands-list-columns';
import { useGetBrands } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function BrandsListManagerPage() {
    const { t } = useTranslation();
    const columns = useBrandsListColumns();
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: t('common.home'), to: '/' }, { label: t('brands.title') }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('brands.title')}
                    actions={
                        <Button asChild>
                            <Link to={`${workspaceBaseUrl}/brands/new`}>
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
                            queryParamName: 'term',
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
