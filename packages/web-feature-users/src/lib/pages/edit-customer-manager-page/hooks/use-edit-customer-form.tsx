import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReadCustomer } from '@maas/core-api-models';
import * as z from 'zod';

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

export const customerTypeEnum = z.enum([
    'individual',
    'establishment',
    'professor',
    'student',
    'researcher',
    'library',
]);

export type CustomerType = z.infer<typeof customerTypeEnum>;

export const customerFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email format'),
    phone: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    currency: z.string().nullable().optional(),
    customerType: customerTypeEnum.nullable().optional(),
    billingAddress: billingAddressSchema.optional(),
    shippingAddress: deliveryAddressSchema.optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

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

const parseCustomerType = (metadata: Record<string, unknown> | null): CustomerType | null => {
    if (!metadata?.customerType) return null;
    const result = customerTypeEnum.safeParse(metadata.customerType);
    return result.success ? result.data : null;
};

type UseEditCustomerFormParams = {
    customer: ReadCustomer | undefined;
};

export const useEditCustomerForm = ({ customer }: UseEditCustomerFormParams) => {
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            description: '',
            currency: '',
            customerType: null,
            billingAddress: {
                name: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                country: '',
            },
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
                  name: customer.name ?? '',
                  email: customer.email ?? '',
                  phone: customer.phone ?? '',
                  description: customer.description ?? '',
                  currency: customer.currency ?? '',
                  customerType: parseCustomerType(customer.metadata),
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

    return { form };
};
