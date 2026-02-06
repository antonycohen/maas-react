import { Collection } from '@maas/web-collection';
import { usePlansListColumns } from './hooks/use-plans-list-columns';
import { useGetPlans } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus, IconWand } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function PlansListManagerPage() {
    const columns = usePlansListColumns();
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Subscription Plans' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Subscription Plans"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link to={`${currentWorkspaceBaseUrl}/pms/wizard/create-plan`}>
                                    <IconWand className="mr-2 h-4 w-4" />
                                    Create with Wizard
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to={`${currentWorkspaceBaseUrl}/pms/plans/new/info`}>
                                    <IconPlus className="mr-2 h-4 w-4" />
                                    New Plan
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
                            placeholder: 'Search plans...',
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
