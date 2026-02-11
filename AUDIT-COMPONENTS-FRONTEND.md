# MAAS React Frontend — Component-by-Component TODO

---

## Feature Area: Core API & Authentication

**Path:** `packages/core-api/`, `packages/core-store-oauth/`
**Components:** API client, token manager, OAuth store, cookie storage
**Health:** :red_circle: Critical Issues

### TODO List

- [ ] :red_circle: [CRIT-004] Remove silent catch block in `api-client.ts:54` — differentiate public vs protected endpoints
- [ ] :red_circle: [CRIT-005] Fix token refresh lock race condition in `token-manager.ts:25-43` — use BroadcastChannel or proper CAS
- [ ] :red_circle: [CRIT-006] Remove 3 `console.log` statements in `token-manager.ts:57-60`
- [ ] :red_circle: [CRIT-007] Reduce default `staleTime` from `Infinity` in `app.tsx:15`
- [ ] :yellow_circle: [MED-007] Auth cookies missing HttpOnly — require backend Set-Cookie headers
- [ ] :yellow_circle: [MED-011] Add `domain` param to `removeItem` in `cookie-storage.ts:37-39`
- [ ] :yellow_circle: [MED-012] Add default `onError` to checkout/portal mutation hooks

### `any` Type Usage in Query Hooks

| Expected Type       | Used In                       | Currently Typed As | Action                                |
| ------------------- | ----------------------------- | ------------------ | ------------------------------------- |
| Proper query params | `use-get-issues.ts:13`        | `params as any`    | Create typed `GetIssuesParams`        |
| Proper query params | `use-get-products.ts:13`      | `params as any`    | Create typed `GetProductsParams`      |
| Proper query params | `use-get-prices.ts:11`        | `params as any`    | Create typed `GetPricesParams`        |
| Proper query params | `use-get-customers.ts:13`     | `params as any`    | Create typed `GetCustomersParams`     |
| Proper query params | `use-get-features.ts:13`      | `params as any`    | Create typed `GetFeaturesParams`      |
| Proper query params | `use-get-subscriptions.ts:13` | `params as any`    | Create typed `GetSubscriptionsParams` |
| Proper query params | `use-get-plans.ts:11`         | `params as any`    | Create typed `GetPlansParams`         |
| Proper query params | `use-get-articles.ts:13`      | `params as any`    | Create typed `GetArticlesParams`      |

### Code That Doesn't Belong Here

| File                      | Issue                           | Should Be In                  |
| ------------------------- | ------------------------------- | ----------------------------- |
| `token-manager.ts:57-60`  | Debug console.log in production | Remove entirely               |
| `case-converter.ts:21,48` | Uses `any` for conversion       | Use `Record<string, unknown>` |

---

## Feature Area: Collection / Data Tables

**Path:** `packages/web-collection/`
**Components:** Collection, useCollectionQuery, CollectionToolbar, CollectionColumnHeader
**Health:** :red_circle: Critical Issues

### TODO List

- [ ] :red_circle: [CRIT-003] Destructure `error`, `isError`, `isLoading` from query in `use-collection-query.ts:96`
- [ ] :red_circle: [CRIT-003] Return error/loading states from `useCollectionQuery` hook
- [ ] :red_circle: [CRIT-003] Add error display and loading state UI to `Collection` component
- [ ] :yellow_circle: [MED-005] Add error boundary wrapper around Collection component

### Missing Error/Loading States

| Property     | Extracted? | Returned?     | UI Display? |
| ------------ | ---------- | ------------- | ----------- |
| `data`       | ✅         | ✅ (as items) | ✅          |
| `error`      | ❌         | ❌            | ❌          |
| `isError`    | ❌         | ❌            | ❌          |
| `isLoading`  | ❌         | ❌            | ❌          |
| `isFetching` | ❌         | ❌            | ❌          |

---

## Feature Area: CMS Editor & Blocks

**Path:** `packages/web-cms-editor/`
**Components:** ~30 block components, editor, plugins
**Health:** :red_circle: Critical Issues

### TODO List

