import { SEGMENTS, ADMIN_ROUTES } from './routes';

/**
 * Build a path by replacing parameter placeholders with actual values
 * @example buildPath('/issues/:issueId/info', { issueId: '123' }) => '/issues/123/info'
 */
export const buildPath = <T extends Record<string, string>>(pattern: string, params: T): string => {
    let path = pattern;
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, encodeURIComponent(value));
    }
    return path;
};

/**
 * Build the workspace base URL
 * @example buildWorkspaceBaseUrl('org-123') => '/admin/w/org-123'
 */
export const buildWorkspaceBaseUrl = (organizationId: string): string => {
    return `/${SEGMENTS.ADMIN}/${SEGMENTS.WORKSPACE}/${organizationId}`;
};

/**
 * Admin URL builders - relative paths (without workspace prefix)
 * Use with useWorkspaceRoutes hook which adds the workspace prefix
 */
export const adminUrlBuilders = {
    // Dashboard
    root: () => ADMIN_ROUTES.ROOT,

    // Account
    account: () => SEGMENTS.ACCOUNT,
    accountProfile: () => `${SEGMENTS.ACCOUNT}/${SEGMENTS.PROFILE}`,
    accountConnexion: () => `${SEGMENTS.ACCOUNT}/${SEGMENTS.CONNEXION}`,
    accountPreferences: () => `${SEGMENTS.ACCOUNT}/${SEGMENTS.PREFERENCES}`,

    // Issues
    issues: () => ADMIN_ROUTES.ISSUES,
    issueNewInfo: () => `${SEGMENTS.ISSUES}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    issueInfo: (issueId: string) => buildPath(`${SEGMENTS.ISSUES}/:issueId/${SEGMENTS.INFO}`, { issueId }),
    issueOrganizer: (issueId: string) => buildPath(`${SEGMENTS.ISSUES}/:issueId/${SEGMENTS.ORGANIZER}`, { issueId }),

    // Articles
    articles: () => ADMIN_ROUTES.ARTICLES,
    articleNew: () => `${SEGMENTS.ARTICLES}/${SEGMENTS.NEW}`,
    articleEdit: (articleId: string) => buildPath(`${SEGMENTS.ARTICLES}/:articleId`, { articleId }),

    // Folders
    folders: () => ADMIN_ROUTES.FOLDERS,
    folderNewInfo: () => `${SEGMENTS.FOLDERS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    folderInfo: (folderId: string) => buildPath(`${SEGMENTS.FOLDERS}/:folderId/${SEGMENTS.INFO}`, { folderId }),
    folderArticles: (folderId: string) =>
        buildPath(`${SEGMENTS.FOLDERS}/:folderId/${SEGMENTS.ARTICLES}`, {
            folderId,
        }),

    // Categories
    categories: () => ADMIN_ROUTES.CATEGORIES,
    categoryNew: () => `${SEGMENTS.CATEGORIES}/${SEGMENTS.NEW}`,
    categoryEdit: (categoryId: string) => buildPath(`${SEGMENTS.CATEGORIES}/:categoryId`, { categoryId }),

    // Brands
    brands: () => ADMIN_ROUTES.BRANDS,
    brandNew: () => `${SEGMENTS.BRANDS}/${SEGMENTS.NEW}`,
    brandEdit: (brandId: string) => buildPath(`${SEGMENTS.BRANDS}/:brandId`, { brandId }),

    // Enums
    enums: () => ADMIN_ROUTES.ENUMS,
    enumNew: () => `${SEGMENTS.ENUMS}/${SEGMENTS.NEW}`,
    enumEdit: (enumId: string) => buildPath(`${SEGMENTS.ENUMS}/:enumId`, { enumId }),

    // Article Types
    articleTypes: () => ADMIN_ROUTES.ARTICLE_TYPES,
    articleTypeNew: () => `${SEGMENTS.ARTICLE_TYPES}/${SEGMENTS.NEW}`,
    articleTypeEdit: (articleTypeId: string) =>
        buildPath(`${SEGMENTS.ARTICLE_TYPES}/:articleTypeId`, { articleTypeId }),

    // Users
    users: () => ADMIN_ROUTES.USERS,
    userEdit: (userId: string) => buildPath(`${SEGMENTS.USERS}/:userId`, { userId }),

    // Teams
    teams: () => ADMIN_ROUTES.TEAMS,

    // Settings
    settings: () => ADMIN_ROUTES.SETTINGS,
    settingsTeams: () => `${SEGMENTS.SETTINGS}/${SEGMENTS.TEAMS}`,

    // Other
    organizations: () => ADMIN_ROUTES.ORGANIZATIONS,
    notifications: () => ADMIN_ROUTES.NOTIFICATIONS,
    routingFiles: () => ADMIN_ROUTES.ROUTING_FILES,

    // PMS (Pricing Management System)
    pms: () => ADMIN_ROUTES.PMS,
    // PMS Plans
    pmsPlans: () => ADMIN_ROUTES.PMS_PLANS,
    pmsPlanNewInfo: () => `${SEGMENTS.PMS}/${SEGMENTS.PLANS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    pmsPlanInfo: (planId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PLANS}/:planId/${SEGMENTS.INFO}`, { planId }),
    pmsPlanProducts: (planId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PLANS}/:planId/${SEGMENTS.PRODUCTS}`, { planId }),
    // PMS Products
    pmsProducts: () => ADMIN_ROUTES.PMS_PRODUCTS,
    pmsProductNewInfo: () => `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    pmsProductInfo: (productId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.INFO}`, { productId }),
    pmsProductPrices: (productId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.PRICES}`, { productId }),
    pmsProductFeatures: (productId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.FEATURES}`, { productId }),
    // PMS Prices
    pmsPrices: () => ADMIN_ROUTES.PMS_PRICES,
    pmsPriceEdit: (priceId: string) => buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PRICES}/:priceId`, { priceId }),
    // PMS Features
    pmsFeatures: () => ADMIN_ROUTES.PMS_FEATURES,
    pmsFeatureEdit: (featureId: string) => buildPath(`${SEGMENTS.PMS}/${SEGMENTS.FEATURES}/:featureId`, { featureId }),
    // PMS Subscriptions
    pmsSubscriptions: () => ADMIN_ROUTES.PMS_SUBSCRIPTIONS,
    pmsSubscriptionView: (subscriptionId: string) =>
        buildPath(`${SEGMENTS.PMS}/${SEGMENTS.PMS_SUBSCRIPTIONS}/:subscriptionId`, { subscriptionId }),
    // PMS Wizard
    pmsWizard: () => ADMIN_ROUTES.PMS_WIZARD,
};

export type AdminUrlBuilders = typeof adminUrlBuilders;
