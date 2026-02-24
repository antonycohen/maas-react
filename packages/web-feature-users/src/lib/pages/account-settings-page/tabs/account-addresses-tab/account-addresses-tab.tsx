import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit } from '@tabler/icons-react';
import { toast } from 'sonner';
import * as z from 'zod';
import { useGetMyCustomer, useUpdateMyCustomer, ApiError } from '@maas/core-api';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    FieldGroup,
    Skeleton,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useTranslation } from '@maas/core-translations';

const billingAddressSchema = z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().nullable().optional(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
});

const deliveryAddressSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    line1: z.string(),
    line2: z.string().nullable().optional(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
});

const addressFormSchema = z.object({
    billingAddress: billingAddressSchema.optional(),
    shippingAddress: deliveryAddressSchema.optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

type DeliveryAddressJson = {
    firstName?: string;
    lastName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
};

const parseDeliveryAddress = (metadata: Record<string, unknown> | null) => {
    const empty = { firstName: '', lastName: '', line1: '', line2: '', city: '', postalCode: '', country: '' };
    if (!metadata?.deliveryAddress) return empty;
    const addr = metadata.deliveryAddress as DeliveryAddressJson;
    return {
        firstName: addr.firstName ?? '',
        lastName: addr.lastName ?? '',
        line1: String(addr.line1 ?? ''),
        line2: String(addr.line2 ?? ''),
        city: addr.city ?? '',
        postalCode: String(addr.postalCode ?? ''),
        country: addr.country ?? '',
    };
};

const hasData = (obj: Record<string, unknown> | undefined): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((v) => typeof v === 'string' && v.trim() !== '');
};

const toBillingAddress = (address: AddressFormValues['billingAddress']) => {
    if (!address || !hasData(address)) return undefined;
    return {
        name: address.name ?? '',
        line1: String(address.line1 ?? ''),
        line2: address.line2 ? String(address.line2) : undefined,
        city: address.city ?? '',
        postalCode: String(address.postalCode ?? ''),
        country: address.country ?? '',
    };
};

const toShippingAddress = (address: AddressFormValues['shippingAddress']) => {
    if (!address || !hasData(address)) return undefined;
    return {
        firstName: address.firstName ?? '',
        lastName: address.lastName ?? '',
        line1: String(address.line1 ?? ''),
        line2: address.line2 ? String(address.line2) : undefined,
        city: address.city ?? '',
        postalCode: String(address.postalCode ?? ''),
        country: address.country ?? '',
    };
};

export const AccountAddressesTab = () => {
    const { t } = useTranslation();
    const [isBillingEditable, setIsBillingEditable] = useState(false);
    const [isDeliveryEditable, setIsDeliveryEditable] = useState(false);

    const { data: customer, isLoading } = useGetMyCustomer({
        name: null,
        addressLine1: null,
        addressLine2: null,
        addressCity: null,
        addressPostalCode: null,
        addressCountry: null,
        metadata: null,
    });

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            billingAddress: { name: '', line1: '', line2: '', city: '', postalCode: '', country: '' },
            shippingAddress: {
                firstName: '',
                lastName: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                country: '',
            },
        },
        values: customer
            ? {
                  billingAddress: {
                      name: customer.name ?? '',
                      line1: String(customer.addressLine1 ?? ''),
                      line2: String(customer.addressLine2 ?? ''),
                      city: customer.addressCity ?? '',
                      postalCode: String(customer.addressPostalCode ?? ''),
                      country: customer.addressCountry ?? '',
                  },
                  shippingAddress: parseDeliveryAddress(customer.metadata),
              }
            : undefined,
    });

    const updateMutation = useUpdateMyCustomer({
        onSuccess: () => {
            toast.success(t('customers.saveSuccess'));
            setIsBillingEditable(false);
            setIsDeliveryEditable(false);
        },
        onError: (error: ApiError) => {
            if (error.parametersErrors) {
                Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof AddressFormValues, {
                        type: 'server',
                        message: messages.join(', '),
                    });
                });
            }
            toast.error(t('common.errorLoading'));
        },
    });

    const onSubmit = (data: AddressFormValues) => {
        updateMutation.mutate({
            billingAddress: toBillingAddress(data.billingAddress),
            shippingAddress: toShippingAddress(data.shippingAddress),
        });
    };

    const { ControlledTextInput, ControlledCountryInput } = createConnectedInputHelpers<AddressFormValues>();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-100 w-full rounded-2xl" />
                <Skeleton className="h-100 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                        <FieldGroup className="divide-y">
                            <ControlledTextInput
                                name="billingAddress.name"
                                label={t('field.name')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.line1"
                                label={t('customers.info.addressLine1')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.line2"
                                label={t('customers.info.addressLine2')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.city"
                                label={t('customers.info.city')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledTextInput
                                name="billingAddress.postalCode"
                                label={t('customers.info.postalCode')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isBillingEditable}
                            />
                            <ControlledCountryInput
                                name="billingAddress.country"
                                label={t('customers.info.country')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                disabled={!isBillingEditable}
                            />
                        </FieldGroup>
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
                        <FieldGroup className="divide-y">
                            <ControlledTextInput
                                name="shippingAddress.firstName"
                                label={t('customers.info.firstName')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.lastName"
                                label={t('customers.info.lastName')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line1"
                                label={t('customers.info.addressLine1')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.line2"
                                label={t('customers.info.addressLine2')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.city"
                                label={t('customers.info.city')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledTextInput
                                name="shippingAddress.postalCode"
                                label={t('customers.info.postalCode')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                readOnly={!isDeliveryEditable}
                            />
                            <ControlledCountryInput
                                name="shippingAddress.country"
                                label={t('customers.info.country')}
                                direction="responsive"
                                className="py-3 md:py-6"
                                disabled={!isDeliveryEditable}
                            />
                        </FieldGroup>
                    </CardContent>
                </Card>

                {(isBillingEditable || isDeliveryEditable) && (
                    <div className="flex justify-end">
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
};
