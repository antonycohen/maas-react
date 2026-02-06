import { ApiError, useCreatePlan, useDeletePlan, useUpdatePlan } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { CreatePlan, UpdatePlan } from '@maas/core-api-models';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { toast } from 'sonner';
import { PlanFormValues } from './use-edit-plan-form';

export const useEditPlanActions = (form: UseFormReturn<PlanFormValues>, isCreateMode: boolean, planId: string) => {
    const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
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
            navigate(`${workspaceBaseUrl}/pms/plans/${data.id}/info`);
            toast.success('Plan created successfully');
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdatePlan({
        onSuccess: () => {
            toast.success('Plan updated successfully');
        },
        onError: handleApiError,
    });

    const deleteMutation = useDeletePlan({
        onSuccess: () => {
            navigate(`${workspaceBaseUrl}/pms/plans`);
            toast.success('Plan deleted successfully');
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
        if (window.confirm('Are you sure you want to delete this plan?')) {
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
