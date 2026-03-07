import { DiffusionList } from '@maas/core-api-models';
import { Badge, Button } from '@maas/web-components';
import {
    IconCheck,
    IconArrowBack,
    IconFileExport,
    IconTrash,
    IconEye,
    IconDownload,
    IconLoader2,
    IconRefresh,
} from '@tabler/icons-react';
import { DiffusionListStatusBadge } from './diffusion-list-status-badge';
import { useTranslation } from '@maas/core-translations';

interface Props {
    diffusionList: DiffusionList;
    onPopulate?: () => void;
    onRepopulate?: () => void;
    onConfirm?: () => void;
    onRevertToDraft?: () => void;
    onGenerate?: () => void;
    onDelete?: () => void;
    onDownloadCsv?: () => void;
    isActionPending: boolean;
}

export const DiffusionListHeader = ({
    diffusionList,
    onPopulate,
    onRepopulate,
    onConfirm,
    onRevertToDraft,
    onGenerate,
    onDelete,
    onDownloadCsv,
    isActionPending,
}: Props) => {
    const { t, isKeyExist } = useTranslation();

    return (
        <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
            <div className="flex items-center gap-3">
                <h1 className="max-w-md truncate text-xl font-semibold">
                    {diffusionList.name ?? t('diffusionLists.untitled')}
                </h1>
                {diffusionList.features && diffusionList.features.length > 0 && (
                    <div className="flex items-center gap-1">
                        {diffusionList.features.map((f) => {
                            const key = `diffusionLists.featureKey.${f.featureKey}`;
                            const label = isKeyExist(key) ? t(key) : f.featureKey;
                            return (
                                <Badge key={f.featureKey} variant="outline">
                                    {label} #{f.issueNumber}
                                </Badge>
                            );
                        })}
                    </div>
                )}
                {diffusionList.status && <DiffusionListStatusBadge status={diffusionList.status} />}
            </div>

            <div className="flex items-center gap-2">
                {isActionPending && <IconLoader2 className="h-4 w-4 animate-spin" />}

                {onPopulate && (
                    <Button type="button" variant="outline" size="sm" onClick={onPopulate} disabled={isActionPending}>
                        <IconEye className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.populate')}
                    </Button>
                )}

                {onRepopulate && (
                    <Button type="button" variant="outline" size="sm" onClick={onRepopulate} disabled={isActionPending}>
                        <IconRefresh className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.repopulate')}
                    </Button>
                )}

                {onConfirm && (
                    <Button type="button" variant="default" size="sm" onClick={onConfirm} disabled={isActionPending}>
                        <IconCheck className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.confirm')}
                    </Button>
                )}

                {onRevertToDraft && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRevertToDraft}
                        disabled={isActionPending}
                    >
                        <IconArrowBack className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.revertToDraft')}
                    </Button>
                )}

                {onGenerate && (
                    <Button type="button" variant="default" size="sm" onClick={onGenerate} disabled={isActionPending}>
                        <IconFileExport className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.generate')}
                    </Button>
                )}

                {onDownloadCsv && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={onDownloadCsv}
                        disabled={isActionPending}
                    >
                        <IconDownload className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.downloadCsv')}
                    </Button>
                )}

                {onDelete && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        disabled={isActionPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <IconTrash className="mr-1.5 h-4 w-4" />
                        {t('common.delete')}
                    </Button>
                )}
            </div>
        </div>
    );
};
