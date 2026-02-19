import { useTranslation } from '@maas/core-translations';
import { useGetArticleTypes } from '@maas/core-api';
import { useMemo } from 'react';

export const usePublishedStatusOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'true', label: t('status.published') },
        { value: 'false', label: t('status.draft') },
    ];
};

export const useArticleTypeOptions = () => {
    const { data } = useGetArticleTypes({ fields: { id: null, name: null }, offset: 0, limit: 100 });

    return useMemo(() => data?.data?.map((type) => ({ value: type.id, label: type.name ?? type.id })) ?? [], [data]);
};
