import { Collection } from '@maas/web-collection';
import { useCategoriesListColumns } from './hooks/use-categories-list-columns';
import { useGetCategories } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function CategoriesListManagerPage() {
    const { t } = useTranslation();
    const columns = useCategoriesListColumns();
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: t('common.home'), to: `${currentWorkspaceBaseUrl}` },
                        { label: t('categories.title') },
                    ]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('categories.title')}
                    actions={
                        <Button asChild>
                            <Link to={`${currentWorkspaceBaseUrl}/categories/new`}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('categories.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('categories.search'),
                            queryParamName: 'name',
                        },
                    }}
                    useQueryFn={useGetCategories}
                    queryFields={{
                        id: null,
                        name: null,
                        description: null,
                        cover: null,
                        parent: {
                            fields: {
                                id: null,
                                name: null,
                            },
                        },
                        childrenCount: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
