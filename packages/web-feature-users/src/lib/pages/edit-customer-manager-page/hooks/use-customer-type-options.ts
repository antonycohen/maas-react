import { useMemo } from 'react';
import { useTranslation } from '@maas/core-translations';

export const useCustomerTypeOptions = () => {
    const { t } = useTranslation();

    return useMemo(
        () => [
            { value: 'individual', label: t('customers.customerType.individual') },
            { value: 'establishment', label: t('customers.customerType.establishment') },
            { value: 'professor', label: t('customers.customerType.professor') },
            { value: 'student', label: t('customers.customerType.student') },
            { value: 'researcher', label: t('customers.customerType.researcher') },
            { value: 'library', label: t('customers.customerType.library') },
        ],
        [t]
    );
};
