import { Collection } from '@maas/web-collection';
import { useIssuesListColumns } from './hooks/use-issues-list-columns';
import { useGetIssues } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useBrandOptions } from '../../../brands/hooks/use-brand-options';
import { usePublishedStatusOptions } from '../../../hook/use-filter-options';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function IssuesListManagerPage() {
    const { t } = useTranslation();
    const columns = useIssuesListColumns();
    const routes = useRoutes();

    const brandOptions = useBrandOptions();
    const publishedStatusOptions = usePublishedStatusOptions();
    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('issues.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('issues.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.issueNewInfo()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('issues.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('issues.search'),
                            queryParamName: 'term',
                        },
                        facetedFilters: [
                            {
                                columnId: 'brand',
                                queryParamName: 'brandId',
                                title: t('field.brand'),
                                options: brandOptions,
                            },
                            {
                                columnId: 'isPublished',
                                queryParamName: 'isPublished',
                                title: t('articles.publishedStatus'),
                                options: publishedStatusOptions,
                            },
                        ],
                    }}
                    useQueryFn={useGetIssues}
                    queryFields={{
                        id: null,
                        title: null,
                        issueNumber: null,
                        cover: null,
                        isPublished: null,
                        publishedAt: null,
                        folderCount: null,
                        articleCount: null,
                        brand: {
                            fields: {
                                id: null,
                                name: null,
                            },
                        },
                    }}
                />
            </LayoutContent>
        </div>
    );
}
