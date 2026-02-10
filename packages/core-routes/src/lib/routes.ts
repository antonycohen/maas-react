/**
 * Route segment constants
 * These are the building blocks for all URLs in the application
 */
export const SEGMENTS = {
    // Base segments
    ADMIN: 'admin',
    WORKSPACE: 'w',

    // Auth
    LOGIN: 'login',
    CALLBACK: 'callback',
    DISPATCHER: 'dispatcher',
    LOGOUT: 'logout',

    // Account
    ACCOUNT: 'account',
    PROFILE: 'profile',
    CONNEXION: 'connexion',
    PREFERENCES: 'preferences',

    // Content
    ISSUES: 'issues',
    ARTICLES: 'articles',
    FOLDERS: 'folders',
    CATEGORIES: 'categories',
    BRANDS: 'brands',
    ENUMS: 'enums',
    ARTICLE_TYPES: 'article-types',

    // Public content
    MAGAZINES: 'magazines',
    DOSSIERS: 'dossiers',

    // Administration
    USERS: 'users',
    TEAMS: 'teams',
    SETTINGS: 'settings',
    ORGANIZATIONS: 'organizations',
    SUBSCRIPTIONS: 'subscriptions',
    NOTIFICATIONS: 'notifications',
    ROUTING_FILES: 'routing-files',

    // Checkout
    PRICING: 'pricing',
    CHECKOUT: 'checkout',
    SUCCESS: 'success',
    CANCEL: 'cancel',

    // PMS (Pricing Management System)
    PMS: 'pms',
    PLANS: 'plans',
    PRODUCTS: 'products',
    PRICES: 'prices',
    FEATURES: 'features',
    PMS_SUBSCRIPTIONS: 'subscriptions',
    WIZARD: 'wizard',

    // Sub-routes / tabs
    INFO: 'info',
    ORGANIZER: 'organizer',
    NEW: 'new',
} as const;

/**
 * Public routes (reader-facing, no workspace context)
 */
export const PUBLIC_ROUTES = {
    HOME: '/',
    LOGIN: `/${SEGMENTS.LOGIN}`,
    LOGIN_CALLBACK: `/${SEGMENTS.LOGIN}/${SEGMENTS.CALLBACK}`,
    LOGIN_DISPATCHER: `/${SEGMENTS.LOGIN}/${SEGMENTS.DISPATCHER}`,
    LOGOUT: `/${SEGMENTS.LOGOUT}`,
    MAGAZINES: `/${SEGMENTS.MAGAZINES}`,
    DOSSIERS: `/${SEGMENTS.DOSSIERS}`,
    CATEGORIES: `/${SEGMENTS.CATEGORIES}`,
    PRICING: `/${SEGMENTS.PRICING}`,
    CHECKOUT_SUCCESS: `/${SEGMENTS.PRICING}/${SEGMENTS.CHECKOUT}/${SEGMENTS.SUCCESS}`,
    CHECKOUT_CANCEL: `/${SEGMENTS.PRICING}/${SEGMENTS.CHECKOUT}/${SEGMENTS.CANCEL}`,
} as const;

/**
 * Admin route patterns (relative paths without workspace prefix)
 * Use with route definitions and useWorkspaceRoutes hook
 */
