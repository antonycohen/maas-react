# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kodd is an Nx-based React monorepo with Vite, TypeScript, and Tailwind CSS. The workspace uses pnpm for package management.

## Commands

### Development

```bash
npx nx dev @maas/maas-app        # Start dev server on port 4200
npx nx serve @maas/maas-app      # Alternative dev server command
```

### Build & Preview

```bash
npx nx build @maas/maas-app      # Production build
npx nx preview @maas/maas-app    # Preview production build
```

### Testing

```bash
npx nx test @maas/maas-app       # Run tests with Vitest
npx nx test @maas/maas-app --coverage  # Run tests with coverage
npx nx test <package-name>       # Run tests for specific package
```

### Code Quality

```bash
npx nx lint @maas/maas-app       # Run ESLint
npx nx typecheck @maas/maas-app  # Run TypeScript type checking
npx nx typecheck <package-name>  # Type check specific package
```

### Workspace Management

```bash
npx nx show projects                    # List all projects
npx nx show project @maas/maas-app      # Show specific project configuration
npx nx graph                            # Visualize project dependencies
npx nx sync                             # Sync workspace configuration
```

## Architecture

### Workspace Structure

The monorepo is organized into three main directories:

- **`apps/maas-app/`** - Main React application entry point
- **`packages/`** - Shared libraries organized by domain and purpose
- **`tools/`** - Custom Nx plugins and build tools

### Package Organization

Packages follow a naming convention that indicates their purpose:

#### Core Packages (`core-*`)

Backend-agnostic business logic and state management:

- `core-api` - API client implementation with endpoint definitions
- `core-api-models` - Shared TypeScript types and models
- `core-store-oauth` - OAuth state management using Zustand with cookie persistence
- `core-store-session` - Session management, user context, and protected route components
- `core-utils` - Shared utility functions

#### Web Packages (`web-*`)

Frontend-specific UI components and features:

- `web-components` - Reusable UI components (built with Radix UI and shadcn/ui patterns)
- `web-layout` - Application layout components (shell, sidebar, navigation)
- `web-themes` - Tailwind theme configuration and CSS variables
- `web-form` - Form components and utilities
- `web-collection` - Data collection/table components

#### Feature Packages (`web-feature-*`)

Self-contained feature modules with routes, pages, and components:

- `web-feature-login` - Authentication flows and login pages
- `web-feature-settings` - User account management
- `web-feature-users` - User management and administration
- `web-feature-feeds` - Feed/dashboard features

Each feature package exports a `*Routes` component (e.g., `LoginRoutes`, `UsersRoutes`) that defines its routing structure.

### Application Architecture

#### Routing Structure

The app uses a hierarchical routing system:

1. **`apps/maas-app/src/app/routes/root-routes.tsx`** - Top-level router that splits between:
    - `/login/*` → `LoginRoutes` (public)
    - `/*` → `ProtectedRoutes` (requires authentication)

2. **Protected routes** wrap authenticated pages with:
    - `ProtectedPage` component - Checks for OAuth access token, redirects to `/login` if missing
    - `Layout` component - Provides navigation shell with sidebar and header
    - Feature-specific routes mounted at different paths (`/account/*`, `/users/*`, `/`)

3. **Feature Routes** - Each `web-feature-*` package exports a `*Routes` component containing its internal routing using React Router's nested `<Routes>` and `<Route>` components.

#### State Management

- **Zustand stores** for global state (OAuth tokens, session data)
- Stores use `persist` middleware with custom cookie storage for cross-tab synchronization
- **TanStack Query** for server state management with `staleTime: Infinity` default
- Query hooks are colocated with API client in `core-api/lib/queries/*`

#### Authentication Flow

1. User accesses protected route → `ProtectedPage` checks `accessToken` from `useOAuthStore`
2. No token → redirects to `/login`, stores target URL in localStorage
3. Login flow → OAuth authentication → tokens stored in `core-store-oauth`
4. After login → redirect to stored target URL or home

#### API Client Pattern

`core-api` exports a singleton `maasApi` instance with endpoint methods:

- Base URL from `VITE_API_URL` environment variable
- Endpoint classes (e.g., `UsersEndpoint`) encapsulate API calls
- Custom hooks wrap API calls with TanStack Query (e.g., `useGetUsers`, `useGetUserById`)

### Key Configuration Files

- **`nx.json`** - Nx workspace configuration with plugin setup and target defaults
- **`tsconfig.base.json`** - TypeScript path mappings: `@maas/*` → `packages/*/src/index.ts`
- **`apps/maas-app/.env`** - Environment variables for API URL and OAuth client ID
- **`apps/maas-app/src/styles.css`** - Global styles with `@source` directives listing all packages for Tailwind

### Technology Stack

