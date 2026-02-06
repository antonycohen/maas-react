import { useMemo } from 'react';
import { PUBLIC_ROUTES, SEGMENTS } from '../routes';

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
            article: (articleId: string) => `/${SEGMENTS.ARTICLES}/${articleId}`,

            /** Folder/dossier detail URL */
            folder: (folderId: string) => `${PUBLIC_ROUTES.DOSSIERS}/${folderId}`,
        }),
        []
    );
};

export type PublicRoutes = ReturnType<typeof usePublicRoutes>;
