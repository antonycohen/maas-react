import { useOutletContext } from 'react-router';
import { PlanFormValues } from '../../hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditPlanOutletContext } from '../../edit-plan-manager-page';
import { useTranslation } from '@maas/core-translations';

export const PlanInfoTab = () => {
    const { t } = useTranslation();
    const { isCreateMode, isLoading } = useOutletContext<EditPlanOutletContext>();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledSwitchInput } =
        createConnectedInputHelpers<PlanFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {isCreateMode ? t('plans.createPlan') : t('plans.planInformation')}
                    </CardTitle>
                    <CardDescription>
                        {isCreateMode ? t('plans.fillDetails') : t('plans.updateDetails')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-2">
                    <div className="flex flex-col divide-y">
                        <ControlledTextInput
                            name="name"
                            label={t('field.name')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextAreaInput
                            name="description"
                            label={t('field.description')}
                            direction="horizontal"
                            maxLength={500}
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="portalConfigurationId"
                            label={t('plans.portalConfigurationId')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledSwitchInput name="active" label={t('field.active')} className="py-6" />
                    </div>
                </CardContent>
            </Card>
        </LayoutContent>
    );
};
