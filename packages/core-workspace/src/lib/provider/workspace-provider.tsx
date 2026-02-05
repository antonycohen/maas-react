import React, { PropsWithChildren, useMemo } from 'react';
import { buildWorkspaceBaseUrl, useWorkspaceRoutes, type WorkspaceRoutes } from '@maas/core-routes';

type WorkspaceContextType = {
    selectedWorkspaceId: string | null;
    getCurrentWorkspaceUrlPrefix: () => string;
    routes: WorkspaceRoutes;
};

const defaultRoutes = {
    base: '',
    root: () => '/',
    account: () => '/account',
    accountProfile: () => '/account/profile',
    accountConnexion: () => '/account/connexion',
    accountPreferences: () => '/account/preferences',
    issues: () => '/issues',
    issueNewInfo: () => '/issues/new/info',
    issueInfo: () => '/issues',
    issueOrganizer: () => '/issues',
    articles: () => '/articles',
    articleNew: () => '/articles/new',
    articleEdit: () => '/articles',
    folders: () => '/folders',
    folderNewInfo: () => '/folders/new/info',
    folderInfo: () => '/folders',
    folderArticles: () => '/folders',
    categories: () => '/categories',
    categoryNew: () => '/categories/new',
    categoryEdit: () => '/categories',
    brands: () => '/brands',
    brandNew: () => '/brands/new',
    brandEdit: () => '/brands',
    enums: () => '/enums',
    enumNew: () => '/enums/new',
    enumEdit: () => '/enums',
    articleTypes: () => '/article-types',
    articleTypeNew: () => '/article-types/new',
    articleTypeEdit: () => '/article-types',
    users: () => '/users',
    userEdit: () => '/users',
    teams: () => '/teams',
    settings: () => '/settings',
    settingsTeams: () => '/settings/teams',
    organizations: () => '/organizations',
    subscriptions: () => '/subscriptions',
    notifications: () => '/notifications',
    routingFiles: () => '/routing-files',
} as WorkspaceRoutes;

export const WorkspaceContext = React.createContext<WorkspaceContextType>({
    selectedWorkspaceId: null,
    getCurrentWorkspaceUrlPrefix: () => '/w',
    routes: defaultRoutes,
});

type WorkspaceProviderProps = PropsWithChildren<{
    selectedWorkspaceId: string | null;
}>;

export const WorkspaceProvider = (props: WorkspaceProviderProps) => {
    const routes = useWorkspaceRoutes(props.selectedWorkspaceId);

    const contextValue = useMemo(
        () => ({
            selectedWorkspaceId: props.selectedWorkspaceId,
            getCurrentWorkspaceUrlPrefix: () => {
                return props.selectedWorkspaceId ? buildWorkspaceBaseUrl(props.selectedWorkspaceId) : '';
            },
            routes,
        }),
        [props.selectedWorkspaceId, routes]
    );

    return <WorkspaceContext.Provider value={contextValue}>{props.children}</WorkspaceContext.Provider>;
};

/**
 * @deprecated Use useWorkspaceContext().routes instead for type-safe URLs
 */
export const useCurrentWorkspaceUrlPrefix = () => {
    return React.useContext(WorkspaceContext).getCurrentWorkspaceUrlPrefix();
};

export const useGetCurrentWorkspaceId = () => {
    return React.useContext(WorkspaceContext).selectedWorkspaceId;
};

/**
 * Get the full workspace context including type-safe route builders
 */
export const useWorkspaceContext = () => {
    return React.useContext(WorkspaceContext);
};

/**
 * Get type-safe workspace route builders
 * @example
 * const routes = useRoutes();
 * <Link to={routes.articles()}>Articles</Link>
 * <Link to={routes.articleEdit('123')}>Edit</Link>
 */
export const useRoutes = () => {
    return React.useContext(WorkspaceContext).routes;
};
