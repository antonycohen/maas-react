import { ApiError, useCreateCustomer, useUpdateCustomer } from '@maas/core-api';
import { UseFormReturn } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useRoutes } from '@maas/core-workspace';
import { CustomerFormValues } from './use-edit-customer-form';
import { useTranslation } from '@maas/core-translations';

const hasData = (obj: Record<string, unknown> | undefined): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((v) => typeof v === 'string' && v.trim() !== '');
};

const toBillingAddress = (address: CustomerFormValues['billingAddress']) => {
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

const toShippingAddress = (address: CustomerFormValues['shippingAddress']) => {
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

export const useEditCustomerActions = (
    form: UseFormReturn<CustomerFormValues>,
    customerId: string,
    isCreateMode: boolean
) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const routes = useRoutes();

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

    const createMutation = useCreateCustomer({
        onSuccess: (data) => {
            toast.success(t('customers.createSuccess'));
            navigate(routes.customerInfo(data.id), { replace: true });
        },
        onError: handleApiError,
    });

    const updateMutation = useUpdateCustomer({
        onSuccess: (data) => {
            toast.success(t('customers.saveSuccess'));
            if (data.id && data.id !== customerId) {
                const currentTab = location.pathname.split('/').pop() ?? 'info';
                const newBase = routes.customerEdit(data.id);
                navigate(`${newBase}/${currentTab}`, { replace: true });
            }
        },
        onError: handleApiError,
    });

    function onSubmit(data: CustomerFormValues) {
        const payload = {
            name: data.name,
            email: data.email,
            ...(data.phone ? { phone: data.phone } : {}),
            ...(data.description ? { description: data.description } : {}),
            ...(data.currency ? { currency: data.currency } : {}),
            billingAddress: toBillingAddress(data.billingAddress),
            shippingAddress: toShippingAddress(data.shippingAddress),
        };

        if (isCreateMode) {
            createMutation.mutate(payload);
        } else {
            updateMutation.mutate({ customerId, data: payload });
        }
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return {
        onSubmit,
        isSaving,
    };
};