- React 19 with TypeScript (strict mode)
- React Router v7 for routing
- Vite 7 for building and dev server
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- TanStack Query v5 for server state
- Zustand v5 for client state
- Radix UI primitives for accessible components
- Vitest for testing
- ESLint with TypeScript rules
- Nx 22 for monorepo orchestration

### Tailwind Integration

The custom `@maas/tailwind-sync-plugin` automatically updates `@source` directives in `apps/maas-app/src/styles.css` to include all packages. This ensures Tailwind scans all components for utility classes. The plugin runs via `npx nx sync`.

### Creating New Packages

#### Feature Package

```bash
npx nx g @nx/react:lib web-feature-<name> \
    --directory=packages/web-feature-<name> \
    --importPath=@maas/web-feature-<name> \
    --bundler=none \
    --unitTestRunner=none \
    --linter=eslint
```

#### Core Package

```bash
npx nx g @nx/react:lib core-<name> \
    --directory=packages/core-<name> \
    --importPath=@maas/core-<name> \
    --bundler=none \
    --unitTestRunner=none \
    --linter=eslint
```

After creating a package:

1. Add to `@source` list in `apps/maas-app/src/styles.css` if it contains styled components
2. Run `npx nx sync` to update Tailwind configuration
3. Export main modules from `packages/<name>/src/index.ts`

---

## Entity/Type Inventory (Audit: 2026-02-11)

All entity models are defined in `packages/core-api-models/src/lib/`. Each entity domain has its own directory with `models.ts` (Zod schemas + inferred types) and `shapes.ts` (reusable Zod shape objects).

| Entity             | Source File                             | Schemas                                                                                                      |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| User               | `users/models.ts`                       | Ref, ReadRef, Read, Create, UpdateInfo, ChangeEmail, ChangePassword, UpdateLocalization, UpdateNotifications |
| Customer           | `customer/models.ts`                    | Ref, ReadRef, Read, Create, Update                                                                           |
| Organization       | `organizations/models.ts`               | Ref, ReadRef, Read, Create, Update                                                                           |
| OrganizationMember | `organization-members/models.ts`        | Ref, ReadRef, Read, Create, UpdateRole, Invite                                                               |
| Article            | `article/models.ts`                     | Ref, ReadRef, Read, Create, Update, Video, Tag, CustomFields                                                 |
| ArticleType        | `article-type/models.ts`                | Ref, ReadRef, Read, Create, Update, Field, FieldInput                                                        |
| Issue              | `issue/models.ts`                       | ReadRef, Read, Create, Update, FolderRef                                                                     |
| Folder             | `folder/models.ts`                      | ReadRef, Read (manual + Zod), Create, Update                                                                 |
| Brand              | `brand/models.ts`                       | ReadRef, Read, Create, Update                                                                                |
| Category           | `category/models.ts`                    | ReadRef, Read (recursive), Create, Update                                                                    |
| Plan               | `plan/models.ts`                        | Ref, Read, Create, Update                                                                                    |
| Product            | `product/models.ts`                     | Ref, Read, Create, Update                                                                                    |
| Price              | `price/models.ts`                       | Ref, Read, Create, Update                                                                                    |
| Feature            | `feature/models.ts`                     | Ref, Read, Create, Update, ProductFeature                                                                    |
| Subscription       | `subscription/models.ts`                | Read only (from Stripe)                                                                                      |
| Invoice            | `invoice/models.ts`                     | Read, LineItem, ListResponse, PayResponse                                                                    |
| Quota              | `quota/models.ts`                       | Read only                                                                                                    |
| Enum               | `enum/models.ts`                        | Ref, ReadRef, Read, Create, Update                                                                           |
| Address            | `address/models.ts`                     | Read, Create                                                                                                 |
| Image/Document     | `image/models.ts`, `document/models.ts` | Read, Update (partial)                                                                                       |
| CMS Blocks         | `cms/blocks/*.ts`                       | TypeScript interfaces (no Zod)                                                                               |

## API Route Registry (Audit: 2026-02-11)

All API endpoints are defined in `packages/core-api/src/lib/endpoints/`. The singleton `maasApi` instance in `api.ts` aggregates all endpoint classes.

