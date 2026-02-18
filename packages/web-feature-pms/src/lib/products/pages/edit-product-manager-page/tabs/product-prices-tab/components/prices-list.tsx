import { Price } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { Button, Badge } from '@maas/web-components';
import { IconTrash, IconCoin } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

interface PricesListProps {
    prices: Price[];
    selectedPriceId: string | null;
    onSelectPrice: (id: string | null) => void;
    onRemovePrice: (id: string) => void;
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

export const PricesList = ({ prices, selectedPriceId, onSelectPrice, onRemovePrice, isLoading }: PricesListProps) => {
    const { t } = useTranslation();

    const formatInterval = (price: Price): string => {
        if (!price.recurringInterval) return t('prices.oneTime');
        const interval = price.recurringInterval;
        const count = price.recurringIntervalCount ?? 1;
        if (count === 1) {
            return t('prices.perInterval', { interval });
        }
        return t('prices.everyInterval', { count, interval });
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <span className="text-muted-foreground">{t('products.loadingPrices')}</span>
            </div>
        );
    }

    if (prices.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconCoin className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">{t('products.noPrices')}</p>
                <p className="text-muted-foreground mt-1 text-sm">{t('products.noPricesHint')}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
                {prices.map((price) => (
                    <li
                        key={price.id}
                        className={cn(
                            'hover:bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3 transition-colors',
                            selectedPriceId === price.id && 'bg-muted'
                        )}
                        onClick={() => onSelectPrice(price.id)}
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                <IconCoin className="text-muted-foreground h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                                    {formatPrice(price)} {formatInterval(price)}
                                </p>
                                <p className="text-muted-foreground truncate text-sm">{price.lookupKey || price.id}</p>
                            </div>
                            <Badge variant={price.active ? 'default' : 'secondary'}>
                                {price.active ? t('status.active') : t('status.inactive')}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemovePrice(price.id);
                            }}
                        >
                            <IconTrash className="h-4 w-4" />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
