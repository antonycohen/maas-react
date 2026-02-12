import { Collection } from '@maas/web-collection';
import { useIssuesListColumns } from './hooks/use-issues-list-columns';
import { useGetIssues } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useBrandOptions } from '../../../brands/hooks/use-brand-options';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function IssuesListManagerPage() {
    const { t } = useTranslation();
    const columns = useIssuesListColumns();
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    const brandOptions = useBrandOptions();
    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: t('common.home'), to: '/' }, { label: t('issues.title') }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('issues.title')}
                    actions={
                        <Button asChild>
                            <Link to={`${workspaceBaseUrl}/issues/new/info`}>
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
                            queryParamName: 'title',
                        },
                        facetedFilters: [
                            {
                                columnId: 'brand',
                                queryParamName: 'brand',
                                title: t('field.brand'),
                                options: brandOptions,
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
