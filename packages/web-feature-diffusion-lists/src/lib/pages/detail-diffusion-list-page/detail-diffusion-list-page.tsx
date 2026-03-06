import { useParams } from 'react-router';
import { useGetDiffusionListById } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { Alert, AlertDescription, AlertTitle, ConfirmActionDialog } from '@maas/web-components';
import { IconAlertTriangle } from '@tabler/icons-react';
import { DiffusionListHeader } from './components/diffusion-list-header';
import { PopulateStatsBanner } from './components/populate-stats-banner';
import { EntriesTable } from './components/entries-table';
import { useDiffusionListActions } from './hooks/use-diffusion-list-actions';
import { useState } from 'react';
import { AddEntryModal } from './components/add-entry-modal';

export default function DetailDiffusionListPage() {
    const { t } = useTranslation();
    const { diffusionListId = '' } = useParams<{ diffusionListId: string }>();
    const routes = useRoutes();

    const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);

    const {
        data: diffusionList,
        isLoading,
        refetch,
    } = useGetDiffusionListById(
        {
            id: diffusionListId,
            fields: {
                id: null,
                name: null,
                type: null,
                number: null,
                status: null,
                entryCount: null,
                needsAttentionCount: null,
                generatedAt: null,
                pdfDocumentId: null,
                createdAt: null,
                updatedAt: null,
                metadata: null,
            },
        },
        { enabled: !!diffusionListId }
    );

    const actions = useDiffusionListActions(diffusionListId, refetch, {
        needsAttentionCount: diffusionList?.needsAttentionCount ?? 0,
    });
    const confirmActionProps = actions.getConfirmActionProps();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!diffusionList) {
        return <div className="flex h-screen items-center justify-center">{t('diffusionLists.notFound')}</div>;
    }

    const status = diffusionList.status;
    const isDraft = status === 'draft';
    const isConfirmed = status === 'confirmed';
    const isGenerated = status === 'generated';
    const hasEntries = (diffusionList.entryCount ?? 0) > 0;
    const populateError = diffusionList.metadata?.populateError;
    const populateStats = diffusionList.metadata?.populateStats;
    const generateError = diffusionList.metadata?.generateError;
    const needsAttentionCount = diffusionList.needsAttentionCount ?? 0;

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: t('common.home'), to: routes.root() },
                        { label: t('diffusionLists.title'), to: routes.diffusionLists() },
                        { label: diffusionList.name ?? '' },
                    ]}
                />
            </header>

            <DiffusionListHeader
                diffusionList={diffusionList}
                onPopulate={isDraft && !hasEntries ? actions.handlePopulate : undefined}
                onRepopulate={isDraft && hasEntries ? actions.handleRepopulate : undefined}
                onConfirm={isDraft ? actions.handleConfirm : undefined}
                onRevertToDraft={isConfirmed ? actions.handleRevert : undefined}
                onGenerate={isConfirmed ? actions.handleGenerate : undefined}
                onDelete={!isGenerated ? actions.handleDelete : undefined}
                onDownloadPdf={isGenerated ? actions.handleDownloadPdf : undefined}
                isActionPending={actions.isActionPending}
            />

            {!isGenerated && (populateError || populateStats || generateError || needsAttentionCount > 0) && (
                <div className="flex flex-col gap-3 px-6 pt-4">
                    {populateError && (
                        <Alert variant="destructive">
                            <IconAlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('diffusionLists.populateErrorTitle')}</AlertTitle>
                            <AlertDescription>{populateError.message}</AlertDescription>
                        </Alert>
                    )}

                    {generateError && (
                        <Alert variant="destructive">
                            <IconAlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('diffusionLists.generateErrorTitle')}</AlertTitle>
                            <AlertDescription>{generateError.message}</AlertDescription>
                        </Alert>
                    )}

                    {populateStats && <PopulateStatsBanner stats={populateStats} />}

                    {needsAttentionCount > 0 && (
                        <Alert>
                            <IconAlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('diffusionLists.needsAttentionTitle')}</AlertTitle>
                            <AlertDescription>
                                {t('diffusionLists.needsAttentionDescription', {
                                    count: needsAttentionCount,
                                })}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            <LayoutContent>
                <EntriesTable
                    diffusionListId={diffusionListId}
                    isDraft={isDraft}
                    onAddEntry={() => setAddEntryModalOpen(true)}
                />
            </LayoutContent>

            {isDraft && (
                <AddEntryModal
                    open={addEntryModalOpen}
                    onOpenChange={setAddEntryModalOpen}
                    diffusionListId={diffusionListId}
                />
            )}

            <ConfirmActionDialog
                open={actions.confirmAction.open}
                onOpenChange={(open) => actions.setConfirmAction((prev) => ({ ...prev, open }))}
                onConfirm={actions.executeConfirmAction}
                title={confirmActionProps.title}
                description={confirmActionProps.description}
                confirmLabel={confirmActionProps.confirmLabel}
                variant={confirmActionProps.variant}
                countdown={confirmActionProps.countdown}
                isLoading={confirmActionProps.isLoading}
            />
        </div>
    );
}
