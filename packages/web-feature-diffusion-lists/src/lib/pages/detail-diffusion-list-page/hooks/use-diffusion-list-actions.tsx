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

export const useDiffusionListActions = (diffusionListId: string, refetch: () => void) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routes = useRoutes();

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
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const revertMutation = useRevertDiffusionList({
        onSuccess: () => {
            toast.success(t('diffusionLists.revertedSuccess'));
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const generateMutation = useGenerateDiffusionList({
        onSuccess: () => {
            toast.success(t('diffusionLists.generatedSuccess'));
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useDeleteDiffusionList({
        onSuccess: () => {
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
        if (window.confirm(t('diffusionLists.confirmPrompt'))) {
            confirmMutation.mutate(diffusionListId);
        }
    };

    const handleRevert = () => {
        if (window.confirm(t('diffusionLists.revertPrompt'))) {
            revertMutation.mutate(diffusionListId);
        }
    };

    const handleGenerate = () => {
        if (window.confirm(t('diffusionLists.generatePrompt'))) {
            generateMutation.mutate(diffusionListId);
        }
    };

    const handleDelete = () => {
        if (window.confirm(t('diffusionLists.deletePrompt'))) {
            deleteMutation.mutate(diffusionListId);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            const { url } = await maasApi.diffusionLists.downloadDiffusionList(diffusionListId);
            window.open(url, '_blank');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('common.errorLoading'));
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
    };
};
