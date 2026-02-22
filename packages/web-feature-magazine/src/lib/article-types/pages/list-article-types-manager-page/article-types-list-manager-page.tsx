import { Collection } from '@maas/web-collection';
import { useArticleTypesListColumns } from './hooks/use-article-types-list-columns';
import { useGetArticleTypes } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function ArticleTypesListManagerPage() {
    const { t } = useTranslation();
    const columns = useArticleTypesListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('articleTypes.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('articleTypes.title')}
                    actions={
                        <Button asChild>
                            <Link to={routes.articleTypeNew()}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('articleTypes.new')}
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('articleTypes.search'),
                            queryParamName: 'name',
                        },
                    }}
                    useQueryFn={useGetArticleTypes}
                    queryFields={{
                        id: null,
                        name: null,
                        fields: null,
                        isActive: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
