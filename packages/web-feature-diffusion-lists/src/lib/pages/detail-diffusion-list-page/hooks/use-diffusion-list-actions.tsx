import {
    usePopulateDiffusionList,
    useConfirmDiffusionList,
    useRevertDiffusionList,
    useGenerateDiffusionList,
    useDeleteDiffusionList,
    maasApi,
} from '@maas/core-api';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { useState } from 'react';

export type DiffusionListActionType = 'confirm' | 'revert' | 'generate' | 'delete';

export interface DiffusionListConfirmState {
    open: boolean;
    action?: DiffusionListActionType;
}

export const useDiffusionListActions = (diffusionListId: string, refetch: () => void) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routes = useRoutes();

    const [confirmAction, setConfirmAction] = useState<DiffusionListConfirmState>({ open: false });

    const populateMutation = usePopulateDiffusionList({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const confirmMutation = useConfirmDiffusionList({
        onSuccess: () => {
            toast.success(t('diffusionLists.confirmedSuccess'));
            setConfirmAction({ open: false });
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const revertMutation = useRevertDiffusionList({
        onSuccess: () => {
            toast.success(t('diffusionLists.revertedSuccess'));
            setConfirmAction({ open: false });
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const generateMutation = useGenerateDiffusionList({
        onSuccess: () => {
            toast.success(t('diffusionLists.generatedSuccess'));
            setConfirmAction({ open: false });
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useDeleteDiffusionList({
        onSuccess: () => {
            setConfirmAction({ open: false });
            navigate(routes.diffusionLists());
            toast.success(t('diffusionLists.deletedSuccess'));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handlePopulate = () => {
        populateMutation.mutate(diffusionListId);
    };

    const handleConfirm = () => {
        setConfirmAction({ open: true, action: 'confirm' });
    };

    const handleRevert = () => {
        setConfirmAction({ open: true, action: 'revert' });
    };

    const handleGenerate = () => {
        setConfirmAction({ open: true, action: 'generate' });
    };

    const handleDelete = () => {
        setConfirmAction({ open: true, action: 'delete' });
    };

    const handleDownloadPdf = async () => {
        try {
            const blob = await maasApi.diffusionLists.downloadDiffusionList(diffusionListId);
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('common.errorLoading'));
        }
    };

    const executeConfirmAction = () => {
        switch (confirmAction.action) {
            case 'confirm':
                confirmMutation.mutate(diffusionListId);
                break;
            case 'revert':
                revertMutation.mutate(diffusionListId);
                break;
            case 'generate':
                generateMutation.mutate(diffusionListId);
                break;
            case 'delete':
                deleteMutation.mutate(diffusionListId);
                break;
        }
    };

    const getConfirmActionProps = () => {
        switch (confirmAction.action) {
            case 'confirm':
                return {
                    title: t('diffusionLists.confirmPrompt'),
                    description: t('diffusionLists.confirmDescription'),
                    confirmLabel: t('diffusionLists.confirm'),
                    variant: 'default' as const,
                    countdown: 0,
                    isLoading: confirmMutation.isPending,
                };
            case 'revert':
                return {
                    title: t('diffusionLists.revertPrompt'),
                    description: t('diffusionLists.revertDescription'),
                    confirmLabel: t('diffusionLists.revert'),
                    variant: 'default' as const,
                    countdown: 0,
                    isLoading: revertMutation.isPending,
                };
            case 'generate':
                return {
                    title: t('diffusionLists.generatePrompt'),
                    description: t('diffusionLists.generateDescription'),
                    confirmLabel: t('diffusionLists.generate'),
                    variant: 'default' as const,
                    countdown: 0,
                    isLoading: generateMutation.isPending,
                };
            case 'delete':
                return {
                    title: t('diffusionLists.deletePrompt'),
                    description: t('diffusionLists.deleteDescription'),
                    confirmLabel: t('common.delete'),
                    variant: 'destructive' as const,
                    countdown: 5,
                    isLoading: deleteMutation.isPending,
                };
            default:
                return {
                    title: '',
                    description: '',
                    confirmLabel: '',
                    variant: 'default' as const,
                    countdown: 0,
                    isLoading: false,
                };
        }
    };

    const isActionPending =
        populateMutation.isPending ||
        confirmMutation.isPending ||
        revertMutation.isPending ||
        generateMutation.isPending ||
        deleteMutation.isPending;

    return {
        handlePopulate,
        handleConfirm,
        handleRevert,
        handleGenerate,
        handleDelete,
        handleDownloadPdf,
        isActionPending,
        confirmAction,
        setConfirmAction,
        executeConfirmAction,
        getConfirmActionProps,
    };
};
