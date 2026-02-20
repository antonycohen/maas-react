import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenManager } from './token-manager';
import { AuthenticationError } from './authentication-error';
import { AuthorizationError } from './authorization-error';
import { ApiError } from './api-error';
import { toSnakeCase } from './case-converter';
import applyCaseMiddleware from 'axios-case-converter';
import { ApiCollectionResponse, FieldQuery } from '../types';
import { serializeFieldsQuery } from '../utils/serialize-fields-query';

interface ApiClientConfig {
    baseUrl: string;
}

class ApiClient {
    private readonly config: ApiClientConfig;
    private readonly tokenManager: TokenManager | null = null;
    private readonly axiosInstance: AxiosInstance;
    private organizationId: string | null = null;

    constructor(config: ApiClientConfig) {
        this.config = config;
        this.tokenManager = new TokenManager();

        this.axiosInstance = axios.create({
            baseURL: this.config.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.axiosInstance = applyCaseMiddleware(this.axiosInstance, {
            caseFunctions: {
                camel: (input) => {
                    return input
                        .split('.')
                        .map((part) => part.replace(/[_-]./g, (match) => match.charAt(1).toUpperCase()))
                        .join('.');
                },
            },
        });

        // Request interceptor to add token and organization header
        this.axiosInstance.interceptors.request.use(async (config) => {
            try {
                const token = await this.getValidToken();
                config.headers.Authorization = `Bearer ${token}`;

                if (this.organizationId) {
                    config.headers['X-Organization-Id'] = this.organizationId;
                }
            } catch (error) {
                // Allow unauthenticated requests for public routes (no token available)
                if (!(error instanceof AuthenticationError)) {
                    throw error;
                }
            }
            return config;
        });

        // Response interceptor for token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<{ code?: number; message?: string }>) => {
                const originalRequest = error.config;

                if (error.response?.status === 401) {
                    const data = error.response.data;
                    if (data?.code === 401 && data?.message === 'Access token could not be verified') {
                        this.tokenManager?.resetAuth();
                        return Promise.reject(new AuthorizationError('Access token could not be verified'));
                    }

                    if (originalRequest && !originalRequest.headers.RetryRequest) {
                        try {
                            originalRequest.headers.RetryRequest = true;
                            const newToken = await this.tokenManager!.forceRefresh();
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return this.axiosInstance(originalRequest);
                        } catch (refreshError) {
                            if (refreshError instanceof AuthenticationError && data?.code) {
                                return Promise.reject(new AuthenticationError(refreshError.message, data.code));
                            }
                            return Promise.reject(refreshError);
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async getValidToken(): Promise<string> {
        if (!this.tokenManager) {
            throw new Error('Token manager not configured');
        }
        return this.tokenManager.getValidToken();
    }

    setOrganizationId(organizationId: string | null) {
        this.organizationId = organizationId;
    }

    async request<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.request<T>({
                url: endpoint,
                ...config,
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw await ApiError.fromAxiosResponse(error.response);
            }
            throw error;
        }
    }

    async getById<T>(endpoint: string, fields?: FieldQuery<T>, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.request<T>(endpoint, {
            ...config,
            method: 'GET',
            params: {
                fields: fields ? serializeFieldsQuery(fields) : undefined,
                ...config?.params,
            },
        });
        return response.data;
    }

    async getCollection<T>(
        endpoint: string,
        fields?: FieldQuery<T>,
        query?: object,
        config?: AxiosRequestConfig
    ): Promise<ApiCollectionResponse<T>> {
        const response = await this.request<T[]>(endpoint, {
            ...config,
            method: 'GET',
            params: {
                fields: fields ? serializeFieldsQuery<T>(fields) : undefined,
                ...query,
                ...config?.params,
            },
        });

        return {
            data: response.data,
            pagination: {
                count: Number(response.headers['xTotalCount']),
                limit: Number(response.headers['xLimit']),
                offset: Number(response.headers['xOffset']),
            },
        };
    }

    async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            data: data ? toSnakeCase(data) : undefined,
        });
        return response.data;
    }

    async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            data: data ? toSnakeCase(data) : undefined,
        });
        return response.data;
    }

    async patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            data: data ? toSnakeCase(data) : undefined,
        });
        return response.data;
    }

    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.request<T>(endpoint, {
            ...config,
            method: 'DELETE',
        });
        return response.data;
    }
}

export { ApiClient };
export type { ApiClientConfig };
