import { useOutletContext } from 'react-router-dom';
import { ProductFormValues } from '../../hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditProductOutletContext } from '../../edit-product-manager-page';
import { useTranslation } from '@maas/core-translations';

export const ProductInfoTab = () => {
    const { isCreateMode, isLoading } = useOutletContext<EditProductOutletContext>();
    const { t } = useTranslation();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledSwitchInput } =
        createConnectedInputHelpers<ProductFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {isCreateMode ? t('products.createProduct') : t('products.productInformation')}
                    </CardTitle>
                    <CardDescription>
                        {isCreateMode ? t('products.fillDetails') : t('products.updateDetails')}
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
                            name="lookupKey"
                            label={t('products.lookupKey')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="unitLabel"
                            label={t('products.unitLabel')}
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