export const ADMIN_ROUTES = {
    // Dashboard
    ROOT: '',

    // Account
    ACCOUNT: `${SEGMENTS.ACCOUNT}/*`,
    ACCOUNT_PROFILE: `${SEGMENTS.ACCOUNT}/${SEGMENTS.PROFILE}`,
    ACCOUNT_CONNEXION: `${SEGMENTS.ACCOUNT}/${SEGMENTS.CONNEXION}`,
    ACCOUNT_PREFERENCES: `${SEGMENTS.ACCOUNT}/${SEGMENTS.PREFERENCES}`,

    // Issues
    ISSUES: SEGMENTS.ISSUES,
    ISSUES_WILDCARD: `${SEGMENTS.ISSUES}/*`,
    ISSUE_NEW_INFO: `${SEGMENTS.ISSUES}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    ISSUE_INFO: `${SEGMENTS.ISSUES}/:issueId/${SEGMENTS.INFO}`,
    ISSUE_ORGANIZER: `${SEGMENTS.ISSUES}/:issueId/${SEGMENTS.ORGANIZER}`,

    // Articles
    ARTICLES: SEGMENTS.ARTICLES,
    ARTICLES_WILDCARD: `${SEGMENTS.ARTICLES}/*`,
    ARTICLE_NEW: `${SEGMENTS.ARTICLES}/${SEGMENTS.NEW}`,
    ARTICLE_EDIT: `${SEGMENTS.ARTICLES}/:articleId`,

    // Folders
    FOLDERS: SEGMENTS.FOLDERS,
    FOLDERS_WILDCARD: `${SEGMENTS.FOLDERS}/*`,
    FOLDER_NEW_INFO: `${SEGMENTS.FOLDERS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    FOLDER_INFO: `${SEGMENTS.FOLDERS}/:folderId/${SEGMENTS.INFO}`,
    FOLDER_ARTICLES: `${SEGMENTS.FOLDERS}/:folderId/${SEGMENTS.ARTICLES}`,

    // Categories
    CATEGORIES: SEGMENTS.CATEGORIES,
    CATEGORIES_WILDCARD: `${SEGMENTS.CATEGORIES}/*`,
    CATEGORY_NEW: `${SEGMENTS.CATEGORIES}/${SEGMENTS.NEW}`,
    CATEGORY_EDIT: `${SEGMENTS.CATEGORIES}/:categoryId`,

    // Brands
    BRANDS: SEGMENTS.BRANDS,
    BRANDS_WILDCARD: `${SEGMENTS.BRANDS}/*`,
    BRAND_NEW: `${SEGMENTS.BRANDS}/${SEGMENTS.NEW}`,
    BRAND_EDIT: `${SEGMENTS.BRANDS}/:brandId`,

    // Enums
    ENUMS: SEGMENTS.ENUMS,
    ENUMS_WILDCARD: `${SEGMENTS.ENUMS}/*`,
    ENUM_NEW: `${SEGMENTS.ENUMS}/${SEGMENTS.NEW}`,
    ENUM_EDIT: `${SEGMENTS.ENUMS}/:enumId`,

    // Article Types
    ARTICLE_TYPES: SEGMENTS.ARTICLE_TYPES,
    ARTICLE_TYPES_WILDCARD: `${SEGMENTS.ARTICLE_TYPES}/*`,
    ARTICLE_TYPE_NEW: `${SEGMENTS.ARTICLE_TYPES}/${SEGMENTS.NEW}`,
    ARTICLE_TYPE_EDIT: `${SEGMENTS.ARTICLE_TYPES}/:articleTypeId`,

    // Users
    USERS: SEGMENTS.USERS,
    USERS_WILDCARD: `${SEGMENTS.USERS}/*`,
    USER_EDIT: `${SEGMENTS.USERS}/:userId`,

    // Teams
    TEAMS: SEGMENTS.TEAMS,
    TEAMS_WILDCARD: `${SEGMENTS.TEAMS}/*`,

    // Settings
    SETTINGS: SEGMENTS.SETTINGS,
    SETTINGS_WILDCARD: `${SEGMENTS.SETTINGS}/*`,
    SETTINGS_TEAMS: `${SEGMENTS.SETTINGS}/${SEGMENTS.TEAMS}`,

    // Other admin sections
    ORGANIZATIONS: SEGMENTS.ORGANIZATIONS,
    SUBSCRIPTIONS: SEGMENTS.SUBSCRIPTIONS,
    NOTIFICATIONS: SEGMENTS.NOTIFICATIONS,
    ROUTING_FILES: SEGMENTS.ROUTING_FILES,

    // PMS (Pricing Management System)
    PMS: SEGMENTS.PMS,
    PMS_WILDCARD: `${SEGMENTS.PMS}/*`,
    // PMS Plans
    PMS_PLANS: `${SEGMENTS.PMS}/${SEGMENTS.PLANS}`,
    PMS_PLANS_WILDCARD: `${SEGMENTS.PMS}/${SEGMENTS.PLANS}/*`,
    PMS_PLAN_NEW_INFO: `${SEGMENTS.PMS}/${SEGMENTS.PLANS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    PMS_PLAN_INFO: `${SEGMENTS.PMS}/${SEGMENTS.PLANS}/:planId/${SEGMENTS.INFO}`,
    PMS_PLAN_PRODUCTS: `${SEGMENTS.PMS}/${SEGMENTS.PLANS}/:planId/${SEGMENTS.PRODUCTS}`,
    // PMS Products
    PMS_PRODUCTS: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}`,
    PMS_PRODUCTS_WILDCARD: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/*`,
    PMS_PRODUCT_NEW_INFO: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/${SEGMENTS.NEW}/${SEGMENTS.INFO}`,
    PMS_PRODUCT_INFO: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.INFO}`,
    PMS_PRODUCT_PRICES: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.PRICES}`,
    PMS_PRODUCT_FEATURES: `${SEGMENTS.PMS}/${SEGMENTS.PRODUCTS}/:productId/${SEGMENTS.FEATURES}`,
    // PMS Prices
    PMS_PRICES: `${SEGMENTS.PMS}/${SEGMENTS.PRICES}`,
    PMS_PRICES_WILDCARD: `${SEGMENTS.PMS}/${SEGMENTS.PRICES}/*`,
    PMS_PRICE_EDIT: `${SEGMENTS.PMS}/${SEGMENTS.PRICES}/:priceId`,
    // PMS Features
    PMS_FEATURES: `${SEGMENTS.PMS}/${SEGMENTS.FEATURES}`,
    PMS_FEATURES_WILDCARD: `${SEGMENTS.PMS}/${SEGMENTS.FEATURES}/*`,
    PMS_FEATURE_EDIT: `${SEGMENTS.PMS}/${SEGMENTS.FEATURES}/:featureId`,
    // PMS Subscriptions
    PMS_SUBSCRIPTIONS: `${SEGMENTS.PMS}/${SEGMENTS.PMS_SUBSCRIPTIONS}`,
    PMS_SUBSCRIPTIONS_WILDCARD: `${SEGMENTS.PMS}/${SEGMENTS.PMS_SUBSCRIPTIONS}/*`,
    PMS_SUBSCRIPTION_VIEW: `${SEGMENTS.PMS}/${SEGMENTS.PMS_SUBSCRIPTIONS}/:subscriptionId`,
    // PMS Wizard
    PMS_WIZARD: `${SEGMENTS.PMS}/${SEGMENTS.WIZARD}/*`,
} as const;

/**
 * Route patterns for React Router definitions
 * These include wildcards and parameter placeholders
 */
export const ROUTE_PATTERNS = {
    // Top-level
    LOGIN_WILDCARD: `${SEGMENTS.LOGIN}/*`,
    ADMIN_WILDCARD: `${SEGMENTS.ADMIN}/*`,
    WORKSPACE_WILDCARD: `${SEGMENTS.WORKSPACE}/:organizationId?/*`,

    // Nested route patterns (for use inside feature routes)
    INDEX: '/',
    PARAM_ID: '/:id',
    WILDCARD: '*',
} as const;

export type RoutesType = typeof PUBLIC_ROUTES | typeof ADMIN_ROUTES;
