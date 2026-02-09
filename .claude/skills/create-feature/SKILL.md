---
name: create-feature
description: Scaffolds a complete new feature module package with routes, list page, edit page, columns hook, form hooks, and action hooks. Use when the user wants to create a new admin feature, new CRUD module, or new feature package.
argument-hint: [entity-name] [plural-name]
disable-model-invocation: true
---

# Create Feature Module

You are creating a new feature module for the MAAS React monorepo. This is an Nx-based monorepo using React 19, TypeScript, Tailwind v4, TanStack Query v5, Zustand v5, and React Router v7.

## Arguments

- `$ARGUMENTS[0]` = Entity name in kebab-case (e.g., `invoice`, `notification`)
- `$ARGUMENTS[1]` = Plural name in kebab-case (e.g., `invoices`, `notifications`). If not provided, append "s" to entity name.

## Prerequisites

Before scaffolding the feature, check if the following already exist in `core-api-models`, `core-api`, and `core-routes`. If not, inform the user they need to create them first (suggest using `/create-api-entity`).

- Zod schemas in `packages/core-api-models/src/lib/{entity}/models.ts`
- Endpoint class in `packages/core-api/src/lib/endpoints/{entities}.ts`
- Query hooks in `packages/core-api/src/lib/queries/{entities}/`
- Route constants in `packages/core-routes/src/lib/routes.ts`

## Step-by-step

### 1. Generate the Nx package

```bash
npx nx g @nx/react:lib web-feature-{entities} \
    --directory=packages/web-feature-{entities} \
    --importPath=@maas/web-feature-{entities} \
    --bundler=none \
    --unitTestRunner=none \
    --linter=eslint
```

### 2. Create the folder structure

```
packages/web-feature-{entities}/src/
├── index.ts
└── lib/
    ├── routes/
    │   └── {entities}-routes.tsx
    └── pages/
        ├── list-{entities}-manager-page/
        │   ├── index.ts (barrel export)
        │   ├── {entities}-list-manager-page.tsx
        │   └── hooks/
        │       └── use-{entities}-list-columns.tsx
        └── edit-{entity}-manager-page/
            ├── index.ts (barrel export)
            ├── edit-{entity}-manager-page.tsx
            └── hooks/
                ├── use-edit-{entity}-form.tsx
                └── use-edit-actions.tsx
```

### 3. Reference patterns

Use exact patterns from existing features. Reference these files for the canonical implementation:

- **Routes**: `packages/web-feature-magazine/src/lib/enums/routes/enums-routes.tsx`
- **List page**: `packages/web-feature-magazine/src/lib/enums/pages/list-enums-manager-page/enums-list-manager-page.tsx`
- **Columns hook**: `packages/web-feature-magazine/src/lib/enums/pages/list-enums-manager-page/hooks/use-enums-list-columns.tsx`
- **Edit page**: `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/edit-enum-manager-page.tsx`
- **Form hook**: `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/hooks/use-edit-enum-form.tsx`
- **Actions hook**: `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/hooks/use-edit-actions.tsx`

### 4. Key conventions

- Use `useCurrentWorkspaceUrlPrefix()` from `@maas/core-workspace` for all URLs
- Use `useGetCurrentWorkspaceId()` for workspace ID
- Create mode is detected by `entityId === 'new'`
- Use `createConnectedInputHelpers<Entity>()` from `@maas/web-form` for form fields
- Use `zodResolver` with entity schemas from `@maas/core-api-models`
- Use `FormProvider` from `react-hook-form` to wrap forms
- Toast notifications via `toast` from `sonner`
- Icons from `@tabler/icons-react` for pages
- Page structure: `<LayoutBreadcrumb>` → `<LayoutContent>` → `<LayoutHeader>` → content
- Collection component from `@maas/web-collection` with `useLocationAsState`
- Handle API errors by mapping `error.parametersErrors` to `form.setError()`

### 5. Integration steps (after scaffolding)

After creating all files, update these integration points:

1. **Export from index.ts**: `export * from './lib/routes/{entities}-routes';`

2. **Add route constants** in `packages/core-routes/src/lib/routes.ts` (SEGMENTS and ADMIN_ROUTES)

3. **Add route builders** in `packages/core-routes/src/lib/hooks/use-workspace-routes.ts`

4. **Mount in workspace routes** in `apps/maas-app/src/app/routes/workspace-routes.tsx`:
    - Import: `import { {Entities}Routes } from '@maas/web-feature-{entities}';`
    - Route: `<Route path={ADMIN_ROUTES.{ENTITIES}_WILDCARD} element={<{Entities}Routes />} />`

5. **Add to sidebar navigation** in `apps/maas-app/src/app/hooks/use-main-navigation.tsx`

6. **Add TypeScript project reference** in `apps/maas-app/tsconfig.app.json`

7. **Run Tailwind sync**: `npx nx sync`

### 6. Run typecheck

After everything is created, run:

```bash
npx nx typecheck @maas/web-feature-{entities}
```
