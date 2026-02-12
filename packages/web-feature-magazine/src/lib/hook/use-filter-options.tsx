import { useTranslation } from '@maas/core-translations';

export const usePublishedStatusOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'true', label: t('status.published') },
        { value: 'false', label: t('status.draft') },
    ];
};
