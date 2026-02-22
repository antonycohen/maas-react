import { useMemo } from 'react';
import { PUBLIC_ROUTES } from '../routes';

/**
 * Hook that provides type-safe public route URLs
 * These routes don't require workspace context
 *
 * @example
 * const publicRoutes = usePublicRoutes();
 * navigate(publicRoutes.login);
 * <Link to={publicRoutes.magazines}>Magazines</Link>
 */
export const usePublicRoutes = () => {
    return useMemo(
        () => ({
            /** Home page URL */
            home: PUBLIC_ROUTES.HOME,

            /** Login page URL */
            login: PUBLIC_ROUTES.LOGIN,

            /** OAuth callback URL */
            loginCallback: PUBLIC_ROUTES.LOGIN_CALLBACK,

            /** Login dispatcher URL */
            loginDispatcher: PUBLIC_ROUTES.LOGIN_DISPATCHER,

            /** Logout URL */
            logout: PUBLIC_ROUTES.LOGOUT,

            /** Magazines list URL */
            magazines: PUBLIC_ROUTES.MAGAZINES,

            /** Dossiers list URL */
            dossiers: PUBLIC_ROUTES.DOSSIERS,

            /** Categories list URL */
            categories: PUBLIC_ROUTES.CATEGORIES,

            /** Category detail URL */
            category: (categorySlug: string) => `${PUBLIC_ROUTES.CATEGORIES}/${categorySlug}`,

            /** Magazine detail URL */
            magazine: (magazineId: string) => `${PUBLIC_ROUTES.MAGAZINES}/${magazineId}`,

            /** Article detail URL (public facing) */
            article: (articleId: string) => `${PUBLIC_ROUTES.ARTICLES}/${articleId}`,

            /** Folder/dossier detail URL */
            folder: (folderId: string) => `${PUBLIC_ROUTES.DOSSIERS}/${folderId}`,

            /** Account page URL */
            account: PUBLIC_ROUTES.ACCOUNT,

            /** Account profile URL */
            accountProfile: PUBLIC_ROUTES.ACCOUNT_PROFILE,

            /** Mathematical themes list URL */
            mathematicalThemes: PUBLIC_ROUTES.MATHEMATICAL_THEMES,

            /** Mathematical theme detail URL */
            mathematicalTheme: (theme: string) => `${PUBLIC_ROUTES.MATHEMATICAL_THEMES}/${theme}`,

            /** Pricing page URL */
            pricing: PUBLIC_ROUTES.PRICING,

            /** Pricing auth step URL */
            pricingAuth: PUBLIC_ROUTES.PRICING_AUTH,

            /** Pricing payment step URL */
            pricingPaiement: PUBLIC_ROUTES.PRICING_PAIEMENT,

            /** Pricing address step URL */
            pricingAdresse: PUBLIC_ROUTES.PRICING_ADRESSE,

            /** Checkout success URL */
            checkoutSuccess: PUBLIC_ROUTES.CHECKOUT_SUCCESS,

            /** Checkout cancel URL */
            checkoutCancel: PUBLIC_ROUTES.CHECKOUT_CANCEL,
        }),
        []
    );
};

export type PublicRoutes = ReturnType<typeof usePublicRoutes>;
