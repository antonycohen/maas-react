import { useGetDiffusionListEntries, useRemoveDiffusionListEntry } from '@maas/core-api';
import { DiffusionListEntry } from '@maas/core-api-models';
import {
    Badge,
    Button,
    ConfirmActionDialog,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@maas/web-components';
import { Collection } from '@maas/web-collection';
import { IconAlertTriangle, IconPlus } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';
import { toast } from 'sonner';
import { useState } from 'react';
import { useEntriesColumns } from '../hooks/use-entries-columns';

interface Props {
    diffusionListId: string;
    isDraft: boolean;
    onAddEntry: () => void;
}

export const EntriesTable = ({ diffusionListId, isDraft, onAddEntry }: Props) => {
    const { t, isKeyExist } = useTranslation();
    const [removeDialog, setRemoveDialog] = useState<{ open: boolean; entryId?: string }>({ open: false });
    const [previewEntry, setPreviewEntry] = useState<DiffusionListEntry | null>(null);

    const removeMutation = useRemoveDiffusionListEntry({
        onSuccess: () => {
            toast.success(t('diffusionLists.entryRemoved'));
            setRemoveDialog({ open: false });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleRemove = (entry: DiffusionListEntry) => {
        setRemoveDialog({ open: true, entryId: entry.id });
    };

    const handleConfirmRemove = () => {
        if (removeDialog.entryId) {
            removeMutation.mutate({ diffusionListId, entryId: removeDialog.entryId });
        }
    };

    const columns = useEntriesColumns({
        isDraft,
        onRemove: handleRemove,
        onPreview: setPreviewEntry,
        isRemoving: removeMutation.isPending,
    });

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('diffusionLists.entries')}</h2>
                {isDraft && (
                    <Button variant="outline" size="sm" onClick={onAddEntry}>
                        <IconPlus className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.addFreeEntry')}
                    </Button>
                )}
            </div>

            <Collection
                columns={columns}
                useQueryFn={useGetDiffusionListEntries}
                staticParams={{ diffusionListId }}
                filtersConfiguration={{
                    textFilter: {
                        placeholder: t('diffusionLists.searchEntries'),
                        queryParamName: 'query',
                    },
                    facetedFilters: [
                        {
                            columnId: 'isManual',
                            queryParamName: 'isManual',
                            title: t('diffusionLists.freeEntry'),
                            options: [
                                { label: t('common.yes'), value: 'true' },
                                { label: t('common.no'), value: 'false' },
                            ],
                        },
                    ],
                }}
                queryFields={{
                    id: null,
                    refType: null,
                    refId: null,
                    name: null,
                    address: null,
                    email: null,
                    phone: null,
                    isManual: null,
                    features: null,
                    needsAttention: null,
                    attentionReason: null,
                }}
            />

            <ConfirmActionDialog
                open={removeDialog.open}
                onOpenChange={(open) => setRemoveDialog((prev) => ({ ...prev, open }))}
                onConfirm={handleConfirmRemove}
                title={t('diffusionLists.removeEntryPrompt')}
                description={t('diffusionLists.removeEntryDescription')}
                confirmLabel={t('common.remove')}
                variant="destructive"
                countdown={0}
                isLoading={removeMutation.isPending}
            />

            <Dialog open={previewEntry !== null} onOpenChange={(open) => !open && setPreviewEntry(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{previewEntry?.name || t('common.preview')}</DialogTitle>
                    </DialogHeader>
                    {previewEntry && (
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                            <span className="text-muted-foreground font-medium">{t('field.name')}</span>
                            <span>{previewEntry.name || '-'}</span>

                            <span className="text-muted-foreground font-medium">{t('field.email')}</span>
                            <span>{previewEntry.email || '-'}</span>

                            <span className="text-muted-foreground font-medium">{t('field.phone')}</span>
                            <span>{previewEntry.phone || '-'}</span>

                            <span className="text-muted-foreground font-medium">{t('field.address')}</span>
                            <span className="whitespace-pre-wrap">{previewEntry.address || '-'}</span>

                            {previewEntry.features &&
                                (() => {
                                    const included = Object.entries(previewEntry.features).filter(
                                        ([, feat]) => feat.hasQuota
                                    );
                                    if (included.length === 0) return null;
                                    return (
                                        <>
                                            <span className="text-muted-foreground font-medium">
                                                {t('diffusionLists.features')}
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {included.map(([key, feat]) => {
                                                    const tKey = `diffusionLists.featureKey.${key}`;
                                                    const label = isKeyExist(tKey) ? t(tKey) : key;
                                                    return (
                                                        <Badge key={key} variant="default">
                                                            {label} {feat.issueNumber ? `#${feat.issueNumber}` : ''}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    );
                                })()}

                            {previewEntry.isManual && (
                                <>
                                    <span className="text-muted-foreground font-medium">
                                        {t('diffusionLists.freeEntry')}
                                    </span>
                                    <Badge variant="outline" className="w-fit">
                                        {t('diffusionLists.freeEntry')}
                                    </Badge>
                                </>
                            )}

                            {previewEntry.needsAttention && (
                                <>
                                    <span className="text-muted-foreground font-medium">
                                        {t('diffusionLists.needsAttention')}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="destructive" className="w-fit gap-1">
                                            <IconAlertTriangle className="h-3 w-3" />
                                            {t('diffusionLists.needsAttention')}
                                        </Badge>
                                        {previewEntry.attentionReason && (
                                            <span className="text-muted-foreground text-xs">
                                                {previewEntry.attentionReason}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
