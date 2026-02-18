import { ApiClient, ApiClientConfig } from './api-client/api-client';
import { ArticlesEndpoint } from './endpoints/articles';
import { DashboardEndpoint } from './endpoints/dashboard';
import { ArticleTypesEndpoint } from './endpoints/article-types';
import { BrandsEndpoint } from './endpoints/brands';
import { CategoriesEndpoint } from './endpoints/categories';
import { CountriesEndpoint } from './endpoints/countries';
import { EnumsEndpoint } from './endpoints/enums';
import { FoldersEndpoint } from './endpoints/folders';
import { IssuesEndpoint } from './endpoints/issues';
import { UsersEndpoint } from './endpoints/users';
import { OrganizationsEndpoint } from './endpoints/organizations';
import { OrganizationMembersEndpoint } from './endpoints/organization-members';
// PMS Endpoints
import { PlansEndpoint } from './endpoints/plans';
import { ProductsEndpoint } from './endpoints/products';
import { PricesEndpoint } from './endpoints/prices';
import { FeaturesEndpoint } from './endpoints/features';
import { SubscriptionsEndpoint } from './endpoints/subscriptions';
import { CheckoutSessionsEndpoint } from './endpoints/checkout-sessions';
import { CustomersEndpoint } from './endpoints/customers';
import { PortalSessionsEndpoint } from './endpoints/portal-sessions';
import { InvoicesEndpoint } from './endpoints/invoices';
import { DiffusionListsEndpoint } from './endpoints/diffusion-lists';
import { HomepageEndpoint } from './endpoints/homepage';

class MaasApi {
    private readonly client: ApiClient;
    public readonly articles: ArticlesEndpoint;
    public readonly articleTypes: ArticleTypesEndpoint;
    public readonly dashboard: DashboardEndpoint;
    public readonly brands: BrandsEndpoint;
    public readonly categories: CategoriesEndpoint;
    public readonly countries: CountriesEndpoint;
    public readonly enums: EnumsEndpoint;
    public readonly folders: FoldersEndpoint;
    public readonly issues: IssuesEndpoint;
    public readonly users: UsersEndpoint;
    public readonly organizations: OrganizationsEndpoint;
    public readonly organizationMembers: OrganizationMembersEndpoint;
    // PMS
    public readonly plans: PlansEndpoint;
    public readonly products: ProductsEndpoint;
    public readonly prices: PricesEndpoint;
    public readonly features: FeaturesEndpoint;
    public readonly subscriptions: SubscriptionsEndpoint;
    public readonly checkoutSessions: CheckoutSessionsEndpoint;
    public readonly customers: CustomersEndpoint;
    public readonly portalSessions: PortalSessionsEndpoint;
    public readonly invoices: InvoicesEndpoint;
    public readonly diffusionLists: DiffusionListsEndpoint;
    public readonly homepage: HomepageEndpoint;

    constructor(config: ApiClientConfig) {
        this.client = new ApiClient(config);
        this.articles = new ArticlesEndpoint(this.client);
        this.articleTypes = new ArticleTypesEndpoint(this.client);
        this.dashboard = new DashboardEndpoint(this.client);
        this.brands = new BrandsEndpoint(this.client);
        this.categories = new CategoriesEndpoint(this.client);
        this.countries = new CountriesEndpoint(this.client);
        this.enums = new EnumsEndpoint(this.client);
        this.folders = new FoldersEndpoint(this.client);
        this.issues = new IssuesEndpoint(this.client);
        this.users = new UsersEndpoint(this.client);
        this.organizations = new OrganizationsEndpoint(this.client);
        this.organizationMembers = new OrganizationMembersEndpoint(this.client);
        // PMS
        this.plans = new PlansEndpoint(this.client);
        this.products = new ProductsEndpoint(this.client);
        this.prices = new PricesEndpoint(this.client);
        this.features = new FeaturesEndpoint(this.client);
        this.subscriptions = new SubscriptionsEndpoint(this.client);
        this.checkoutSessions = new CheckoutSessionsEndpoint(this.client);
        this.customers = new CustomersEndpoint(this.client);
        this.portalSessions = new PortalSessionsEndpoint(this.client);
        this.invoices = new InvoicesEndpoint(this.client);
        this.diffusionLists = new DiffusionListsEndpoint(this.client);
        this.homepage = new HomepageEndpoint(this.client);
    }
}

export type { ApiClientConfig } from './api-client/api-client';
export { ApiError } from './api-client/api-error';
export { AuthenticationError } from './api-client/authentication-error';

export * from './endpoints/articles';
export * from './endpoints/article-types';
export * from './endpoints/dashboard';
export * from './endpoints/brands';
export * from './endpoints/categories';
export * from './endpoints/countries';
export * from './endpoints/enums';
export * from './endpoints/folders';
export * from './endpoints/issues';
export * from './endpoints/users';
// PMS Endpoints
export * from './endpoints/plans';
export * from './endpoints/products';
export * from './endpoints/prices';
export * from './endpoints/features';
export * from './endpoints/subscriptions';
export * from './endpoints/checkout-sessions';
export * from './endpoints/customers';
export * from './endpoints/portal-sessions';
export * from './endpoints/invoices';
export * from './endpoints/diffusion-lists';
export * from './endpoints/homepage';

export const maasApi = new MaasApi({
    baseUrl: `${import.meta.env['VITE_API_URL']}` || 'https://localhost:8080',
});
