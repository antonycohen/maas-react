export const INVOICE_STATUS_STYLES: Record<string, string> = {
    paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    open: 'border-blue-200 bg-blue-50 text-blue-700',
    draft: 'border-gray-200 bg-gray-50 text-gray-700',
    void: 'border-red-200 bg-red-50 text-red-700',
    uncollectible: 'border-orange-200 bg-orange-50 text-orange-700',
};

export const SUBSCRIPTION_STATUS_STYLES: Record<string, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    trialing: 'border-blue-200 bg-blue-50 text-blue-700',
    past_due: 'border-orange-200 bg-orange-50 text-orange-700',
    canceled: 'border-red-200 bg-red-50 text-red-700',
    unpaid: 'border-red-200 bg-red-50 text-red-700',
    incomplete: 'border-gray-200 bg-gray-50 text-gray-700',
    incomplete_expired: 'border-gray-200 bg-gray-50 text-gray-700',
    paused: 'border-yellow-200 bg-yellow-50 text-yellow-700',
};
