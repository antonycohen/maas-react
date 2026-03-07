/**
 * Centralized constants for subscription metadata keys stored in Stripe.
 * Must stay in sync with backend: Dpaas\PmsBundle\Enum\SubscriptionMetadataKeys
 */
export const SubscriptionMetadataKeys = {
    ONE_TIME_SUBSCRIPTION: 'one_time_subscription',
} as const;

/**
 * Build subscription metadata from user options.
 * Centralizes metadata key usage to prevent typos.
 */
export function buildSubscriptionMetadata(options: { oneTimeSubscription?: boolean }): Record<string, string> {
    const metadata: Record<string, string> = {};

    if (options.oneTimeSubscription) {
        metadata[SubscriptionMetadataKeys.ONE_TIME_SUBSCRIPTION] = 'true';
    }

    return metadata;
}
