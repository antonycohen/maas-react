import { Invoice, InvoiceListResponse, InvoicePayResponse } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, FieldQuery, GetCollectionQueryParams } from '../types';

const ADMIN_PATH = '/api/v1/pms/invoices';
const ME_PATH = '/api/v1/users/me/invoices';

export interface GetMyInvoicesFilter {
    status?: string;
    cursor?: string;
}

export interface GetAdminInvoicesFilter {
    customerId?: string;
    status?: string;
}

export class InvoicesEndpoint {
    constructor(private client: ApiClient) {}

    // ─── User-facing ──────────────────────────────────────

    /**
     * Get the current user's invoices
     * GET /api/v1/users/me/invoices
     */
    async getMyInvoices(filters?: GetMyInvoicesFilter): Promise<InvoiceListResponse> {
        return this.client.getById<InvoiceListResponse>(ME_PATH, undefined, {
            params: {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.cursor && { cursor: filters.cursor }),
            },
        });
    }

    /**
     * Download an invoice PDF for current user
     * GET /api/v1/users/me/invoices/{invoiceId}/download
     */
    async downloadMyInvoice(invoiceId: string): Promise<Blob> {
        const response = await this.client.request<Blob>(`${ME_PATH}/${invoiceId}/download`, {
            method: 'GET',
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Get Stripe payment URL for an unpaid invoice
     * GET /api/v1/users/me/invoices/{invoiceId}/pay
     */
    async getInvoicePaymentUrl(invoiceId: string): Promise<InvoicePayResponse> {
        return this.client.getById<InvoicePayResponse>(`${ME_PATH}/${invoiceId}/pay`);
    }

    // ─── Admin ────────────────────────────────────────────

    /**
     * List customer invoices (admin)
     * GET /api/v1/pms/invoices
     */
    async getInvoices(
        params: GetCollectionQueryParams<Invoice> & { filters?: GetAdminInvoicesFilter }
    ): Promise<ApiCollectionResponse<Invoice>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Invoice>(ADMIN_PATH, fields, {
            offset,
            limit,
            ...(filters?.customerId && { customerId: filters.customerId }),
            ...(filters?.status && { status: filters.status }),
        });
    }

    /**
     * Get a single invoice by ID (admin)
     * GET /api/v1/pms/invoices/{invoiceId}
     */
    async getInvoice(invoiceId: string, fields?: FieldQuery<Invoice>): Promise<Invoice> {
        return this.client.getById<Invoice>(`${ADMIN_PATH}/${invoiceId}`, fields);
    }

    /**
     * Download an invoice PDF (admin)
     * GET /api/v1/pms/invoices/{invoiceId}/download
     */
    async downloadInvoice(invoiceId: string): Promise<Blob> {
        const response = await this.client.request<Blob>(`${ADMIN_PATH}/${invoiceId}/download`, {
            method: 'GET',
            responseType: 'blob',
        });
        return response.data;
    }
}
