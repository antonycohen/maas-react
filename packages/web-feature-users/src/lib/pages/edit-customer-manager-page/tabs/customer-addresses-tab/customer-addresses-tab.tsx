import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { IconEdit } from '@tabler/icons-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues } from '../../hooks';
import { useTranslation } from '@maas/core-translations';

export const CustomerAddressesTab = () => {
    const { isLoading } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();
    const [isBillingEditable, setIsBillingEditable] = useState(false);
    const [isDeliveryEditable, setIsDeliveryEditable] = useState(false);

    const { ControlledTextInput, ControlledCountryInput } = createConnectedInputHelpers<CustomerFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <LayoutContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Billing Address */}
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1.5">
                                <CardTitle className="text-xl">{t('customers.info.billingAddress')}</CardTitle>
                                <CardDescription>{t('customers.info.billingAddressDescription')}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setIsBillingEditable((prev) => !prev)}
                            >
                                <IconEdit className="size-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="flex flex-col divide-y">
                            <ControlledTextInput
                                name="billingAddress.name"
                                label={t('field.name')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.line1"
                                label={t('customers.info.addressLine1')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.line2"
                                label={t('customers.info.addressLine2')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.city"
                                label={t('customers.info.city')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.postalCode"
                                label={t('customers.info.postalCode')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledCountryInput
                                name="billingAddress.country"
                                label={t('customers.info.country')}
                                direction="horizontal"
                                className="py-6"
                                disabled={!isBillingEditable}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1.5">
                                <CardTitle className="text-xl">{t('customers.info.deliveryAddress')}</CardTitle>
                                <CardDescription>{t('customers.info.deliveryAddressDescription')}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setIsDeliveryEditable((prev) => !prev)}
                            >
                                <IconEdit className="size-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="flex flex-col divide-y">
                            <ControlledTextInput
                                name="shippingAddress.firstName"
                                label={t('customers.info.firstName')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.lastName"
                                label={t('customers.info.lastName')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line1"
                                label={t('customers.info.addressLine1')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line2"
                                label={t('customers.info.addressLine2')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.city"
                                label={t('customers.info.city')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.postalCode"
                                label={t('customers.info.postalCode')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledCountryInput
                                name="shippingAddress.country"
                                label={t('customers.info.country')}
                                direction="horizontal"
                                className="py-6"
                                disabled={!isDeliveryEditable}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutContent>
    );
};
