export type ApiError = {
  httpCode: number;
  code: number;
  statusCode: number;
  message: string;
  parametersErrors: {
    [key: string]: string[];
  };
};
