export { INVOICE_STATUS_STYLES, SUBSCRIPTION_STATUS_STYLES } from '@maas/core-utils';

export const INVOICE_STATUS_TRANSLATION_KEYS: Record<string, string> = {
    paid: 'customers.invoices.statusPaid',
    open: 'customers.invoices.statusOpen',
    draft: 'customers.invoices.statusDraft',
    void: 'customers.invoices.statusVoid',
    uncollectible: 'customers.invoices.statusUncollectible',
};

export const SUBSCRIPTION_STATUS_TRANSLATION_KEYS: Record<string, string> = {
    active: 'customers.subscriptions.statusActive',
    trialing: 'customers.subscriptions.statusTrialing',
    past_due: 'customers.subscriptions.statusPastDue',
    canceled: 'customers.subscriptions.statusCanceled',
    unpaid: 'customers.subscriptions.statusUnpaid',
    incomplete: 'customers.subscriptions.statusIncomplete',
    incomplete_expired: 'customers.subscriptions.statusExpired',
    paused: 'customers.subscriptions.statusPaused',
};
