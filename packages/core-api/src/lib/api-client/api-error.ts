import { AxiosResponse } from 'axios';

type BaseApiError = {
  httpCode: number;
  code: number;
  statusCode: number;
  message: string;
  parametersErrors: {
    [key: string]: string[];
  };
};

export class ApiError extends Error implements BaseApiError {
  httpCode: number;
  code: number;
  statusCode: number;
  parametersErrors: { [key: string]: string[] };

  constructor(errorData: BaseApiError) {
    super(errorData.message);
    this.name = 'ApiError';
    this.httpCode = errorData.httpCode || errorData.statusCode;
    this.code = errorData.code;
    this.statusCode = errorData.statusCode;
    this.parametersErrors = errorData.parametersErrors || {};
  }

  static async fromAxiosResponse(response: AxiosResponse): Promise<ApiError> {
    try {
      const errorData = response.data;
      return new ApiError({
        httpCode: response.status,
        code: errorData.code || 0,
        statusCode: errorData.statusCode || response.status,
        message: errorData.message || response.statusText,
        parametersErrors: errorData.parametersErrors || {},
      });
    } catch {
      return new ApiError({
        httpCode: response.status,
        code: 0,
        statusCode: response.status,
        message: response.statusText || 'Unknown error',
        parametersErrors: {},
      });
    }
  }
}