- [ ] :red_circle: [CRIT-001] Add DOMPurify sanitization to all 9 `dangerouslySetInnerHTML` instances in `blocks/`
- [ ] :yellow_circle: [MED-006] Type CMS editor context — replace `context: any` in `editor-provider.tsx:22` and `editor-context.ts:8`
- [ ] :yellow_circle: [MED-010] Replace `key={index}` in `editor-tutorial.tsx:32`, `editor-contextual-panel.tsx:63,72`, `carousel-block.tsx:29`, `list-block.tsx:39`, `cards-block.tsx:12`, `quotes-block.tsx:23`, `gallery-block.tsx:32`, `highlight-block.tsx:11`

### dangerouslySetInnerHTML Instances

| File                       | Line   | Content Source                  | Sanitized? | Action        |
| -------------------------- | ------ | ------------------------------- | ---------- | ------------- |
| `paragraph-block.tsx`      | 11     | `block.data.text`               | ❌         | Add DOMPurify |
| `image-and-text-block.tsx` | 40     | `block.data.text`               | ❌         | Add DOMPurify |
| `highlight-block.tsx`      | 20     | `element.content`               | ❌         | Add DOMPurify |
| `quotes-block.tsx`         | 28     | quote text                      | ❌         | Add DOMPurify |
| `card-event-block.tsx`     | 44, 49 | `description`, `subDescription` | ❌         | Add DOMPurify |
| `html-block.tsx`           | 37     | `block.data.html`               | ❌         | Add DOMPurify |
| `card-block.tsx`           | 23     | `description`                   | ❌         | Add DOMPurify |
| `list-block.tsx`           | 42     | `listElement`                   | ❌         | Add DOMPurify |

---

## Feature Area: Pricing

**Path:** `packages/web-feature-pricing/`
**Components:** Pricing configurator, address step, auth step, payment step, checkout pages
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-001] Create pricing route constants in `core-routes`
- [ ] :yellow_circle: [MED-001] Replace all `navigate('/pricing/...')` with route builders
- [ ] :yellow_circle: [MED-001] Replace `localStorage.setItem('target-url', '/pricing/paiement')` with route constant
- [ ] :yellow_circle: [MED-006] Remove `[key: string]: any` in `use-pricing-data.ts:34`
- [ ] :yellow_circle: [MED-010] Replace `key={index}` in `pricing-bottom-section.tsx:39`, `pricing-list.tsx:134`

### Untyped URLs in This Area

| URL                         | File                       | Fix                                          |
| --------------------------- | -------------------------- | -------------------------------------------- |
| `/pricing/auth`             | Multiple pricing pages     | Add `PUBLIC_ROUTES.PRICING_AUTH`             |
| `/pricing/paiement`         | Multiple pricing pages     | Add `PUBLIC_ROUTES.PRICING_PAYMENT`          |
| `/pricing/checkout/success` | `pricing-address-step.tsx` | Add `PUBLIC_ROUTES.PRICING_CHECKOUT_SUCCESS` |
| `/pricing/checkout/cancel`  | `pricing-address-step.tsx` | Add `PUBLIC_ROUTES.PRICING_CHECKOUT_CANCEL`  |

### Code That Doesn't Belong Here

| File                       | Issue                                                  | Should Be In                                      |
| -------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| `pricing-address-step.tsx` | `validateAddress()` function                           | `packages/core-utils/src/lib/validate-address.ts` |
| `pricing-address-step.tsx` | `useCreateCheckoutSession` mutation + form state mixed | `usePricingCheckout()` hook                       |

---

## Feature Area: Feed / Browser

**Path:** `packages/web-feature-feeds/`
**Components:** browser-page, feed nodes, flow components
**Health:** :red_circle: Critical Issues

### TODO List

- [ ] :red_circle: [CRIT-002] Replace `rehypeRaw` with `rehype-sanitize` in `browser-page.tsx:516`
- [ ] :yellow_circle: [MED-004] Split 607-line `browser-page.tsx` — extract `ArticleRenderer`, `FolderTree`, `ArticleList` sub-components
- [ ] :yellow_circle: [MED-005] Add error boundary around markdown rendering section
- [ ] :yellow_circle: [MED-010] Replace `key={index}` in `http-request-node.tsx:118`, `api-entrypoint-node.tsx:110`

