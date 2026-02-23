import { useGetSubscriptions } from '@maas/core-api';
import { ReadCustomer } from '@maas/core-api-models';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator, Skeleton } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';

const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

type CustomerSummarySidebarProps = {
    customer: ReadCustomer | undefined;
    customerId: string;
};

export const CustomerSummarySidebar = ({ customer, customerId }: CustomerSummarySidebarProps) => {
    const { t } = useTranslation();

    const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useGetSubscriptions({
        filters: { customerId },
        fields: { id: null, status: null },
        offset: 0,
        limit: 1,
    });

    const subscription = subscriptionsData?.data?.[0];
    const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-base">{t('customers.summary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
                {/* Subscription Status */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.summary.subscription')}</span>
                    {isLoadingSubscriptions ? (
                        <Skeleton className="h-5 w-16 rounded-md" />
                    ) : (
                        <Badge
                            variant="outline"
                            className={
                                hasActiveSubscription
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-200 bg-gray-50 text-gray-700'
                            }
                        >
                            {hasActiveSubscription ? t('customers.summary.active') : t('customers.summary.inactive')}
                        </Badge>
                    )}
                </div>

                <Separator />

                {/* Currency */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.info.currency')}</span>
                    <span className="text-sm font-medium">{customer?.currency?.toUpperCase() ?? '\u2014'}</span>
                </div>

                {/* <Separator /> */}

                {/* Balance
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.summary.balance')}</span>
                    <span className="text-sm font-medium">
                        {formatBalance(customer?.balance, customer?.currency)}
                    </span>
                </div> */}

                <Separator />

                {/* Delinquent */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.summary.delinquent')}</span>
                    {customer?.delinquent ? (
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                            {t('common.yes')}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            {t('common.no')}
                        </Badge>
                    )}
                </div>

                <Separator />

                {/* Created At */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.summary.createdAt')}</span>
                    <span className="text-sm">{formatDate(customer?.createdAt)}</span>
                </div>

                <Separator />

                {/* Updated At */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground text-sm">{t('customers.summary.updatedAt')}</span>
                    <span className="text-sm">{formatDate(customer?.updatedAt)}</span>
                </div>
            </CardContent>
        </Card>
    );
};
