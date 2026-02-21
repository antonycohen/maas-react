import { Collection } from '@maas/web-collection';
import { usePlansListColumns } from './hooks/use-plans-list-columns';
import { useGetPlans } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus, IconWand } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function PlansListManagerPage() {
    const { t } = useTranslation();
    const columns = usePlansListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('plans.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('plans.title')}
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link to={`${routes.pmsWizard()}/create-plan`}>
                                    <IconWand className="mr-2 h-4 w-4" />
                                    {t('plans.createWithWizard')}
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to={routes.pmsPlanNewInfo()}>
                                    <IconPlus className="mr-2 h-4 w-4" />
                                    {t('plans.new')}
                                </Link>
                            </Button>
                        </div>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('plans.search'),
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetPlans}
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
