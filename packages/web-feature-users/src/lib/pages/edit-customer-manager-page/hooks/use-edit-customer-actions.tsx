import { ApiError, useUpdateCustomer } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { CustomerFormValues } from './use-edit-customer-form';

const hasData = (obj: Record<string, unknown> | undefined): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((v) => typeof v === 'string' && v.trim() !== '');
};

const toBillingAddress = (address: CustomerFormValues['billingAddress']) => {
    if (!address || !hasData(address)) return undefined;
    return {
        name: address.name ?? '',
        line1: address.line1 ?? '',
        line2: address.line2 ?? undefined,
        city: address.city ?? '',
        postalCode: address.postalCode ?? '',
        country: address.country ?? '',
    };
};

const toShippingAddress = (address: CustomerFormValues['shippingAddress']) => {
    if (!address || !hasData(address)) return undefined;
    return {
        firstName: address.firstName ?? '',
        lastName: address.lastName ?? '',
        line1: address.line1 ?? '',
        line2: address.line2 ?? undefined,
        city: address.city ?? '',
        postalCode: address.postalCode ?? '',
        country: address.country ?? '',
    };
};

export const useEditCustomerActions = (form: UseFormReturn<CustomerFormValues>, customerId: string) => {
    const handleApiError = (error: ApiError) => {
        if (error.parametersErrors) {
            Object.entries(error.parametersErrors).forEach(([field, messages]) => {
                form.setError(field as keyof CustomerFormValues, {
                    type: 'server',
                    message: messages.join(', '),
                });
            });
        }
    };

    const updateMutation = useUpdateCustomer({
        onSuccess: () => {
            toast.success('Customer updated successfully');
        },
        onError: handleApiError,
    });

    function onSubmit(data: CustomerFormValues) {
        updateMutation.mutate({
            customerId,
            data: {
                name: data.name,
                email: data.email,
                ...(data.phone ? { phone: data.phone } : {}),
                ...(data.description ? { description: data.description } : {}),
                ...(data.currency ? { currency: data.currency } : {}),
                billingAddress: toBillingAddress(data.billingAddress),
                shippingAddress: toShippingAddress(data.shippingAddress),
            },
        });
    }

    const isSaving = updateMutation.isPending;

    return {
        onSubmit,
        isSaving,
    };
};
