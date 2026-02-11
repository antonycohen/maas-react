# MAAS React Frontend Audit Report

**Date:** 2026-02-11
**React Version:** 19.2.3
**TypeScript Version:** 5.9.3 (strict mode)
**Total Component Files (.tsx):** 377
**Total API Endpoints:** 19 endpoint classes
**Total Entity Models:** 20 domains in `core-api-models`

---

## Executive Summary

The maas-react monorepo demonstrates **strong architectural foundations** — well-organized package layers, centralized route definitions, typed API endpoints, and consistent Zod schema patterns. The core infrastructure (`core-api`, `core-routes`, `core-api-models`) is well-designed and follows consistent conventions.

However, the audit uncovered **several critical issues** that warrant immediate attention: (1) **XSS vulnerabilities** from 13 instances of `dangerouslySetInnerHTML` without sanitization and `rehypeRaw` rendering unsanitized markdown HTML, (2) **silent error swallowing** in the Collection component and API request interceptor that hides failures from users, (3) **staleTime: Infinity** set globally without a comprehensive invalidation strategy, and (4) a **token refresh lock race condition** across browser tabs.

**Top 5 Priorities:**

1. Sanitize all `dangerouslySetInnerHTML` and markdown HTML rendering (XSS risk)
2. Surface errors in `useCollectionQuery` instead of silently returning empty arrays
3. Remove debug `console.log` from `token-manager.ts` (leaks token data)
4. Add `React.lazy()` code splitting for feature routes (zero code splitting currently)
5. Centralize hardcoded pricing URLs into `core-routes`

---

## Entity Coverage Report

| Entity             | Type File                               | Complete?     | Zod Schemas                                      | Issues                                                                                       |
| ------------------ | --------------------------------------- | ------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| User               | `users/models.ts`                       | ✅ Full       | Ref, ReadRef, Read, Create, UpdateInfo + 4 more  | —                                                                                            |
| Customer           | `customer/models.ts`                    | ✅ Full       | Ref, ReadRef, Read, Create, Update               | —                                                                                            |
| Organization       | `organizations/models.ts`               | ✅ Full       | Ref, ReadRef, Read, Create, Update               | —                                                                                            |
| OrganizationMember | `organization-members/models.ts`        | ✅ Full       | Ref, ReadRef, Read, Create, UpdateRole, Invite   | —                                                                                            |
| Article            | `article/models.ts`                     | ✅ Full       | Ref, ReadRef, Read, Create, Update + Video, Tag  | —                                                                                            |
| ArticleType        | `article-type/models.ts`                | ✅ Full       | Ref, ReadRef, Read, Create, Update + Field types | —                                                                                            |
| Issue              | `issue/models.ts`                       | ✅ Full       | Ref, ReadRef, Read, Create, Update + FolderRef   | —                                                                                            |
| Folder             | `folder/models.ts`                      | ⚠️ Partial    | ReadRef, Read, Create, Update                    | Folder type uses manual TS (`type Folder = {...}`) instead of Zod inference — mixed approach |
| Brand              | `brand/models.ts`                       | ✅ Full       | ReadRef, Read, Create, Update                    | —                                                                                            |
| Category           | `category/models.ts`                    | ⚠️ Partial    | ReadRef, Read, Create, Update                    | `Category` type uses `z.infer<> & { children }` — recursive, understandable                  |
| Plan               | `plan/models.ts`                        | ✅ Full       | Ref, Read, Create, Update                        | —                                                                                            |
| Product            | `product/models.ts`                     | ✅ Full       | Ref, Read, Create, Update                        | —                                                                                            |
| Price              | `price/models.ts`                       | ✅ Full       | Ref, Read, Create, Update                        | —                                                                                            |
| Feature            | `feature/models.ts`                     | ✅ Full       | Ref, Read, Create, Update + ProductFeature       | —                                                                                            |
| Subscription       | `subscription/models.ts`                | ⚠️ Partial    | Read only                                        | Missing: Ref, Create, Update schemas — read-only entity from Stripe                          |
| Invoice            | `invoice/models.ts`                     | ⚠️ Partial    | Read, LineItem, ListResponse, PayResponse        | Missing: Ref schemas — read-only entity from Stripe                                          |
| Quota              | `quota/models.ts`                       | ⚠️ Partial    | Read only                                        | Missing: Ref, Create, Update — read-only entity                                              |
| Enum               | `enum/models.ts`                        | ✅ Full       | Ref, ReadRef, Read, Create, Update               | —                                                                                            |
| Address            | `address/models.ts`                     | ⚠️ Partial    | Read, Create                                     | Missing: Update, Ref schemas                                                                 |
| Reaction           | `reaction/models.ts`                    | ❌ Manual     | None                                             | Manual TS type, no Zod schema                                                                |
| FeedActivity       | `feed/models.ts`                        | ❌ Manual     | None                                             | Manual TS type, no Zod schema                                                                |
| Post               | `post/models.ts`                        | ❌ Manual     | None                                             | Manual TS type, no Zod schema                                                                |
| ApiError           | `api-error/models.ts`                   | ❌ Manual     | None                                             | Manual TS type (acceptable for error type)                                                   |
| CMS Blocks         | `cms/blocks/*.ts`                       | ⚠️ Interfaces | None                                             | Uses TypeScript interfaces, no Zod — acceptable for CMS                                      |
| Image/Document     | `image/models.ts`, `document/models.ts` | ⚠️ Partial    | Read, Update (Image)                             | Missing: Create, Ref schemas                                                                 |

