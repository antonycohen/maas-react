import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@maas/web-components';
import { IconArrowRight } from '@tabler/icons-react';
import type { Subscription } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { Link } from 'react-router-dom';

type Props = {
    subscription: Subscription | undefined;
};

export const PlanChangeSection = ({ subscription }: Props) => {
    const { t } = useTranslation();

    if (!subscription) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{t('planChange.title')}</CardTitle>
                    <CardDescription>{t('planChange.noSubscription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link to="/pricing">{t('planChange.discoverOffers')}</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">{t('planChange.title')}</CardTitle>
                <CardDescription>{t('planChange.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="gap-2">
                    <Link to="upgrade">
                        {t('planChange.title')}
                        <IconArrowRight size={16} />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};
