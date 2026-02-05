import { useForm } from 'react-hook-form';
import { CreatePlan, createPlanSchema, Plan, UpdatePlan, updatePlanSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

type UseEditPlanFormParams = {
    plan: Plan | undefined;
    isCreateMode: boolean;
};

export type PlanFormValues = CreatePlan | UpdatePlan;

export const useEditPlanForm = ({ plan, isCreateMode }: UseEditPlanFormParams) => {
    const form = useForm<PlanFormValues>({
        resolver: zodResolver(isCreateMode ? createPlanSchema : updatePlanSchema),
        defaultValues: {
            name: '',
            description: '',
            active: true,
            metadata: {},
        },
        values:
            !isCreateMode && plan
                ? {
                      name: plan.name ?? '',
                      description: plan.description ?? '',
                      active: plan.active ?? true,
                      metadata: plan.metadata ?? {},
                  }
                : undefined,
    });

    return { form };
};