### Code That Doesn't Belong Here

| File               | Issue                                         | Should Be In                            |
| ------------------ | --------------------------------------------- | --------------------------------------- |
| `browser-page.tsx` | Markdown rendering with rehype/remark plugins | Separate `<MarkdownRenderer>` component |
| `browser-page.tsx` | File upload handling + state management       | `useFileUpload()` hook                  |
| `browser-page.tsx` | Article filtering logic                       | `useArticleFiltering()` hook            |

---

## Feature Area: Magazine / Issues

**Path:** `packages/web-feature-magazine/`
**Components:** Issues, articles, folders, categories, brands pages
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-008] Create `IssueOrganizerContext` to eliminate prop drilling through `folders-panel` → `folder-section` → `article-item`
- [ ] :yellow_circle: [MED-004] Review `edit-article-manager-page.tsx` (380 lines) for split opportunities
- [ ] :yellow_circle: [MED-006] Type `createConnectedInputHelpers<any>()` in `dynamic-custom-fields.tsx:36`

### Prop Drilling Chain

| Level | Component             | Props Received    | Props Drilled |
| ----- | --------------------- | ----------------- | ------------- |
| 1     | `issue-organizer-tab` | state from parent | 8 props       |
| 2     | `folders-panel`       | 8 props           | 6 props       |
| 3     | `folder-section`      | 6 props           | 5 props       |
| 4     | `article-item`        | 3 props           | —             |

---

## Feature Area: PMS (Plans, Products, Prices)

**Path:** `packages/web-feature-pms/`
**Components:** Plan wizard, subscription manager, product/price pages
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-002] Either mount PMS invoice routes in `workspace-routes.tsx` or remove dead route definitions from `core-routes`
- [ ] :yellow_circle: [MED-004] Refactor `create-plan-wizard-page.tsx` (544 lines) — extract `useCreatePlanWizard()` hook with `useReducer`
- [ ] :yellow_circle: [MED-010] Replace 3 `key={index}` instances in `create-plan-wizard-page.tsx:289,356,482`

### Code That Doesn't Belong Here

| File                          | Issue                                                                        | Should Be In                                   |
| ----------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `create-plan-wizard-page.tsx` | 10+ `useState` calls managing wizard state                                   | `useCreatePlanWizard()` hook with `useReducer` |
| `create-plan-wizard-page.tsx` | `useCreatePlan`, `useCreateProduct`, `useCreatePrice` mutation orchestration | Wizard hook                                    |

---

## Feature Area: Users & Customers

**Path:** `packages/web-feature-users/`
**Components:** User list, customer list, edit pages, account settings
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-001] Replace hardcoded `/users/${row.original.id}` link in `use-users-list-columns.tsx:55` with `routes.userEdit(id)`
- [ ] :yellow_circle: [MED-001] Replace hardcoded `/logout` in `account-sidebar.tsx:40` and `account-mobile-nav.tsx:29` with `usePublicRoutes().logout`

### Untyped URLs in This Area

| URL          | File:Line                       | Fix                            |
| ------------ | ------------------------------- | ------------------------------ |
| `/users/:id` | `use-users-list-columns.tsx:55` | Use `routes.userEdit(id)`      |
| `/logout`    | `account-sidebar.tsx:40`        | Use `usePublicRoutes().logout` |
| `/logout`    | `account-mobile-nav.tsx:29`     | Use `usePublicRoutes().logout` |

---

## Feature Area: UI Components

**Path:** `packages/web-components/`
**Components:** ~50 UI primitives, shadcn patterns, maas custom components
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-004] Split `navbar.tsx` (1127 lines) — extract navigation data to config, split sub-menu components
- [ ] :yellow_circle: [MED-004] Split `sidebar.tsx` (723 lines) — extract `SidebarProvider` to separate file, keyboard handler to hook
- [ ] :yellow_circle: [CRIT-001] Sanitize KaTeX HTML output in `equation-plugin.tsx:314,566` and `equation-component.tsx:127`

### Large File Breakdown

