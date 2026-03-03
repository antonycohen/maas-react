import { Link, useLocation } from 'react-router';
import { useSubscriptionStatus } from '@maas/core-store-session';
import { FEATURE_TANGENTE_MAG, FEATURE_HORS_SERIE, FEATURE_BIBLIOTHEQUE } from '@maas/core-api-models';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { Alert, AlertDescription, Button } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { IconMapPin } from '@tabler/icons-react';

const PAPER_MAGAZINE_FEATURES = [FEATURE_TANGENTE_MAG, FEATURE_HORS_SERIE, FEATURE_BIBLIOTHEQUE];

const ADDRESS_PAGES = [PUBLIC_ROUTES.PRICING_ADRESSE, PUBLIC_ROUTES.ACCOUNT_ADDRESSES];

export function DeliveryAddressBanner() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { isUserSubscribed, quotas, hasDeliveryAddress } = useSubscriptionStatus();

    if (!isUserSubscribed || hasDeliveryAddress) return null;

    const hasPaperQuotaWithRemaining = quotas.some(
        (q) => PAPER_MAGAZINE_FEATURES.includes(q.featureKey) && q.remaining > 0
    );

    if (!hasPaperQuotaWithRemaining) return null;

    const isOnAddressPage = ADDRESS_PAGES.some((route) => pathname.startsWith(route));

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pt-4">
            <Alert className="h-[60px] items-center border-amber-200 bg-amber-50 [&>svg]:translate-y-0">
                <IconMapPin className="h-4 w-4 text-amber-600" />
                <AlertDescription className="flex items-center justify-between gap-4">
                    <span className="text-sm text-amber-800">{t('banner.deliveryAddress.message')}</span>
                    {!isOnAddressPage && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100"
                            asChild
                        >
                            <Link to={PUBLIC_ROUTES.ACCOUNT_ADDRESSES}>{t('banner.deliveryAddress.action')}</Link>
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
        </div>
    );
}
