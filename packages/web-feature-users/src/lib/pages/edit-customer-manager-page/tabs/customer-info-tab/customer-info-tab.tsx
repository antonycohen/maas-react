import { useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues, useCurrencyOptions, useCustomerTypeOptions } from '../../hooks';
import { useTranslation } from '@maas/core-translations';
import { CustomerSummarySidebar } from './components/customer-summary-sidebar';
import { CustomerCommentsSection } from './components/customer-comments-section';

const LegacySubscriptionMetadata = ({ metadata }: { metadata: Record<string, unknown> | null | undefined }) => {
    const legacySub = metadata?.['legacySubscription'] as Record<string, unknown> | undefined;
    const legacyNumeroClient = metadata?.['legacyNumeroClient'] as number | undefined;

    const entries = useMemo(() => {
        const items: { label: string; value: string | number; highlight?: boolean }[] = [];
        if (legacyNumeroClient != null) {
            items.push({ label: 'Numéro Client', value: legacyNumeroClient });
        }
        if (legacySub) {
            if (legacySub.debTg != null) items.push({ label: 'Deb TG', value: legacySub.debTg as number });
            if (legacySub.finTg != null)
                items.push({
                    label: 'Fin TG',
                    value: legacySub.finTg as number,
                    highlight: legacySub.finTg === 999,
                });
            if (legacySub.debTh != null) items.push({ label: 'Deb TH', value: legacySub.debTh as number });
            if (legacySub.finTh != null)
                items.push({
                    label: 'Fin TH',
                    value: legacySub.finTh as number,
                    highlight: legacySub.finTh === 999,
                });
            if (legacySub.debB != null) items.push({ label: 'Deb B', value: legacySub.debB as number });
            if (legacySub.finB != null)
                items.push({
                    label: 'Fin B',
                    value: legacySub.finB as number,
                    highlight: legacySub.finB === 999,
                });
            if (legacySub.lastOrderDate != null)
                items.push({ label: 'Dernière commande', value: legacySub.lastOrderDate as string });
            if (legacySub.stripeInvoiceId != null)
                items.push({ label: 'Stripe Invoice', value: legacySub.stripeInvoiceId as string });
        }
        return items;
    }, [legacySub, legacyNumeroClient]);

    if (entries.length === 0) return null;

    return (
        <Card className="gap-0 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Legacy Subscription</CardTitle>
                <CardDescription>Données importées depuis DBPOLE (lecture seule)</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pt-2">
                <div className="flex flex-col divide-y">
                    {entries.map(({ label, value, highlight }) => (
                        <div key={label} className="flex items-center justify-between py-3">
                            <span className="text-muted-foreground text-sm">{label}</span>
                            <span className="font-mono text-sm font-medium">
                                {highlight ? <span className="text-amber-600">{value} (lifetime)</span> : value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const CustomerInfoTab = () => {
    const { isLoading, isCreateMode, customer, customerId } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();

    const currencyOptions = useCurrencyOptions();
    const customerTypeOptions = useCustomerTypeOptions();
    const { ControlledTextInput, ControlledTextAreaInput, ControlledSelectInput } =
        createConnectedInputHelpers<CustomerFormValues>();

    if (isLoading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="min-w-0 flex-1 overflow-y-auto">
                <div className="mx-auto max-w-3xl space-y-6 p-6">
                    {/* Summary inline */}
                    {!isCreateMode && <CustomerSummarySidebar customer={customer} customerId={customerId} />}

                    <Card className="gap-0 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">{t('customers.info.title')}</CardTitle>
                            <CardDescription>{t('customers.info.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <div className="flex flex-col divide-y">
                                <ControlledTextInput
                                    name="name"
                                    label={t('field.name')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="email"
                                    label={t('field.email')}
                                    direction="horizontal"
                                    className="py-6"
                                    readOnly={!isCreateMode}
                                />
                                <ControlledTextInput
                                    name="phone"
                                    label={t('field.phone')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextAreaInput
                                    name="description"
                                    label={t('field.description')}
                                    direction="horizontal"
                                    maxLength={500}
                                    className="py-6"
                                />
                                <ControlledSelectInput
                                    name="customerType"
                                    label={t('customers.info.customerType')}
                                    options={customerTypeOptions}
                                    placeholder={t('customers.info.customerType')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledSelectInput
                                    name="currency"
                                    label={t('customers.info.currency')}
                                    options={currencyOptions}
                                    placeholder={t('customers.info.currency')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <LegacySubscriptionMetadata metadata={customer?.metadata} />
                </div>
            </div>

            {/* Comments Sidebar */}
            {!isCreateMode && (
                <aside className="bg-muted/30 hidden w-120 shrink-0 overflow-y-auto border-l p-4 lg:block">
                    <CustomerCommentsSection customerId={customerId} />
                </aside>
            )}
        </div>
    );
};
