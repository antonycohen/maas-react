import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/pms/checkout-sessions';

export interface CreateCheckoutSession {
    priceIds: string[];
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutSession {
    checkoutSession: {
        checkoutUrl: string;
    };
}

export class CheckoutSessionsEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Create a checkout session
     * POST /api/v1/pms/checkout-sessions
     */
    async createCheckoutSession(data: CreateCheckoutSession): Promise<CheckoutSession> {
        return this.client.post<CheckoutSession>(BASE_PATH, data);
    }
}