| Endpoint Class              | Base Path                              | Methods                                                                                                             |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| UsersEndpoint               | `/api/v1/users`                        | getUsers, getUserById, createUser, updateUser, changeEmail, changePassword, updateLocalization, updateNotifications |
| OrganizationsEndpoint       | `/api/v1/organizations`                | getOrganizations, getOrganizationById, createOrganization, updateOrganization                                       |
| OrganizationMembersEndpoint | `/api/v1/organizations/:orgId/members` | getMembers, invite, updateRole                                                                                      |
| CustomersEndpoint           | `/api/v1/pms/customers`                | getCustomers, getCustomerById, createCustomer, updateCustomer, getQuotas                                            |
| SubscriptionsEndpoint       | `/api/v1/pms/subscriptions`            | getSubscriptions                                                                                                    |
| InvoicesEndpoint            | `/api/v1/pms/invoices`                 | getInvoices, payInvoice                                                                                             |
| CheckoutSessionsEndpoint    | `/api/v1/pms/checkout-sessions`        | create                                                                                                              |
| PlansEndpoint               | `/api/v1/pms/plans`                    | getPlans, getPlanById, createPlan, updatePlan, deletePlan                                                           |
| ProductsEndpoint            | `/api/v1/pms/products`                 | getProducts, getProductById, createProduct, updateProduct                                                           |
| PricesEndpoint              | `/api/v1/pms/prices`                   | getPrices, getPriceById, createPrice, updatePrice                                                                   |
| FeaturesEndpoint            | `/api/v1/pms/features`                 | getFeatures, getFeatureById, createFeature, updateFeature                                                           |
| PortalSessionsEndpoint      | `/api/v1/pms/portal-sessions`          | createPaymentMethodUpdate, createSubscriptionUpdate                                                                 |
| ArticlesEndpoint            | `/api/v1/articles`                     | getArticles, getArticleById, createArticle, updateArticle, deleteArticle                                            |
| IssuesEndpoint              | `/api/v1/magazine/issues`              | getIssues, getIssueById, createIssue, updateIssue                                                                   |
| FoldersEndpoint             | `/api/v1/magazine/folders`             | getFolders, getFolderById, createFolder, updateFolder                                                               |
| CategoriesEndpoint          | `/api/v1/magazine/categories`          | getCategories, getCategoryById, createCategory, updateCategory                                                      |
| BrandsEndpoint              | `/api/v1/magazine/brands`              | getBrands, getBrandById, createBrand, updateBrand                                                                   |
| ArticleTypesEndpoint        | `/api/v1/magazine/article-types`       | getArticleTypes, getArticleTypeById, createArticleType, updateArticleType                                           |
| EnumsEndpoint               | `/api/v1/enums`                        | getEnums, getEnumById, createEnum, updateEnum                                                                       |

## Component Architecture Rules

1. **Page components** should delegate data fetching to custom hooks or `<Collection>` — avoid direct `useQuery`/`useMutation` in page JSX
2. **Use route builders** from `useWorkspaceRoutes()` or `usePublicRoutes()` — never hardcode URL strings
3. **All HTML from API/CMS** must be sanitized with DOMPurify before `dangerouslySetInnerHTML`
4. **Markdown rendering** must use `rehype-sanitize` when `rehypeRaw` is needed
5. **Error boundaries** should wrap every page-level component and complex interactive sections
6. **Feature routes** should use `React.lazy()` + `<Suspense>` for code splitting
7. **Use stable keys** (entity IDs) in lists — never `key={index}` for dynamic data
8. **Mutations** should always include `onError` callbacks, especially for payment flows

## Known Technical Debt (Audit: 2026-02-11)

### Critical (Fix Immediately)

- **XSS:** 13 `dangerouslySetInnerHTML` instances without sanitization in CMS blocks
- **XSS:** `rehypeRaw` in `browser-page.tsx` renders unsanitized HTML in markdown
- **Silent errors:** `useCollectionQuery` swallows API errors — shows empty table instead of error
- **Auth leak:** 3 `console.log` statements in `token-manager.ts` leak token data to console
- **Auth:** Silent catch in `api-client.ts:54` swallows token errors on protected endpoints
- **Auth:** Token refresh lock race condition in `token-manager.ts:25-43`
- **Data:** `staleTime: Infinity` globally without comprehensive invalidation in `app.tsx:15`

### Medium (Fix Soon)

- **Performance:** Zero `React.lazy()` code splitting — entire app in one bundle
- **Routes:** 7+ hardcoded URLs in pricing feature — needs route constants
- **Routes:** Dead PMS invoice routes defined but never mounted
- **Types:** 8 query hooks use `params as any` — needs typed params
- **Security:** Auth cookies missing HttpOnly flag (requires backend changes)
- **Security:** Cookie `removeItem` missing domain parameter
- **Architecture:** God components >500 lines (navbar 1127, sidebar 723, browser-page 607)
- **Architecture:** Prop drilling in issue organizer (3+ levels)
- **Architecture:** Missing error boundaries on all major pages
- **Quality:** Dual date libraries (dayjs + date-fns)
- **Quality:** 20+ `key={index}` anti-pattern instances

## Security Checklist for Development

When writing new features, verify:

- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitization
- [ ] No `rehypeRaw` without `rehype-sanitize`
- [ ] All mutation hooks have `onError` callbacks
- [ ] Route URLs use builders from `core-routes`, not hardcoded strings
- [ ] Collection/query components handle error states visually
- [ ] List rendering uses stable keys (IDs), not array indices
- [ ] No `console.log` left in production code
- [ ] No `any` types — use proper generics or `unknown`