---

## URL Typing Report

| URL Pattern                      | File(s)                                         | Typed? | Centralized? | Fix                                             |
| -------------------------------- | ----------------------------------------------- | ------ | ------------ | ----------------------------------------------- |
| `/api/v1/users`                  | `endpoints/users.ts`                            | ✅     | ✅           | —                                               |
| `/api/v1/organizations`          | `endpoints/organizations.ts`                    | ✅     | ✅           | —                                               |
| `/api/v1/pms/customers`          | `endpoints/customers.ts`                        | ✅     | ✅           | —                                               |
| `/api/v1/pms/subscriptions`      | `endpoints/subscriptions.ts`                    | ✅     | ✅           | —                                               |
| `/api/v1/pms/invoices`           | `endpoints/invoices.ts`                         | ✅     | ✅           | —                                               |
| `/api/v1/pms/checkout-sessions`  | `endpoints/checkout-sessions.ts`                | ✅     | ✅           | —                                               |
| `/api/v1/pms/plans`              | `endpoints/plans.ts`                            | ✅     | ✅           | —                                               |
| `/api/v1/pms/products`           | `endpoints/products.ts`                         | ✅     | ✅           | —                                               |
| `/api/v1/pms/prices`             | `endpoints/prices.ts`                           | ✅     | ✅           | —                                               |
| `/api/v1/pms/features`           | `endpoints/features.ts`                         | ✅     | ✅           | —                                               |
| `/api/v1/articles`               | `endpoints/articles.ts`                         | ✅     | ✅           | —                                               |
| `/api/v1/magazine/issues`        | `endpoints/issues.ts`                           | ✅     | ✅           | —                                               |
| `/api/v1/magazine/folders`       | `endpoints/folders.ts`                          | ✅     | ✅           | —                                               |
| `/api/v1/magazine/categories`    | `endpoints/categories.ts`                       | ✅     | ✅           | —                                               |
| `/api/v1/magazine/brands`        | `endpoints/brands.ts`                           | ✅     | ✅           | —                                               |
| `/api/v1/magazine/article-types` | `endpoints/article-types.ts`                    | ✅     | ✅           | —                                               |
| `/api/v1/enums`                  | `endpoints/enums.ts`                            | ✅     | ✅           | —                                               |
| `/api/v1/pms/portal-sessions`    | `endpoints/portal-sessions.ts`                  | ✅     | ✅           | —                                               |
| `/pricing/auth`                  | 7 pricing files                                 | ❌     | ❌           | Create pricing route constants in `core-routes` |
| `/pricing/paiement`              | 7 pricing files                                 | ❌     | ❌           | Create pricing route constants in `core-routes` |
| `/pricing/checkout/success`      | `pricing-address-step.tsx`                      | ❌     | ❌           | Move to route builder                           |
| `/pricing/checkout/cancel`       | `pricing-address-step.tsx`                      | ❌     | ❌           | Move to route builder                           |
| `/users/:id`                     | `use-users-list-columns.tsx`                    | ❌     | ❌           | Use `routes.userEdit(id)`                       |
| `/logout`                        | `account-sidebar.tsx`, `account-mobile-nav.tsx` | ❌     | ⚠️           | Use `usePublicRoutes().logout`                  |
| `/admin/w/:orgId/pms/invoices`   | `core-routes/routes.ts`                         | ✅     | ✅           | **Dead route** — defined but never mounted      |

---

## Critical Findings

### [CRIT-001] XSS via dangerouslySetInnerHTML Without Sanitization

