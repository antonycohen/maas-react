import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { TokenManager } from './token-manager';
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
            .map((part) =>
              part.replace(/[_-]./g, (match) => match.charAt(1).toUpperCase()),
            )
            .join('.');
        },
      },
    });

    // Request interceptor to add token
    this.axiosInstance.interceptors.request.use(async (config) => {
      const token = await this.getValidToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // Response interceptor for token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest.headers.RetryRequest
        ) {
          originalRequest.headers.RetryRequest = true;
          const newToken = await this.getValidToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return this.axiosInstance(originalRequest);
        }

        return Promise.reject(error);
      },
    );
  }

  private async getValidToken(): Promise<string> {
    if (!this.tokenManager) {
      throw new Error('Token manager not configured');
    }
    return this.tokenManager.getValidToken();
  }

  async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
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

  async getById<T>(
    endpoint: string,
    fields?: FieldQuery<T>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
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
    query?: Record<string, boolean | string | number | boolean[] | string[] | number[]>,
    config?: AxiosRequestConfig,
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

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data: data ? toSnakeCase(data) : undefined,
    });
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      data: data ? toSnakeCase(data) : undefined,
    });
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
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
