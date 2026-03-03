import { PricingRoutes } from '@maas/web-feature-pricing';
import { buildPageMeta } from '@maas/core-seo';
import { RouteErrorFallback } from '../components/route-error-fallback';

export function meta() {
    return buildPageMeta({
        title: 'Tarifs',
        description: "Découvrez nos offres d'abonnement à Tangente Magazine.",
    });
}

export function ErrorBoundary() {
    return <RouteErrorFallback />;
}

export default function Pricing() {
    return <PricingRoutes />;
}
