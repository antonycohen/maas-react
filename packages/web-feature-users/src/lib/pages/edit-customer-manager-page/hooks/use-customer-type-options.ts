import { useMemo } from 'react';
import { useTranslation } from '@maas/core-translations';

export const useCustomerTypeOptions = () => {
    const { t } = useTranslation();

    return useMemo(
        () => [
            { value: 'individual', label: t('customers.customerType.individual') },
            { value: 'establishment', label: t('customers.customerType.establishment') },
        ],
        [t]
    );
};
