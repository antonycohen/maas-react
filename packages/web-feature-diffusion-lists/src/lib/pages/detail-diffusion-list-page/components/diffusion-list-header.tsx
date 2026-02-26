import { DiffusionList } from '@maas/core-api-models';
import { Button } from '@maas/web-components';
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
    onConfirm?: () => void;
    onRevertToDraft?: () => void;
    onGenerate?: () => void;
    onDelete?: () => void;
    onDownloadPdf?: () => void;
    onRefreshEntries?: () => void;
    isActionPending: boolean;
}

export const DiffusionListHeader = ({
    diffusionList,
    onPopulate,
    onConfirm,
    onRevertToDraft,
    onGenerate,
    onDelete,
    onDownloadPdf,
    onRefreshEntries,
    isActionPending,
}: Props) => {
    const { t } = useTranslation();

    return (
        <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
            <div className="flex items-center gap-3">
                <h1 className="max-w-md truncate text-xl font-semibold">
                    {diffusionList.name ?? t('diffusionLists.untitled')}
                </h1>
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

                {onRefreshEntries && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefreshEntries}
                        disabled={isActionPending}
                    >
                        <IconRefresh className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.refreshEntries')}
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

                {onDownloadPdf && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={onDownloadPdf}
                        disabled={isActionPending}
                    >
                        <IconDownload className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.downloadPdf')}
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
