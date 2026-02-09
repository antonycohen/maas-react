import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AdminLayout } from '@maas/web-layout';
import { useConnectedUser } from '@maas/core-store-session';
import { useGetUserOrganizations } from '@maas/core-api';
import { User } from '@maas/core-api-models';
import { AccountRoutes, UsersRoutes } from '@maas/web-feature-users';
import { WorkspaceProvider, useRoutes } from '@maas/core-workspace';
import {
    ArticlesRoutes,
    ArticleTypesRoutes,
    BrandsRoutes,
    CategoriesRoutes,
    EnumsRoutes,
    FoldersRoutes,
    IssuesRoutes,
} from '@maas/web-feature-magazine';
import { TeamsRoutes } from '@maas/web-feature-organizations';
import { SettingsRoutes } from '@maas/web-feature-settings';
import {
    PlansRoutes,
    ProductsRoutes,
    PricesRoutes,
    FeaturesRoutes,
    SubscriptionsRoutes as PmsSubscriptionsRoutes,
    WizardRoutes,
} from '@maas/web-feature-pms';
import { useMainNavigation } from '../hooks/use-main-navigation';
import { useUserNavigation } from '../hooks/use-user-navigation';
import { GalleryVerticalEnd } from 'lucide-react';
import { ADMIN_ROUTES, buildWorkspaceBaseUrl } from '@maas/core-routes';

export const WorkspaceRoutes = () => {
    const connectedUser = useConnectedUser() as User;
    const organizationId = useParams().organizationId;

    const { data: results } = useGetUserOrganizations(connectedUser.id as string, {
        fields: {
            id: null,
            name: null,
        },
        offset: 0,
        limit: 100,
    });

    if (!results || results.data.length === 0) {
        return null;
    }

    if (!organizationId) {
        if (results.data.length > 0) {
            return <Navigate to={`${buildWorkspaceBaseUrl(results.data[0].id ?? '')}/`} />;
        }
        return null;
    }

    return (
        <WorkspaceProvider selectedWorkspaceId={organizationId}>
            <WorkspaceRoutesContent
                connectedUser={connectedUser}
                organizationId={organizationId}
                organizations={results.data}
            />
        </WorkspaceProvider>
    );
};

type WorkspaceRoutesContentProps = {
    connectedUser: User;
    organizationId: string;
    organizations: { id?: string | null; name?: string | null }[];
};

const WorkspaceRoutesContent = ({ connectedUser, organizationId, organizations }: WorkspaceRoutesContentProps) => {
    const routes = useRoutes();
    const mainNavigation = useMainNavigation();
    const userNavigation = useUserNavigation();

    return (
        <Routes>
            <Route
                element={
                    <AdminLayout
                        connectedUser={connectedUser}
                        mainNavigationGroups={mainNavigation}
                        navUserItems={userNavigation}
                        workspaces={{
                            selectedWorkspaceId: organizationId,
                            settingsUrl: routes.settings(),
                            workspaces: organizations?.map((org) => ({
                                name: org.name ?? 'Workspace',
                                logo: GalleryVerticalEnd,
                                id: org.id ?? '',
                                urlPrefix: `${buildWorkspaceBaseUrl(org.id ?? '')}/`,
                            })),
                        }}
                    />
                }
            >
                <Route path={ADMIN_ROUTES.ACCOUNT} element={<AccountRoutes baseUrl={routes.base} />} />
                <Route path={ADMIN_ROUTES.ISSUES_WILDCARD} element={<IssuesRoutes />} />
                <Route path={ADMIN_ROUTES.ARTICLES_WILDCARD} element={<ArticlesRoutes />} />
                <Route path={ADMIN_ROUTES.ARTICLE_TYPES_WILDCARD} element={<ArticleTypesRoutes />} />
                <Route path={ADMIN_ROUTES.CATEGORIES_WILDCARD} element={<CategoriesRoutes />} />
                <Route path={ADMIN_ROUTES.FOLDERS_WILDCARD} element={<FoldersRoutes />} />
                <Route path={ADMIN_ROUTES.ENUMS_WILDCARD} element={<EnumsRoutes />} />
                <Route path={ADMIN_ROUTES.BRANDS_WILDCARD} element={<BrandsRoutes />} />
                <Route path={ADMIN_ROUTES.USERS_WILDCARD} element={<UsersRoutes />} />
                <Route path={ADMIN_ROUTES.TEAMS_WILDCARD} element={<TeamsRoutes />} />
                <Route path={ADMIN_ROUTES.SETTINGS_WILDCARD} element={<SettingsRoutes />} />
                {/* PMS Routes */}
                <Route path={ADMIN_ROUTES.PMS_PLANS_WILDCARD} element={<PlansRoutes />} />
                <Route path={ADMIN_ROUTES.PMS_PRODUCTS_WILDCARD} element={<ProductsRoutes />} />
                <Route path={ADMIN_ROUTES.PMS_PRICES_WILDCARD} element={<PricesRoutes />} />
                <Route path={ADMIN_ROUTES.PMS_FEATURES_WILDCARD} element={<FeaturesRoutes />} />
                <Route path={ADMIN_ROUTES.PMS_SUBSCRIPTIONS_WILDCARD} element={<PmsSubscriptionsRoutes />} />
                <Route path={ADMIN_ROUTES.PMS_WIZARD} element={<WizardRoutes />} />
                <Route path="*" element={<Navigate to={routes.issues()} />} />
            </Route>
        </Routes>
    );
};
