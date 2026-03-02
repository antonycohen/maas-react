import { Link } from 'react-router';
import { PricingList } from '../../components/pricing-list';
import { PricingBottomSection } from '../../components/pricing-bottom-section';
import { SEO } from '@maas/core-seo';
import { useSubscriptionStatus } from '@maas/core-store-session';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { Button } from '@maas/web-components';
import { CircleCheck } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';

export const PricingPage = () => {
    const { isUserSubscribed } = useSubscriptionStatus();
    const { t } = useTranslation();

    if (isUserSubscribed) {
        return (
            <div className="flex w-full justify-center px-5 py-16 md:min-h-[650px] md:py-24">
                <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
                    <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                        <CircleCheck className="text-success h-10 w-10" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="font-heading text-foreground text-[34px] leading-10 font-semibold tracking-[-0.85px]">
                            {t('pricing.alreadySubscribedTitle')}
                        </h1>
                        <p className="text-text-secondary text-base leading-relaxed">
                            {t('pricing.alreadySubscribedDescription')}
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link to={PUBLIC_ROUTES.ACCOUNT_SUBSCRIPTION}>{t('pricing.goToSubscription')}</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            <SEO title="Tarifs" description="Découvrez nos offres d'abonnement" />
            <PricingList />
            <PricingBottomSection />
        </div>
    );
};
