import { Collection } from '@maas/web-collection';
import { useFeaturesListColumns } from './hooks/use-features-list-columns';
import { useGetFeatures } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';

export function FeaturesListManagerPage() {
    const columns = useFeaturesListColumns();
    const routes = useRoutes();

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: routes.root() }, { label: 'Features' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Features"
                    actions={
                        <Button asChild>
                            <Link to={routes.pmsFeatureEdit('new')}>
                                <IconPlus className="mr-2 h-4 w-4" />
                                New Feature
                            </Link>
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: 'Search features...',
                            queryParamName: 'term',
                        },
                    }}
                    useQueryFn={useGetFeatures}
                    queryFields={{
                        id: null,
                        displayName: null,
                        lookupKey: null,
                        withQuota: null,
                        quotaAggregationFormula: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
