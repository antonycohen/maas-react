import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/pms/portal-sessions';

export interface CreatePortalSession {
    returnUrl: string;
}

export interface PortalSession {
    portalSession: {
        portalUrl: string;
    };
}

export interface PaymentMethodPortalSession {
    portalSession: {
        url: string;
    };
}

export class PortalSessionsEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Create a portal session for subscription update (upgrade/downgrade)
     * POST /api/v1/pms/portal-sessions/subscription-update
     */
    async createSubscriptionUpdateSession(data: CreatePortalSession): Promise<PortalSession> {
        return this.client.post<PortalSession>(`${BASE_PATH}/subscription-update`, data);
    }

    /**
     * Create a portal session for payment method update
     * POST /api/v1/pms/payment-methods/portal
     */
    async createPaymentMethodUpdateSession(data: CreatePortalSession): Promise<PaymentMethodPortalSession> {
        return this.client.post<PaymentMethodPortalSession>('/api/v1/pms/payment-methods/portal', data);
    }
}