| File               | Lines | Suggested Split                                                                        |
| ------------------ | ----- | -------------------------------------------------------------------------------------- |
| `navbar.tsx`       | 1127  | `navbar-data.ts` (config), `solutions-menu.tsx`, `products-menu.tsx`, etc.             |
| `sidebar.tsx`      | 723   | `sidebar-provider.tsx`, `sidebar-keyboard.ts` (hook), `sidebar-*.tsx` (sub-components) |
| `color-picker.tsx` | 510   | `color-math.ts` (utilities), `color-picker.tsx` (UI only)                              |

---

## Feature Area: Forms

**Path:** `packages/web-form/`
**Components:** ~35 controlled input components
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-004] Review `controlled-token-input.tsx` (555 lines) — extract state management to `useTokenInput()` hook

---

## Feature Area: Layout

**Path:** `packages/web-layout/`
**Components:** Layout shell, header, sidebar, breadcrumbs
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-004] Review `layout-header-bar.tsx` (441 lines) for split opportunities
- [ ] :yellow_circle: [MED-005] Add error boundary at layout level to catch feature route errors

---

## Feature Area: Home / Public Pages

**Path:** `packages/web-feature-home/`
**Components:** Home page, magazine pages, article details, category pages
**Health:** :yellow_circle: Needs Improvement

### TODO List

- [ ] :yellow_circle: [MED-010] Replace `key={index}` in `subscription-cta.tsx:16`, `thematiques.tsx:26`, `authors.tsx:23`
- [ ] :yellow_circle: [MED-006] Replace `columnId: 'term' as any` in `magazines-page.tsx:101`

---

## Feature Area: Routes & Navigation

**Path:** `packages/core-routes/`, `apps/maas-app/src/app/`
**Components:** Route constants, builders, hooks, root/workspace routes
**Health:** :green_circle: Good (with minor issues)

### TODO List

- [ ] :yellow_circle: [MED-002] Remove or mount dead `PMS_INVOICES` route definitions
- [ ] :yellow_circle: [MED-002] Add missing `accountInvoices()` method to `useWorkspaceRoutes` hook
- [ ] :yellow_circle: Verify "Magazines" nav label in `use-main-navigation.tsx:43` — currently points to `routes.brands()`
- [ ] :yellow_circle: [MED-003] Add `React.lazy()` wrapping for all feature route imports in `workspace-routes.tsx` and `root-routes.tsx`

---

## Feature Area: Login / Authentication

**Path:** `packages/web-feature-login/`
**Health:** :green_circle: Good

No critical or medium issues found in this area.

---

## Feature Area: Settings

**Path:** `packages/web-feature-settings/`
**Health:** :green_circle: Good

No critical or medium issues found in this area.

---

## Feature Area: Organizations

**Path:** `packages/web-feature-organizations/`
**Health:** :green_circle: Good

Good error handling patterns found (e.g., `handleApiError` on mutation errors).

---

## Feature Area: Core Models

**Path:** `packages/core-api-models/`
**Health:** :green_circle: Good (with notes)

### Notes

- Entities following full 5-schema pattern: User, Customer, Organization, Article, Issue, Brand, Plan, Product, Price, Feature, Enum, ArticleType
- Entities with reduced schemas (acceptable — read-only from Stripe): Subscription, Invoice, Quota
- Entities using manual TS types (low priority): Reaction, Post, FeedActivity
- CMS blocks using interfaces (acceptable design choice)

---

## Cross-Cutting Issues

- [ ] :red_circle: **No DOMPurify dependency** — install `dompurify` + `@types/dompurify` for HTML sanitization across CMS blocks
- [ ] :red_circle: **No `rehype-sanitize` dependency** — install for markdown HTML sanitization
- [ ] :yellow_circle: **Dual date libraries** — standardize on `date-fns` (tree-shakeable), remove `dayjs`
- [ ] :yellow_circle: **No code splitting** — add `React.lazy()` + `<Suspense>` for all feature routes
- [ ] :yellow_circle: **Inconsistent error handling** — account/settings features use `handleApiError` pattern; pricing/feed features don't
- [ ] :yellow_circle: **20+ `key={index}` instances** — create ESLint rule to prevent this pattern
- [ ] :yellow_circle: **8 query hooks with `params as any`** — create generic typed params for collection queries
