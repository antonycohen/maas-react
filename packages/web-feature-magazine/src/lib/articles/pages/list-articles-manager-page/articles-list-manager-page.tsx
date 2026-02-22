import { Collection } from '@maas/web-collection';
import { useArticlesListColumns } from './hooks/use-articles-list-columns';
import { useGetArticles } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useArticleTypeOptions, usePublishedStatusOptions } from '../../../hook/use-filter-options';
import { useTranslation } from '@maas/core-translations';

export function ArticlesListManagerPage() {
    const { t } = useTranslation();
    const columns = useArticlesListColumns();
    const routes = useRoutes();
    const publishedStatusOptions = usePublishedStatusOptions();
    const articleTypeOptions = useArticleTypeOptions();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('articles.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('articles.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.articleNew()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('articles.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('articles.search'),
                            queryParamName: 'title',
                        },
                        facetedFilters: [
                            {
                                columnId: 'isPublished',
                                queryParamName: 'isPublished',
                                title: t('articles.publishedStatus'),
                                options: publishedStatusOptions,
                            },
                            {
                                columnId: 'type',
                                queryParamName: 'typeId',
                                title: t('articles.type'),
                                options: articleTypeOptions,
                            },
                        ],
                    }}
                    useQueryFn={useGetArticles}
                    queryFields={{
                        id: null,
                        title: null,
                        description: null,
                        type: null,
                        isPublished: null,
                        publishedAt: null,
                        createdAt: null,
                        featuredImage: null,
                        cover: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
