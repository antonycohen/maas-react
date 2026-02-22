import { lazy, Suspense, useMemo } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router';
import { AdminLayout } from '@maas/web-layout';
import { useConnectedUser } from '@maas/core-store-session';
import { useGetUserOrganizations } from '@maas/core-api';
import { User } from '@maas/core-api-models';
import { WorkspaceProvider, useRoutes } from '@maas/core-workspace';
import { useMainNavigation } from '../hooks/use-main-navigation';
import { useUserNavigation } from '../hooks/use-user-navigation';
import { GalleryVerticalEnd } from 'lucide-react';
import { ADMIN_ROUTES, buildWorkspaceBaseUrl } from '@maas/core-routes';
import { ErrorBoundary, NotFoundPage } from '@maas/web-components';

// Feature route components — lazily loaded for code splitting
const AccountRoutes = lazy(() => import('@maas/web-feature-users').then((m) => ({ default: m.AccountRoutes })));
const UsersRoutes = lazy(() => import('@maas/web-feature-users').then((m) => ({ default: m.UsersRoutes })));
const CustomersRoutes = lazy(() => import('@maas/web-feature-users').then((m) => ({ default: m.CustomersRoutes })));

const ArticlesRoutes = lazy(() => import('@maas/web-feature-magazine').then((m) => ({ default: m.ArticlesRoutes })));
const ArticleTypesRoutes = lazy(() =>
    import('@maas/web-feature-magazine').then((m) => ({ default: m.ArticleTypesRoutes }))
);
const BrandsRoutes = lazy(() => import('@maas/web-feature-magazine').then((m) => ({ default: m.BrandsRoutes })));
const CategoriesRoutes = lazy(() =>
    import('@maas/web-feature-magazine').then((m) => ({ default: m.CategoriesRoutes }))
);
const EnumsRoutes = lazy(() => import('@maas/web-feature-magazine').then((m) => ({ default: m.EnumsRoutes })));
const FoldersRoutes = lazy(() => import('@maas/web-feature-magazine').then((m) => ({ default: m.FoldersRoutes })));
const IssuesRoutes = lazy(() => import('@maas/web-feature-magazine').then((m) => ({ default: m.IssuesRoutes })));

const DashboardRoutes = lazy(() => import('@maas/web-feature-dashboard').then((m) => ({ default: m.DashboardRoutes })));

const TeamsRoutes = lazy(() => import('@maas/web-feature-organizations').then((m) => ({ default: m.TeamsRoutes })));

const SettingsRoutes = lazy(() => import('@maas/web-feature-settings').then((m) => ({ default: m.SettingsRoutes })));

const PlansRoutes = lazy(() => import('@maas/web-feature-pms').then((m) => ({ default: m.PlansRoutes })));
const ProductsRoutes = lazy(() => import('@maas/web-feature-pms').then((m) => ({ default: m.ProductsRoutes })));
const PricesRoutes = lazy(() => import('@maas/web-feature-pms').then((m) => ({ default: m.PricesRoutes })));
const FeaturesRoutes = lazy(() => import('@maas/web-feature-pms').then((m) => ({ default: m.FeaturesRoutes })));
const PmsSubscriptionsRoutes = lazy(() =>
    import('@maas/web-feature-pms').then((m) => ({ default: m.SubscriptionsRoutes }))
);
const WizardRoutes = lazy(() => import('@maas/web-feature-pms').then((m) => ({ default: m.WizardRoutes })));

const DiffusionListsRoutes = lazy(() =>
    import('@maas/web-feature-diffusion-lists').then((m) => ({ default: m.DiffusionListsRoutes }))
);

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

    const workspaces = useMemo(
        () => ({
            selectedWorkspaceId: organizationId,
            settingsUrl: routes.settings(),
            workspaces: organizations?.map((org) => ({
                name: org.name ?? 'Workspace',
                logo: GalleryVerticalEnd,
                id: org.id ?? '',
                urlPrefix: `${buildWorkspaceBaseUrl(org.id ?? '')}/`,
            })),
        }),
        [organizationId, organizations, routes]
    );

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <div className="flex h-screen items-center justify-center">
                        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                    </div>
                }
            >
                <Routes>
                    <Route
                        element={
                            <AdminLayout
                                connectedUser={connectedUser}
                                mainNavigationGroups={mainNavigation}
                                navUserItems={userNavigation}
                                workspaces={workspaces}
                            />
                        }
                    >
                        <Route index element={<DashboardRoutes />} />
                        <Route path={ADMIN_ROUTES.ACCOUNT} element={<AccountRoutes baseUrl={routes.base} />} />
                        <Route path={ADMIN_ROUTES.ISSUES_WILDCARD} element={<IssuesRoutes />} />
                        <Route path={ADMIN_ROUTES.ARTICLES_WILDCARD} element={<ArticlesRoutes />} />
                        <Route path={ADMIN_ROUTES.ARTICLE_TYPES_WILDCARD} element={<ArticleTypesRoutes />} />
                        <Route path={ADMIN_ROUTES.CATEGORIES_WILDCARD} element={<CategoriesRoutes />} />
                        <Route path={ADMIN_ROUTES.FOLDERS_WILDCARD} element={<FoldersRoutes />} />
                        <Route path={ADMIN_ROUTES.ENUMS_WILDCARD} element={<EnumsRoutes />} />
                        <Route path={ADMIN_ROUTES.BRANDS_WILDCARD} element={<BrandsRoutes />} />
                        <Route path={ADMIN_ROUTES.CUSTOMERS_WILDCARD} element={<CustomersRoutes />} />
                        <Route path={ADMIN_ROUTES.USERS_WILDCARD} element={<UsersRoutes />} />
                        <Route path={ADMIN_ROUTES.TEAMS_WILDCARD} element={<TeamsRoutes />} />
                        <Route path={ADMIN_ROUTES.SETTINGS_WILDCARD} element={<SettingsRoutes />} />
                        <Route path={ADMIN_ROUTES.DIFFUSION_LISTS_WILDCARD} element={<DiffusionListsRoutes />} />
                        {/* PMS Routes */}
                        <Route path={ADMIN_ROUTES.PMS_PLANS_WILDCARD} element={<PlansRoutes />} />
                        <Route path={ADMIN_ROUTES.PMS_PRODUCTS_WILDCARD} element={<ProductsRoutes />} />
                        <Route path={ADMIN_ROUTES.PMS_PRICES_WILDCARD} element={<PricesRoutes />} />
                        <Route path={ADMIN_ROUTES.PMS_FEATURES_WILDCARD} element={<FeaturesRoutes />} />
                        <Route path={ADMIN_ROUTES.PMS_SUBSCRIPTIONS_WILDCARD} element={<PmsSubscriptionsRoutes />} />
                        <Route path={ADMIN_ROUTES.PMS_WIZARD} element={<WizardRoutes />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};
