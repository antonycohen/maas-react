import { ApiError, useCreatePlan, useDeletePlan, useUpdatePlan } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreatePlan, UpdatePlan } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '@maas/core-workspace';
import { toast } from 'sonner';
import { PlanFormValues } from './use-edit-plan-form';
import { useTranslation } from '@maas/core-translations';

export const useEditPlanActions = (form: UseFormReturn<PlanFormValues>, isCreateMode: boolean, planId: string) => {
    const { t } = useTranslation();
    const routes = useRoutes();
    const navigate = useNavigate();

    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CreatePlan | keyof UpdatePlan, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const createMutation = useCreatePlan({
        onSuccess: (data) => {
            navigate(routes.pmsPlanInfo(data.id));
            toast.success(t('plans.createdSuccess'));
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdatePlan({
        onSuccess: () => {
            toast.success(t('plans.updatedSuccess'));
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeletePlan({
        onSuccess: () => {
            navigate(routes.pmsPlans());
            toast.success(t('plans.deletedSuccess'));
        },
        onError: () => {
            toast.error(t('plans.deleteFailed'));
        },
    });

    function onSubmit(data: PlanFormValues) {
        if (isCreateMode) {
            createMutation.mutate(data as CreatePlan);
        } else {
            updateMutation.mutate({
                planId,
                data: data as UpdatePlan,
            });
        }
    }

    function handleDelete() {
        if (window.confirm(t('plans.deleteConfirm'))) {
            deleteMutation.mutate(planId);
        }
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return {
        onSubmit,
        handleDelete,
        isSaving,
        deleteMutation,
    };
};
