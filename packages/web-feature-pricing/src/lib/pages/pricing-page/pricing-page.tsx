import { PricingList } from '../../components/pricing-list';
import { PricingBottomSection } from '../../components/pricing-bottom-section';
import { SEO } from '@maas/core-seo';

export const PricingPage = () => {
    return (
        <div className="flex w-full flex-col">
            <SEO title="Tarifs" description="Découvrez nos offres d'abonnement" />
            <PricingList />
            <PricingBottomSection />
        </div>
    );
};
