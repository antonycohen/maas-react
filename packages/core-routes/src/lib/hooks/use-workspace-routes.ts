import { useMemo } from 'react';
import { buildWorkspaceBaseUrl, adminUrlBuilders } from '../route-builders';
import { PUBLIC_ROUTES } from '../routes';

/**
 * Hook that provides type-safe workspace route builders
 * Must be used within a WorkspaceProvider context
 *
 * @param workspaceId - The current workspace/organization ID
 * @returns Object with methods to build full workspace URLs
 *
 * @example
 * const routes = useWorkspaceRoutes(workspaceId);
 * <Link to={routes.articles()}>Articles</Link>
 * <Link to={routes.articleEdit('123')}>Edit Article</Link>
 */
export const useWorkspaceRoutes = (workspaceId: string | null) => {
    const baseUrl = useMemo(() => (workspaceId ? buildWorkspaceBaseUrl(workspaceId) : ''), [workspaceId]);

    return useMemo(
        () => ({
            /** The workspace base URL (e.g., /admin/w/org-123) */
            base: baseUrl,

            login: () => PUBLIC_ROUTES.LOGIN,

            // Dashboard
            /** Dashboard/root URL */
            root: () => `${baseUrl}/`,

            // Account
            /** Account section URL */
            account: () => `${baseUrl}/${adminUrlBuilders.account()}`,
            /** Account profile URL */
            accountProfile: () => `${baseUrl}/${adminUrlBuilders.accountProfile()}`,
            /** Account connexion URL */
            accountConnexion: () => `${baseUrl}/${adminUrlBuilders.accountConnexion()}`,
            /** Account preferences URL */
            accountPreferences: () => `${baseUrl}/${adminUrlBuilders.accountPreferences()}`,
            /** Account subscription URL */
            accountSubscription: () => `${baseUrl}/${adminUrlBuilders.accountSubscription()}`,

            // Issues
            /** Issues list URL */
            issues: () => `${baseUrl}/${adminUrlBuilders.issues()}`,
            /** New issue URL */
            issueNewInfo: () => `${baseUrl}/${adminUrlBuilders.issueNewInfo()}`,
            /** Issue info URL */
            issueInfo: (issueId: string) => `${baseUrl}/${adminUrlBuilders.issueInfo(issueId)}`,
            /** Issue organizer URL */
            issueOrganizer: (issueId: string) => `${baseUrl}/${adminUrlBuilders.issueOrganizer(issueId)}`,

            // Articles
            /** Articles list URL */
            articles: () => `${baseUrl}/${adminUrlBuilders.articles()}`,
            /** New article URL */
            articleNew: () => `${baseUrl}/${adminUrlBuilders.articleNew()}`,
            /** Edit article URL */
            articleEdit: (articleId: string) => `${baseUrl}/${adminUrlBuilders.articleEdit(articleId)}`,

            // Folders
            /** Folders list URL */
            folders: () => `${baseUrl}/${adminUrlBuilders.folders()}`,
            /** New folder URL */
            folderNewInfo: () => `${baseUrl}/${adminUrlBuilders.folderNewInfo()}`,
            /** Folder info URL */
            folderInfo: (folderId: string) => `${baseUrl}/${adminUrlBuilders.folderInfo(folderId)}`,
            /** Folder articles URL */
            folderArticles: (folderId: string) => `${baseUrl}/${adminUrlBuilders.folderArticles(folderId)}`,

            // Categories
            /** Categories list URL */
            categories: () => `${baseUrl}/${adminUrlBuilders.categories()}`,
            /** New category URL */
            categoryNew: () => `${baseUrl}/${adminUrlBuilders.categoryNew()}`,
            /** Edit category URL */
            categoryEdit: (categoryId: string) => `${baseUrl}/${adminUrlBuilders.categoryEdit(categoryId)}`,

            // Brands
            /** Brands list URL */
            brands: () => `${baseUrl}/${adminUrlBuilders.brands()}`,
            /** New brand URL */
            brandNew: () => `${baseUrl}/${adminUrlBuilders.brandNew()}`,
            /** Edit brand URL */
            brandEdit: (brandId: string) => `${baseUrl}/${adminUrlBuilders.brandEdit(brandId)}`,

            // Enums
            /** Enums list URL */
            enums: () => `${baseUrl}/${adminUrlBuilders.enums()}`,
            /** New enum URL */
            enumNew: () => `${baseUrl}/${adminUrlBuilders.enumNew()}`,
            /** Edit enum URL */
            enumEdit: (enumId: string) => `${baseUrl}/${adminUrlBuilders.enumEdit(enumId)}`,

            // Article Types
            /** Article types list URL */
            articleTypes: () => `${baseUrl}/${adminUrlBuilders.articleTypes()}`,
            /** New article type URL */
            articleTypeNew: () => `${baseUrl}/${adminUrlBuilders.articleTypeNew()}`,
            /** Edit article type URL */
            articleTypeEdit: (articleTypeId: string) => `${baseUrl}/${adminUrlBuilders.articleTypeEdit(articleTypeId)}`,

            // Customers
            /** Customers list URL */
            customers: () => `${baseUrl}/${adminUrlBuilders.customers()}`,
            /** Edit customer URL */
            customerEdit: (customerId: string) => `${baseUrl}/${adminUrlBuilders.customerEdit(customerId)}`,
            /** Customer info URL */
            customerInfo: (customerId: string) => `${baseUrl}/${adminUrlBuilders.customerInfo(customerId)}`,
            /** Customer subscriptions URL */
            customerSubscriptions: (customerId: string) =>
                `${baseUrl}/${adminUrlBuilders.customerSubscriptions(customerId)}`,

            // Users
            /** Users list URL */
            users: () => `${baseUrl}/${adminUrlBuilders.users()}`,
            /** Edit user URL */
            userEdit: (userId: string) => `${baseUrl}/${adminUrlBuilders.userEdit(userId)}`,

            // Teams
            /** Teams URL */
            teams: () => `${baseUrl}/${adminUrlBuilders.teams()}`,

            // Settings
            /** Settings URL */
            settings: () => `${baseUrl}/${adminUrlBuilders.settings()}`,
            /** Settings teams URL */
            settingsTeams: () => `${baseUrl}/${adminUrlBuilders.settingsTeams()}`,

            // Other
            /** Organizations URL */
            organizations: () => `${baseUrl}/${adminUrlBuilders.organizations()}`,
            /** Subscriptions URL */
            subscriptions: () => `${baseUrl}/${adminUrlBuilders.pmsSubscriptions()}`,
            /** Notifications URL */
            notifications: () => `${baseUrl}/${adminUrlBuilders.notifications()}`,
            /** Routing files URL */
            routingFiles: () => `${baseUrl}/${adminUrlBuilders.routingFiles()}`,

            // Diffusion Lists
            /** Diffusion lists URL */
            diffusionLists: () => `${baseUrl}/${adminUrlBuilders.diffusionLists()}`,
            /** Diffusion list detail URL */
            diffusionListDetail: (diffusionListId: string) =>
                `${baseUrl}/${adminUrlBuilders.diffusionListDetail(diffusionListId)}`,

            // PMS (Pricing Management System)
            /** PMS home URL */
            pms: () => `${baseUrl}/${adminUrlBuilders.pms()}`,
            // PMS Plans
            /** PMS Plans list URL */
            pmsPlans: () => `${baseUrl}/${adminUrlBuilders.pmsPlans()}`,
            /** New PMS Plan URL */
            pmsPlanNewInfo: () => `${baseUrl}/${adminUrlBuilders.pmsPlanNewInfo()}`,
            /** PMS Plan info URL */
            pmsPlanInfo: (planId: string) => `${baseUrl}/${adminUrlBuilders.pmsPlanInfo(planId)}`,
            /** PMS Plan products URL */
            pmsPlanProducts: (planId: string) => `${baseUrl}/${adminUrlBuilders.pmsPlanProducts(planId)}`,
            // PMS Products
            /** PMS Products list URL */
            pmsProducts: () => `${baseUrl}/${adminUrlBuilders.pmsProducts()}`,
            /** New PMS Product URL */
            pmsProductNewInfo: () => `${baseUrl}/${adminUrlBuilders.pmsProductNewInfo()}`,
            /** PMS Product info URL */
            pmsProductInfo: (productId: string) => `${baseUrl}/${adminUrlBuilders.pmsProductInfo(productId)}`,
            /** PMS Product prices URL */
            pmsProductPrices: (productId: string) => `${baseUrl}/${adminUrlBuilders.pmsProductPrices(productId)}`,
            /** PMS Product features URL */
            pmsProductFeatures: (productId: string) => `${baseUrl}/${adminUrlBuilders.pmsProductFeatures(productId)}`,
            // PMS Prices
            /** PMS Prices list URL */
            pmsPrices: () => `${baseUrl}/${adminUrlBuilders.pmsPrices()}`,
            /** Edit PMS Price URL */
            pmsPriceEdit: (priceId: string) => `${baseUrl}/${adminUrlBuilders.pmsPriceEdit(priceId)}`,
            // PMS Features
            /** PMS Features list URL */
            pmsFeatures: () => `${baseUrl}/${adminUrlBuilders.pmsFeatures()}`,
            /** Edit PMS Feature URL */
            pmsFeatureEdit: (featureId: string) => `${baseUrl}/${adminUrlBuilders.pmsFeatureEdit(featureId)}`,
            // PMS Subscriptions
            /** PMS Subscriptions list URL */
            pmsSubscriptions: () => `${baseUrl}/${adminUrlBuilders.pmsSubscriptions()}`,
            /** View PMS Subscription URL */
            pmsSubscriptionView: (subscriptionId: string) =>
                `${baseUrl}/${adminUrlBuilders.pmsSubscriptionView(subscriptionId)}`,
            // PMS Wizard
            /** PMS Wizard URL */
            pmsWizard: () => `${baseUrl}/${adminUrlBuilders.pmsWizard()}`,
        }),
        [baseUrl]
    );
};

export type WorkspaceRoutes = ReturnType<typeof useWorkspaceRoutes>;
