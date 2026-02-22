import { Collection } from '@maas/web-collection';
import { useFoldersListColumns } from './hooks/use-folders-list-columns';
import { useGetFolders } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { usePublishedStatusOptions } from '../../../hook/use-filter-options';
import { useTranslation } from '@maas/core-translations';

export function FoldersListManagerPage() {
    const { t } = useTranslation();
    const columns = useFoldersListColumns();

    const routes = useRoutes();
    const publishedStatusOptions = usePublishedStatusOptions();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('folders.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('folders.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.folderNewInfo()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('folders.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('folders.search'),
                            queryParamName: 'name',
                        },
                        facetedFilters: [
                            {
                                columnId: 'isPublished',
                                queryParamName: 'isPublished',
                                title: t('articles.publishedStatus'),
                                options: publishedStatusOptions,
                            },
                        ],
                    }}
                    useQueryFn={useGetFolders}
                    queryFields={{
                        id: null,
                        name: null,
                        description: null,
                        isPublished: null,
                        articleCount: null,
                        cover: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
