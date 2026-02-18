import { Price } from '@maas/core-api-models';
import { Badge } from '@maas/web-components';
import { IconCoin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

interface PricePreviewProps {
    price: Price | null;
    isLoading: boolean;
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
    const key = `${locale}-${currency}`;
    const cached = numberFormatCache.get(key);
    if (cached) return cached;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    numberFormatCache.set(key, formatter);
    return formatter;
};

const formatPrice = (price: Price): string => {
    const amount = price.unitAmountInCents ?? 0;
    const currency = price.currency?.toUpperCase() ?? 'USD';
    return getCurrencyFormatter('en-US', currency).format(amount / 100);
};

export const PricePreview = ({ price, isLoading }: PricePreviewProps) => {
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">{t('common.loading')}</span>
            </div>
        );
    }

    if (!price) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconCoin className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">{t('products.selectPriceToView')}</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{formatPrice(price)}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {price.lookupKey || t('products.noLookupKey')}
                        </p>
                    </div>
                    <Badge variant={price.active ? 'default' : 'secondary'}>
                        {price.active ? t('status.active') : t('status.inactive')}
                    </Badge>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{t('prices.currency')}</p>
                            <p className="text-sm">{price.currency?.toUpperCase() || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{t('prices.billingInterval')}</p>
                            <p className="text-sm">
                                {price.recurringInterval
                                    ? `${price.recurringIntervalCount ?? 1} ${price.recurringInterval}`
                                    : t('prices.oneTime')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{t('prices.billingInterval')}</p>
                            <p className="text-sm">
                                {price.recurringInterval
                                    ? `${price.recurringIntervalCount ?? 1} ${price.recurringInterval}`
                                    : t('prices.oneTime')}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{t('prices.usageType')}</p>
                            <p className="text-sm">{price.recurringUsageType || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                    <Link
                        to={`${workspaceUrl}/pms/prices/${price.id}`}
                        className="text-primary text-sm hover:underline"
                    >
                        {`${t('products.viewFullPriceDetails')} \u2192`}
                    </Link>
                </div>
            </div>
        </div>
    );
};
