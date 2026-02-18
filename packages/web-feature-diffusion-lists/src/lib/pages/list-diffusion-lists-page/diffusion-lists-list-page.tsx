import { Collection } from '@maas/web-collection';
import { useDiffusionListsColumns } from './hooks/use-diffusion-lists-columns';
import { useGetDiffusionLists } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useGetCurrentWorkspaceId, useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { useState } from 'react';
import { CreateDiffusionListModal } from '../detail-diffusion-list-page/components/create-diffusion-list-modal';

export default function DiffusionListsListPage() {
    const { t } = useTranslation();
    const columns = useDiffusionListsColumns();
    const organizationId = useGetCurrentWorkspaceId();
    const routes = useRoutes();
    const [createModalOpen, setCreateModalOpen] = useState(false);

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('diffusionLists.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('diffusionLists.title')}
                    actions={
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <IconPlus className="mr-2 h-4 w-4" />
                            {t('diffusionLists.new')}
                        </Button>
                    }
                />
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        textFilter: {
                            placeholder: t('diffusionLists.search'),
                            queryParamName: 'term',
                        },
                        facetedFilters: [
                            {
                                columnId: 'status',
                                queryParamName: 'status',
                                title: t('field.status'),
                                options: [
                                    { label: t('diffusionLists.status.draft'), value: 'draft' },
                                    { label: t('diffusionLists.status.populating'), value: 'populating' },
                                    { label: t('diffusionLists.status.confirmed'), value: 'confirmed' },
                                    { label: t('diffusionLists.status.generating'), value: 'generating' },
                                    { label: t('diffusionLists.status.generated'), value: 'generated' },
                                ],
                            },
                        ],
                    }}
                    useQueryFn={useGetDiffusionLists}
                    queryFields={{
                        id: null,
                        name: null,
                        type: null,
                        status: null,
                        entryCount: null,
                        createdAt: null,
                    }}
                    staticParams={{
                        organizationId: organizationId ?? '',
                    }}
                />
            </LayoutContent>
            <CreateDiffusionListModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
        </div>
    );
}
