import { Link } from 'react-router';
import { CircleCheck } from 'lucide-react';
import { Button } from '@maas/web-components';
import { PUBLIC_ROUTES, usePublicRoutes } from '@maas/core-routes';
import { useRefreshSubscriptionStatus } from '@maas/core-store-session';
import { useEffect } from 'react';
import { useTranslation } from '@maas/core-translations';

export function CheckoutSuccessPage() {
    const publicRoutes = usePublicRoutes();
    const { refresh } = useRefreshSubscriptionStatus();
    const { t } = useTranslation();

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <div className="flex w-full justify-center px-5 py-16 md:min-h-[650px] md:py-24">
            <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
                <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <CircleCheck className="text-success h-10 w-10" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-foreground text-[34px] leading-10 font-semibold tracking-[-0.85px]">
                        {t('checkout.successTitle')}
                    </h1>
                    <p className="text-text-secondary text-base leading-relaxed">{t('checkout.successDescription')}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link to={PUBLIC_ROUTES.ACCOUNT_SUBSCRIPTION}>{t('checkout.goToSubscription')}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to={publicRoutes.home}>{t('checkout.backToHome')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
