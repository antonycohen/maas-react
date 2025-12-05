import { ApiClient, ApiClientConfig } from './api-client/api-client';
import { BrandsEndpoint } from './endpoints/brands';
import { CategoriesEndpoint } from './endpoints/categories';
import { UsersEndpoint } from './endpoints/users';

class MaasApi {
  private readonly client: ApiClient;
  public readonly brands: BrandsEndpoint;
  public readonly categories: CategoriesEndpoint;
  public readonly users: UsersEndpoint;

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
    this.brands = new BrandsEndpoint(this.client);
    this.categories = new CategoriesEndpoint(this.client);
    this.users = new UsersEndpoint(this.client);
  }
}

export type { ApiClientConfig } from './api-client/api-client';
export { ApiError } from './api-client/api-error';
export * from './endpoints/brands';
export * from './endpoints/categories';
export * from './endpoints/users';

export const maasApi = new MaasApi({
  baseUrl: `${import.meta.env["VITE_API_URL"]}` || 'https://localhost:8080',
});
