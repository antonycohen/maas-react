import { ApiClient, ApiClientConfig } from './api-client/api-client';
import { ArticlesEndpoint } from './endpoints/articles';
import { BrandsEndpoint } from './endpoints/brands';
import { CategoriesEndpoint } from './endpoints/categories';
import { EnumsEndpoint } from './endpoints/enums';
import { FoldersEndpoint } from './endpoints/folders';
import { IssuesEndpoint } from './endpoints/issues';
import { UsersEndpoint } from './endpoints/users';
import { OrganizationsEndpoint } from './endpoints/organizations';
import { OrganizationMembersEndpoint } from './endpoints/organization-members';

class MaasApi {
  private readonly client: ApiClient;
  public readonly articles: ArticlesEndpoint;
  public readonly brands: BrandsEndpoint;
  public readonly categories: CategoriesEndpoint;
  public readonly enums: EnumsEndpoint;
  public readonly folders: FoldersEndpoint;
  public readonly issues: IssuesEndpoint;
  public readonly users: UsersEndpoint;
  public readonly organizations: OrganizationsEndpoint;
  public readonly organizationMembers: OrganizationMembersEndpoint;

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
    this.articles = new ArticlesEndpoint(this.client);
    this.brands = new BrandsEndpoint(this.client);
    this.categories = new CategoriesEndpoint(this.client);
    this.enums = new EnumsEndpoint(this.client);
    this.folders = new FoldersEndpoint(this.client);
    this.issues = new IssuesEndpoint(this.client);
    this.users = new UsersEndpoint(this.client);
    this.organizations = new OrganizationsEndpoint(this.client);
    this.organizationMembers = new OrganizationMembersEndpoint(this.client);
  }
}

export type { ApiClientConfig } from './api-client/api-client';
export { ApiError } from './api-client/api-error';
export * from './endpoints/articles';
export * from './endpoints/brands';
export * from './endpoints/categories';
export * from './endpoints/enums';
export * from './endpoints/folders';
export * from './endpoints/issues';
export * from './endpoints/users';

export const maasApi = new MaasApi({
  baseUrl: `${import.meta.env["VITE_API_URL"]}` || 'https://localhost:8080',
});
