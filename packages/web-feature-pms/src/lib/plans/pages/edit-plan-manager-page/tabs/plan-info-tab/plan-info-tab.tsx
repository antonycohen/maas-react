import { useOutletContext } from 'react-router-dom';
import { PlanFormValues } from '../../hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditPlanOutletContext } from '../../edit-plan-manager-page';

export const PlanInfoTab = () => {
    const { isCreateMode, isLoading } = useOutletContext<EditPlanOutletContext>();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledSwitchInput } =
        createConnectedInputHelpers<PlanFormValues>();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{isCreateMode ? 'Create Plan' : 'Plan Information'}</CardTitle>
                    <CardDescription>
                        {isCreateMode
                            ? 'Fill in the details to create a new subscription plan.'
                            : 'Update the plan details below.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-2">
                    <div className="flex flex-col divide-y">
                        <ControlledTextInput name="name" label="Name" direction="horizontal" className="py-6" />
                        <ControlledTextAreaInput
                            name="description"
                            label="Description"
                            direction="horizontal"
                            maxLength={500}
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="portalConfigurationId"
                            label="Portal Configuration ID"
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledSwitchInput name="active" label="Active" className="py-6" />
                    </div>
                </CardContent>
            </Card>
        </LayoutContent>
    );
};
