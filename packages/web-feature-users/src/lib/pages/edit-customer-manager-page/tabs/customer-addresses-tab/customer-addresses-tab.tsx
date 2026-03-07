import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { IconEdit } from '@tabler/icons-react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    FieldGroup,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues } from '../../hooks';
import { useTranslation } from '@maas/core-translations';

/**
 * Compares shipping and billing addresses to determine if they differ.
 */
const areAddressesDifferent = (
    shipping: CustomerFormValues['shippingAddress'],
    billing: CustomerFormValues['billingAddress']
): boolean => {
    if (!shipping || !billing) return false;
    const hasShipping = Object.values(shipping).some((v) => typeof v === 'string' && v.trim() !== '');
    const hasBilling = Object.values(billing).some((v) => typeof v === 'string' && v.trim() !== '');
    if (!hasShipping && !hasBilling) return false;
    if (!hasBilling) return false;

    return (
        (shipping.line1 ?? '') !== (billing.line1 ?? '') ||
        (shipping.line2 ?? '') !== (billing.line2 ?? '') ||
        (shipping.city ?? '') !== (billing.city ?? '') ||
        (shipping.postalCode ?? '') !== (billing.postalCode ?? '') ||
        (shipping.country ?? '') !== (billing.country ?? '')
    );
};

export const CustomerAddressesTab = () => {
    const { isLoading, form } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();
    const [isEditable, setIsEditable] = useState(false);

    const shippingValues = form.watch('shippingAddress');
    const billingValues = form.watch('billingAddress');

    const [useDifferentBilling, setUseDifferentBilling] = useState<boolean | null>(null);
    if (useDifferentBilling === null && !isLoading && (shippingValues?.line1 || billingValues?.line1)) {
        setUseDifferentBilling(areAddressesDifferent(shippingValues, billingValues));
    }
    const isDifferentBilling = useDifferentBilling ?? false;

    const { ControlledTextInput, ControlledCountryInput } = createConnectedInputHelpers<CustomerFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <LayoutContent>
            <div className="flex flex-col gap-6">
                {/* Shipping / Delivery Address — Primary */}
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
                                onClick={() => setIsEditable((prev) => !prev)}
                            >
                                <IconEdit className="size-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <FieldGroup className="divide-y">
                            <ControlledTextInput
                                name="shippingAddress.firstName"
                                label={t('customers.info.firstName')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.lastName"
                                label={t('customers.info.lastName')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line1"
                                label={t('customers.info.addressLine1')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line2"
                                label={t('customers.info.addressLine2')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.city"
                                label={t('customers.info.city')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.postalCode"
                                label={t('customers.info.postalCode')}
                                direction="horizontal"
                                className="py-6"
                                readOnly={!isEditable}
                            />
                            <ControlledCountryInput
                                name="shippingAddress.country"
                                label={t('customers.info.country')}
                                direction="horizontal"
                                className="py-6"
                                disabled={!isEditable}
                            />
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Different billing address toggle */}
                <label className="flex cursor-pointer items-center gap-2 px-1">
                    <Checkbox
                        checked={isDifferentBilling}
                        onCheckedChange={(checked) => setUseDifferentBilling(checked === true)}
                        disabled={!isEditable}
                    />
                    <span className="text-foreground text-sm font-medium">
                        {t('customers.info.differentBillingAddress')}
                    </span>
                </label>

                {/* Billing Address — only if different */}
                {isDifferentBilling && (
                    <Card className="animate-in fade-in slide-in-from-top-2 gap-0 rounded-2xl duration-200">
                        <CardHeader>
                            <div className="flex flex-col gap-1.5">
                                <CardTitle className="text-xl">{t('customers.info.billingAddress')}</CardTitle>
                                <CardDescription>{t('customers.info.billingAddressDescription')}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <FieldGroup className="divide-y">
                                <ControlledTextInput
                                    name="billingAddress.name"
                                    label={t('field.name')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isEditable}
                                />
                                <ControlledTextInput
                                    name="billingAddress.line1"
                                    label={t('customers.info.addressLine1')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isEditable}
                                />
                                <ControlledTextInput
                                    name="billingAddress.line2"
                                    label={t('customers.info.addressLine2')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isEditable}
                                />
                                <ControlledTextInput
                                    name="billingAddress.city"
                                    label={t('customers.info.city')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isEditable}
                                />
                                <ControlledTextInput
                                    name="billingAddress.postalCode"
                                    label={t('customers.info.postalCode')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isEditable}
                                />
                                <ControlledCountryInput
                                    name="billingAddress.country"
                                    label={t('customers.info.country')}
                                    direction="horizontal"
                                    className="py-6"
                                    disabled={!isEditable}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                )}
            </div>
        </LayoutContent>
    );
};