- **Location:** 13 instances across `packages/web-cms-editor/src/lib/components/cms/blocks/`
- **Category:** Security
- **Files affected:**
    - `paragraph-block.tsx:11` — `dangerouslySetInnerHTML={{ __html: block.data.text }}`
    - `image-and-text-block.tsx:40` — `dangerouslySetInnerHTML={{ __html: block.data.text }}`
    - `highlight-block.tsx:20` — `dangerouslySetInnerHTML={{ __html: element.content }}`
    - `quotes-block.tsx:28` — `dangerouslySetInnerHTML={{ __html: ... }}`
    - `card-event-block.tsx:44,49` — `dangerouslySetInnerHTML={{ __html: description }}`
    - `html-block.tsx:37` — `dangerouslySetInnerHTML={{ __html: block.data.html }}`
    - `card-block.tsx:23` — `dangerouslySetInnerHTML={{ __html: description }}`
    - `list-block.tsx:42` — `dangerouslySetInnerHTML={{ __html: listElement }}`
    - `equation-plugin.tsx:314,566` — KaTeX HTML output
    - `equation-component.tsx:127` — KaTeX HTML output
- **Description:** CMS block content is rendered as raw HTML without any sanitization library (no DOMPurify or equivalent). If CMS content comes from user input or API, it can execute arbitrary scripts.
- **Risk:** Stored XSS — attackers could inject scripts via CMS content that execute for all users viewing the page.
- **Fix:** Add `DOMPurify.sanitize()` before all `dangerouslySetInnerHTML` usage. For KaTeX, the output is from a trusted renderer but should still be sandboxed.

### [CRIT-002] XSS via rehypeRaw in Markdown Rendering

- **Location:** `packages/web-feature-feeds/src/lib/feed-page/browser-page.tsx:516`
- **Category:** Security
- **Description:** `rehypeRaw` plugin renders raw HTML embedded in markdown content without sanitization. Combined with `remarkGfm` and `remarkMath`, this allows embedded `<script>` tags or event handlers in markdown to execute.
- **Risk:** If markdown content comes from external sources (API, user uploads), arbitrary JavaScript execution is possible.
- **Fix:** Replace `rehypeRaw` with `rehype-sanitize` or add `rehype-sanitize` after `rehypeRaw` in the plugin chain.

### [CRIT-003] Collection Component Silently Swallows Errors

- **Location:** `packages/web-collection/src/lib/hooks/use-collection-query.ts:96-103`
- **Category:** API Integration
- **Description:** `useCollectionQuery` only destructures `data` from the query result — `error`, `isError`, and `isLoading` are never extracted. When an API call fails, the component renders an empty table (shows "No results") instead of an error message. Users cannot distinguish between "no data" and "failed to load."
- **Risk:** Data loading failures are invisible to users. Critical for admin pages where data availability matters.
- **Fix:** Destructure `error` and `isError` from `useQueryFn`. Return them from the hook. Display error state in `Collection` component.

### [CRIT-004] Silent Authentication Error in Request Interceptor

- **Location:** `packages/core-api/src/lib/api-client/api-client.ts:49-58`
- **Category:** API Integration / Security
- **Description:** The request interceptor's catch block silently swallows token retrieval errors and continues the request without an Authorization header. Protected endpoints will return 401, but the root cause (failed token retrieval) is hidden.
- **Risk:** Silent authentication failures. Users may experience mysterious 401 errors on protected endpoints.
- **Fix:** Differentiate between "no token needed" (public routes) and "token retrieval failed" (auth error). For protected endpoints, propagate the error instead of continuing without auth.

### [CRIT-005] Token Refresh Lock Race Condition

- **Location:** `packages/core-api/src/lib/api-client/token-manager.ts:25-43`
- **Category:** Security / API Integration
- **Description:** The `acquireLock()` method reads localStorage, then writes, then reads again to verify — this is not atomic. Two tabs can read the same value before either writes. The `lockId` variable is generated but never compared against the stored lock. The 10-second timeout can expire while a refresh is in-flight.
- **Risk:** Multiple concurrent token refresh requests across tabs, leading to race conditions or token invalidation.
- **Fix:** Use `BroadcastChannel` API for cross-tab coordination, or implement a proper compare-and-swap pattern.

### [CRIT-006] Debug console.log Leaking Token Expiration Data

- **Location:** `packages/core-api/src/lib/api-client/token-manager.ts:57-60`
- **Category:** Security / Code Quality
- **Description:** Three `console.log` statements in `isTokenValid()` output the current date, token expiration date, and validity status. This method is called on every authenticated request.
- **Risk:** Token expiration data leaks to browser console in production. Performance overhead from frequent logging.
- **Fix:** Remove all three `console.log` statements immediately.

