import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues, useCurrencyOptions } from '../../hooks';
import { useTranslation } from '@maas/core-translations';
import { CustomerSummarySidebar } from './components/customer-summary-sidebar';

export const CustomerInfoTab = () => {
    const { isLoading, customer, customerId } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();

    const currencyOptions = useCurrencyOptions();
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
                                    readOnly
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
                </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="bg-muted/30 hidden w-72 shrink-0 overflow-y-auto border-l p-4 lg:block">
                <CustomerSummarySidebar customer={customer} customerId={customerId} />
            </aside>
        </div>
    );
};
