---
name: review-architecture
description: Reviews code against the project's architectural conventions and patterns. Use when checking if code follows the established patterns, reviewing PRs, or auditing feature implementations for consistency.
argument-hint: [file-or-package-path]
---

# Review Architecture

Reviews code against the established patterns and conventions of this MAAS React monorepo.

## What to check

Given `$ARGUMENTS` (a file path, package name, or feature name), review the code against these rules:

### 1. Package Structure Rules

- **core-\*** packages must NOT import from `web-*` or `web-feature-*` packages
- **web-\*** packages can import from `core-*` and other `web-*` packages
- **web-feature-\*** packages can import from `core-*` and `web-*` packages
- All packages use `@maas/*` import paths, never relative cross-package imports
- Each package exports from `src/index.ts`
- Package `package.json` must have `"type": "module"` and direct source exports

### 2. Model Rules (core-api-models)

- Every entity should have 5 schemas: Ref, ReadRef, Read, Create, Update
- Use Zod for all validation schemas
- Types derived via `z.infer<typeof schema>`
- Create schemas have validation (`.min()`, `.max()`)
- Read schemas have nullable fields
- Export both schemas and types

### 3. API Layer Rules (core-api)

- Endpoint classes encapsulate HTTP calls
- Query hooks use TanStack Query v5
- Query keys: `['{entities}', params]` for collections, `['{entity}', id, fields]` for single items
- Mutations invalidate related queries in `onSuccess`
- All hooks follow naming: `useGet{Entities}`, `useGet{Entity}ById`, `useCreate{Entity}`, `useUpdate{Entity}`, `useDelete{Entity}`
- Export from barrel files

### 4. Route Rules

- Route constants in `core-routes/src/lib/routes.ts` (SEGMENTS, ADMIN_ROUTES, PUBLIC_ROUTES)
- Route builders in workspace routes hook
- Feature routes use `<Routes>` and `<Route>` from react-router-dom
- Admin routes are workspace-scoped: `/admin/w/:organizationId/...`
- Create mode detection: `id === 'new'`

### 5. Page Rules

**List pages must have:**

- `<LayoutBreadcrumb>` in a `<header>` tag
- `<LayoutContent>` wrapper
- `<LayoutHeader>` with `pageTitle` and `actions` (New button)
- `<Collection>` with `useLocationAsState`, `columns`, `useQueryFn`, `queryFields`
- Columns defined in a separate `use-{entities}-list-columns` hook
- Select checkbox column, data columns, actions column

**Edit pages must have:**

- `<LayoutBreadcrumb>` with navigation back to list
- `<LayoutContent>` wrapper
- `<LayoutHeader>` with dynamic title and delete action
- `FormProvider` wrapping the form
- Form hook separated: `use-edit-{entity}-form.tsx`
- Actions hook separated: `use-edit-actions.tsx`
- `createConnectedInputHelpers` for form fields
- Zod validation via `zodResolver`
- Server error handling via `handleApiError`
- Loading state: `className={cn('space-y-6 transition-opacity', isLoading && 'pointer-events-none opacity-50')}`
- Submit/Reset buttons

### 6. Styling Rules

- Tailwind CSS utility classes (no CSS modules, no styled-components)
- Formatting: singleQuote, tabWidth 4, trailingComma es5, semi, printWidth 120
- Use `cn()` from `@maas/core-utils` for conditional classes
- Icons: `@tabler/icons-react` for pages, `lucide-react` for navigation
- shadcn/ui components from `@maas/web-components`

### 7. State Management Rules

- Server state: TanStack Query (never Zustand for API data)
- Client state: Zustand with persist middleware
- Form state: react-hook-form
- URL state: `useLocationAsState` on Collection component
- No prop drilling — use context or hooks

### 8. TypeScript Rules

- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Zod schemas for runtime validation
- Generic types for reusable components
- Export types alongside components

## Output format

Provide a structured review with:

1. **Conformance**: What follows the patterns correctly
2. **Issues**: What deviates from conventions (with file:line references)
3. **Suggestions**: How to fix each issue
4. **Missing**: What's expected but absent
