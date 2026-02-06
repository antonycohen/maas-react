import { useOutletContext } from 'react-router-dom';
import { ProductFormValues } from '../../hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditProductOutletContext } from '../../edit-product-manager-page';

export const ProductInfoTab = () => {
    const { isCreateMode, isLoading } = useOutletContext<EditProductOutletContext>();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledSwitchInput } =
        createConnectedInputHelpers<ProductFormValues>();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{isCreateMode ? 'Create Product' : 'Product Information'}</CardTitle>
                    <CardDescription>
                        {isCreateMode
                            ? 'Fill in the details to create a new product.'
                            : 'Update the product details below.'}
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
                            name="lookupKey"
                            label="Lookup Key"
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="unitLabel"
                            label="Unit Label"
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
