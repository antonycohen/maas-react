import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues } from '../../hooks';
import { useTranslation } from '@maas/core-translations';

export const CustomerInfoTab = () => {
    const { isLoading } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledCountryInput } =
        createConnectedInputHelpers<CustomerFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <LayoutContent>
            <div className="flex flex-col gap-6">
                {/* Customer Information */}
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('customers.info.title')}</CardTitle>
                        <CardDescription>{t('customers.info.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="flex flex-col divide-y">
                            <ControlledTextInput
                                name="name"
                                label={t('field.name')}
                                direction="horizontal"
                                className="py-6"
                            />
                            <ControlledTextInput
                                name="email"
                                label={t('field.email')}
                                direction="horizontal"
                                className="py-6"
                                readOnly
                            />
                            <ControlledTextInput
                                name="phone"
                                label={t('field.phone')}
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
                                name="currency"
                                label={t('customers.info.currency')}
                                direction="horizontal"
                                className="py-6"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing & Delivery Addresses */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Billing Address */}
                    <Card className="gap-0 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">{t('customers.info.billingAddress')}</CardTitle>
                            <CardDescription>{t('customers.info.billingAddressDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <div className="flex flex-col divide-y">
                                <ControlledTextInput
                                    name="billingAddress.name"
                                    label={t('field.name')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.line1"
                                    label={t('customers.info.addressLine1')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.line2"
                                    label={t('customers.info.addressLine2')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.city"
                                    label={t('customers.info.city')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.postalCode"
                                    label={t('customers.info.postalCode')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledCountryInput
                                    name="billingAddress.country"
                                    label={t('customers.info.country')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Address */}
                    <Card className="gap-0 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">{t('customers.info.deliveryAddress')}</CardTitle>
                            <CardDescription>{t('customers.info.deliveryAddressDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <div className="flex flex-col divide-y">
                                <ControlledTextInput
                                    name="shippingAddress.firstName"
                                    label={t('customers.info.firstName')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.lastName"
                                    label={t('customers.info.lastName')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.line1"
                                    label={t('customers.info.addressLine1')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.line2"
                                    label={t('customers.info.addressLine2')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.city"
                                    label={t('customers.info.city')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.postalCode"
                                    label={t('customers.info.postalCode')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledCountryInput
                                    name="shippingAddress.country"
                                    label={t('customers.info.country')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </LayoutContent>
    );
};
