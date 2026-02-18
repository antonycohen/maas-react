import { Badge } from '@maas/web-components';
import { DiffusionListStatus } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';

export const statusVariantMap: Record<DiffusionListStatus, 'default' | 'secondary' | 'outline'> = {
    draft: 'secondary',
    populating: 'outline',
    confirmed: 'outline',
    generating: 'outline',
    generated: 'default',
};

interface Props {
    status: DiffusionListStatus;
}

export const DiffusionListStatusBadge = ({ status }: Props) => {
    const { t } = useTranslation();
    return <Badge variant={statusVariantMap[status]}>{t(`diffusionLists.status.${status}`)}</Badge>;
};
