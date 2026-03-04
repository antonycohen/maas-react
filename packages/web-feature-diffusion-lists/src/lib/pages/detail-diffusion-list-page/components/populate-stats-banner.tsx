import { DiffusionList } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { IconUsers, IconUserCheck, IconUserOff, IconClockOff, IconCopy, IconAlertTriangle } from '@tabler/icons-react';

interface Props {
    stats: NonNullable<NonNullable<DiffusionList['metadata']>['populateStats']>;
}

export const PopulateStatsBanner = ({ stats }: Props) => {
    const { t } = useTranslation();
    const totalSkipped = stats.skippedNoQuota + stats.skippedExhausted + stats.skippedDuplicate;

    return (
        <div className="bg-muted/50 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border px-4 py-3 text-sm">
            <div className="flex items-center gap-1.5">
                <IconUsers className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">{t('diffusionLists.stats.customersProcessed')}</span>
                <span className="font-medium">{stats.customersProcessed}</span>
            </div>

            <div className="flex items-center gap-1.5">
                <IconUserCheck className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">{t('diffusionLists.stats.entriesInserted')}</span>
                <span className="font-medium">{stats.entriesInserted}</span>
            </div>

            {totalSkipped > 0 && (
                <>
                    {stats.skippedNoQuota > 0 && (
                        <div className="flex items-center gap-1.5">
                            <IconUserOff className="h-4 w-4 text-amber-500" />
                            <span className="text-muted-foreground">{t('diffusionLists.stats.skippedNoQuota')}</span>
                            <span className="font-medium">{stats.skippedNoQuota}</span>
                        </div>
                    )}

                    {stats.skippedExhausted > 0 && (
                        <div className="flex items-center gap-1.5">
                            <IconClockOff className="h-4 w-4 text-amber-500" />
                            <span className="text-muted-foreground">{t('diffusionLists.stats.skippedExhausted')}</span>
                            <span className="font-medium">{stats.skippedExhausted}</span>
                        </div>
                    )}

                    {stats.skippedDuplicate > 0 && (
                        <div className="flex items-center gap-1.5">
                            <IconCopy className="h-4 w-4 text-amber-500" />
                            <span className="text-muted-foreground">{t('diffusionLists.stats.skippedDuplicate')}</span>
                            <span className="font-medium">{stats.skippedDuplicate}</span>
                        </div>
                    )}
                </>
            )}

            {stats.needsAttention > 0 && (
                <div className="flex items-center gap-1.5">
                    <IconAlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-muted-foreground">{t('diffusionLists.stats.needsAttention')}</span>
                    <span className="font-medium">{stats.needsAttention}</span>
                </div>
            )}
        </div>
    );
};
