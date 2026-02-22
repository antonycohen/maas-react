// eslint-disable-next-line @nx/enforce-module-boundaries
import { PricingRoutes } from '@maas/web-feature-pricing';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Tarifs',
        description: "Découvrez nos offres d'abonnement à Tangente Magazine.",
    });
}

export default function Pricing() {
    return <PricingRoutes />;
}