### [CRIT-007] Global staleTime: Infinity Without Comprehensive Invalidation

- **Location:** `apps/maas-app/src/app/app.tsx:15`
- **Category:** API Integration
- **Description:** All TanStack Query queries default to `staleTime: Infinity`, meaning data is never automatically refetched. While mutations invalidate related queries on success, if any invalidation is missed, data remains stale indefinitely. There's no fallback re-fetch mechanism.
- **Risk:** Users may see outdated data if cache invalidation is incomplete (e.g., another user modifies data, or a mutation handler forgets to invalidate).
- **Fix:** Reduce default `staleTime` to 5 minutes (`5 * 60 * 1000`) and use `staleTime: Infinity` explicitly only for truly static data.

---

## Medium Findings

### [MED-001] Hardcoded URLs in Pricing Feature (7+ files)

- **Location:** `packages/web-feature-pricing/src/lib/` — multiple page/component files
- **Category:** URL / Route Typing
- **Description:** The pricing flow uses hardcoded strings like `navigate('/pricing/paiement')`, `navigate('/pricing/auth')`, `localStorage.setItem('target-url', '/pricing/paiement')` instead of route builders from `core-routes`.
- **Risk:** Brittle — changing pricing URL structure requires updating 7+ files.
- **Fix:** Add pricing route constants to `core-routes` and create `usePricingRoutes()` hook.

### [MED-002] Dead PMS Invoice Routes

- **Location:** `packages/core-routes/src/lib/routes.ts:202-203`, `route-builders.ts:133-134`
- **Category:** URL / Route Typing
- **Description:** `PMS_INVOICES`, `PMS_INVOICES_WILDCARD`, and builder functions `pmsInvoices()` / `pmsInvoiceView()` are defined but never mounted in `workspace-routes.tsx`. No `InvoicesRoutes` component exists for PMS admin.
- **Risk:** Dead code; confusing for developers who expect these routes to work.
- **Fix:** Either implement and mount PMS InvoicesRoutes or remove dead route definitions.

### [MED-003] No React.lazy() Code Splitting

- **Location:** Entire application — zero `React.lazy()` usage found
- **Category:** Performance
- **Description:** All feature routes are statically imported. The entire app bundle includes all features (pricing, magazine, PMS, users, settings, feeds, etc.) even if the user only visits one page.
- **Risk:** Large initial bundle size; slow first page load, especially on mobile.
- **Fix:** Wrap feature route components with `React.lazy()` and `<Suspense>` in `root-routes.tsx` and `workspace-routes.tsx`.

### [MED-004] God Components Exceeding 500 Lines

- **Location:** Multiple files
- **Category:** Architecture
- **Description:**
    - `web-components/src/lib/pro-blocks/navbar.tsx` — **1127 lines**, ~500 lines of hardcoded nav data
    - `web-components/src/lib/ui/sidebar.tsx` — **723 lines**, mixes provider/context/mobile/desktop/keyboard
    - `web-feature-feeds/src/lib/feed-page/browser-page.tsx` — **607 lines**, file upload + state + markdown + 3-panel layout
    - `web-form/src/lib/inputs/controlled-token-input.tsx` — **555 lines**, complex token input state
    - `web-feature-pms/src/lib/wizard/pages/create-plan-wizard-page.tsx` — **544 lines**, 10+ useState calls, multi-step wizard
- **Risk:** Hard to maintain, test, and debug. Violates single responsibility principle.
- **Fix:** Extract data to config files, split sub-components, use useReducer for wizard state.

### [MED-005] Missing Error Boundaries

- **Location:** Entire application — only 1 file references `ErrorBoundary` (`rich-text-editor.tsx`)
- **Category:** Architecture
- **Description:** No error boundaries protect major page sections. A rendering error in any child component crashes the entire page. Critical pages (magazine editor, feed browser, plan wizard, data tables) have no fallback UI.
- **Risk:** Poor user experience — white screens on any rendering error.
- **Fix:** Add error boundaries at page level and around complex interactive sections (tables, drag-drop, editors).

### [MED-006] `any` Type Usage (22+ occurrences)

- **Location:** Multiple files across packages
- **Category:** Entity / Types
- **Description:**
    - 8 query hooks use `params as any` to bypass type checking: `use-get-issues.ts:13`, `use-get-products.ts:13`, `use-get-prices.ts:11`, `use-get-customers.ts:13`, `use-get-features.ts:13`, `use-get-subscriptions.ts:13`, `use-get-plans.ts:11`, `use-get-articles.ts:13`
    - CMS editor context uses `any`: `editor-provider.tsx:22`, `editor-context.ts:8`
    - Pricing data uses `[key: string]: any`: `use-pricing-data.ts:34`
    - Case converter uses `any`: `case-converter.ts:21,25,48,52`
    - Dynamic custom fields: `createConnectedInputHelpers<any>()` at `dynamic-custom-fields.tsx:36`
