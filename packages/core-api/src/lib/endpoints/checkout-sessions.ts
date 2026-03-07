import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/pms/checkout-sessions';

export interface CheckoutAddress {
    firstName: string;
    lastName: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CreateCheckoutSession {
    priceIds: string[];
    successUrl: string;
    cancelUrl: string;
    shippingAddress?: CheckoutAddress;
    billingAddress?: CheckoutAddress;
    metadata?: Record<string, string>;
}

export interface CheckoutSession {
    checkoutSession: {
        checkoutUrl: string;
    };
}

export interface CheckoutSessionAddress {
    address: {
        firstName: string;
        lastName: string;
        line1: string | null;
        line2: string | null;
        city: string | null;
        postalCode: string | null;
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

    /**
     * Get billing address from a completed checkout session
     * GET /api/v1/pms/checkout-sessions/{sessionId}/address
     */
    async getCheckoutSessionAddress(sessionId: string): Promise<CheckoutSessionAddress> {
        return this.client.getById<CheckoutSessionAddress>(`${BASE_PATH}/${sessionId}/address`);
    }
}
