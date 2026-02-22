import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useNavigate, useParams } from 'react-router';
import { useDeletePrice, useGetPriceById, useUpdatePrice } from '@maas/core-api';
import { useRoutes } from '@maas/core-workspace';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UpdatePrice } from '@maas/core-api-models';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
    const key = `${locale}-${currency}`;
    const cached = numberFormatCache.get(key);
    if (cached) return cached;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    numberFormatCache.set(key, formatter);
    return formatter;
};

const formatPrice = (amount: number, currency: string): string => {
    return getCurrencyFormatter('en-US', currency.toUpperCase()).format(amount / 100);
};

export function EditPriceManagerPage() {
    const { priceId = '' } = useParams<{ priceId: string }>();
    const isCreateMode = priceId === 'new';
    const routes = useRoutes();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: price, isLoading } = useGetPriceById(
        {
            id: priceId,
            fields: {
                id: null,
                currency: null,
                unitAmountInCents: null,
                active: null,
                lookupKey: null,
                recurringInterval: null,
                recurringIntervalCount: null,
                recurringUsageType: null,
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    const form = useForm<UpdatePrice>({
        defaultValues: {
            active: true,
            lookupKey: '',
        },
    });

    useEffect(() => {
        if (price) {
            form.reset({
                active: price.active ?? true,
                lookupKey: price.lookupKey ?? '',
            });
        }
    }, [price, form.reset]);

    const updateMutation = useUpdatePrice({
        onSuccess: () => {
            toast.success(t('prices.updatedSuccess'));
        },
        onError: () => {
            toast.error(t('prices.updateFailed'));
        },
    });

    const deleteMutation = useDeletePrice({
        onSuccess: () => {
            navigate(routes.pmsPrices());
            toast.success(t('prices.deletedSuccess'));
        },
        onError: () => {
            toast.error(t('prices.deleteFailed'));
        },
    });

    const onSubmit = (data: UpdatePrice) => {
        updateMutation.mutate({
            priceId,
            data,
        });
    };

    const handleDelete = () => {
        if (window.confirm(t('prices.deleteConfirm'))) {
            deleteMutation.mutate(priceId);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!price) {
        return <div className="flex h-screen items-center justify-center">{t('prices.notFound')}</div>;
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: t('common.home'), to: routes.root() },
                        { label: t('prices.title'), to: routes.pmsPrices() },
                        { label: formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd') },
                    ]}
                />
            </header>

            {/* Sticky Action Bar */}
            <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold">
                        {formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd')}
                    </h1>
                    <Badge variant={price.active ? 'default' : 'secondary'}>
                        {price.active ? t('status.active') : t('status.inactive')}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <IconTrash className="mr-1.5 h-4 w-4" />
                        {t('common.delete')}
                    </Button>
                    <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <>
                                <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                {t('common.saving')}
                            </>
                        ) : (
                            <>
                                <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                {t('common.save')}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <LayoutContent>
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('prices.priceDetails')}</CardTitle>
                        <CardDescription>{t('prices.priceDetailsDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">{t('prices.amount')}</Label>
                                    <p className="text-lg font-semibold">
                                        {formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">{t('prices.currency')}</Label>
                                    <p className="text-lg">{price.currency?.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">{t('prices.billingInterval')}</Label>
                                    <p>
                                        {price.recurringInterval
                                            ? `${price.recurringIntervalCount ?? 1} ${price.recurringInterval}`
                                            : t('prices.oneTime')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">{t('prices.usageType')}</Label>
                                    <p>{price.recurringUsageType || '-'}</p>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lookupKey">{t('prices.lookupKey')}</Label>
                                        <Input
                                            id="lookupKey"
                                            placeholder={t('prices.lookupKeyPlaceholder')}
                                            {...form.register('lookupKey')}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            {...form.register('active')}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="active">{t('field.active')}</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </LayoutContent>
        </form>
    );
}