- **Risk:** Type safety bypassed; potential runtime errors undetectable by TypeScript.
- **Fix:** Create proper generic types for query params; type the CMS editor context.

### [MED-007] Auth Cookies Missing HttpOnly Flag

- **Location:** `packages/core-store-oauth/src/lib/utils/cookie-storage.ts:30-32`
- **Category:** Security
- **Description:** OAuth tokens are stored in cookies with `SameSite=Lax` and conditional `Secure`, but without `HttpOnly`. This means tokens are accessible to JavaScript (`document.cookie`), increasing XSS attack surface. Note: `HttpOnly` cannot be set from JavaScript — this requires backend cooperation.
- **Risk:** If XSS is exploited (see CRIT-001/002), tokens can be stolen via `document.cookie`.
- **Fix:** Move token cookie management to the backend (Set-Cookie response header with HttpOnly). Or accept the risk given the client-side OAuth flow, but prioritize fixing XSS vectors first.

### [MED-008] Prop Drilling in Issue Organizer

- **Location:** `packages/web-feature-magazine/src/lib/issues/pages/edit-issue-manager-page/tabs/issue-organizer-tab/components/`
- **Category:** Architecture
- **Description:** Props drilled through 3+ levels: `issue-organizer-tab` → `folders-panel` → `folder-section` → `article-item`. 8 props passed at top, 6 drilled to children.
- **Risk:** Hard to maintain; every change to prop shape requires updating multiple components.
- **Fix:** Create `IssueOrganizerContext` with React Context.

### [MED-009] Dual Date Libraries

- **Location:** `package.json` — both `dayjs` (^1.11.19) and `date-fns` (^4.1.0) installed
- **Category:** Code Quality
- **Description:** Two competing date manipulation libraries are in dependencies. This increases bundle size and creates inconsistent date handling patterns.
- **Risk:** Larger bundle; developer confusion about which library to use.
- **Fix:** Standardize on one library (prefer `date-fns` for tree-shaking) and remove the other.

### [MED-010] key={index} Anti-Pattern

- **Location:** 20+ instances across packages
- **Category:** Code Quality / Performance
- **Description:** Array indices used as React keys in lists that may be reordered or filtered:
    - `web-feature-feeds/src/lib/nodes/http-request-node.tsx:118`
    - `web-feature-home/src/lib/pages/article-details-page/components/` (3 files)
    - `web-feature-pms/src/lib/wizard/pages/create-plan-wizard-page.tsx` (3 instances)
    - `web-feature-pricing/src/lib/components/` (2 files)
    - `web-cms-editor/src/lib/` (8+ files)
- **Risk:** Incorrect reconciliation when items are reordered, added, or removed.
- **Fix:** Use stable identifiers (item IDs, slugs) instead of array indices.

### [MED-011] Cookie RemoveItem Missing Domain

- **Location:** `packages/core-store-oauth/src/lib/utils/cookie-storage.ts:37-39`
- **Category:** Security
- **Description:** `removeItem` sets an expired cookie without the `domain` parameter, while `setItem` uses `domain=${domain}`. The removal may not target the correct cookie if it was set with a domain scope.
- **Risk:** Auth cookies may not be properly cleared on logout.
- **Fix:** Add `domain=${domain}` to the `removeItem` cookie string.

### [MED-012] Missing Mutations onError in Payment Flows

- **Location:** `packages/core-api/src/lib/queries/checkout-sessions/`, `packages/core-api/src/lib/queries/portal-sessions/`
- **Category:** API Integration
- **Description:** Checkout session and portal session mutations have no default `onError` callback. Payment-related errors depend entirely on the consumer component to handle.
- **Risk:** Payment errors could go unhandled, leaving users confused after failed payments.
- **Fix:** Add default `onError` with toast notification, allow override via options.

---

## Statistics

| Category        | Critical | Medium | Total  |
| --------------- | -------- | ------ | ------ |
| Security        | 3        | 2      | 5      |
| API Integration | 3        | 2      | 5      |
| URL / Routes    | 1        | 2      | 3      |
| Architecture    | 0        | 3      | 3      |
| Entity / Types  | 0        | 1      | 1      |
| Code Quality    | 0        | 2      | 2      |
| Performance     | 0        | 1      | 1      |
| **Total**       | **7**    | **12** | **19** |
