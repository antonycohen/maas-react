---
name: create-admin-page
description: Creates admin pages (list + edit) inside an existing feature package. Use when adding new CRUD pages to an existing web-feature package, or when adding a new sub-domain to a multi-domain feature like web-feature-magazine or web-feature-pms.
argument-hint: [entity-name] [feature-package] [plural-name]
disable-model-invocation: true
---

# Create Admin Pages

Creates list and edit admin pages inside an existing feature package.

## Arguments

- `$ARGUMENTS[0]` = Entity name in kebab-case (e.g., `invoice`)
- `$ARGUMENTS[1]` = Target feature package (e.g., `web-feature-magazine`, `web-feature-pms`)
- `$ARGUMENTS[2]` = Plural name (optional, defaults to entity + "s")

## Prerequisites

Ensure the API layer exists first:

- Models in `@maas/core-api-models`
- Query hooks in `@maas/core-api` (useGet{Entities}, useGet{Entity}ById, useCreate{Entity}, useUpdate{Entity}, useDelete{Entity})
- Route constants in `@maas/core-routes`

If missing, suggest `/create-api-entity` first.

## Files to create

### Folder structure inside the feature package

```
packages/{feature-package}/src/lib/{entities}/
├── routes/
│   └── {entities}-routes.tsx
└── pages/
    ├── list-{entities}-manager-page/
    │   ├── index.ts
    │   ├── {entities}-list-manager-page.tsx
    │   └── hooks/
    │       └── use-{entities}-list-columns.tsx
    └── edit-{entity}-manager-page/
        ├── index.ts
        ├── edit-{entity}-manager-page.tsx
        └── hooks/
            ├── use-edit-{entity}-form.tsx
            └── use-edit-actions.tsx
```

### Reference files to follow EXACTLY

Read and follow these canonical implementations:

1. **Routes**: Read `packages/web-feature-magazine/src/lib/enums/routes/enums-routes.tsx`
2. **List page**: Read `packages/web-feature-magazine/src/lib/enums/pages/list-enums-manager-page/enums-list-manager-page.tsx`
3. **Columns hook**: Read `packages/web-feature-magazine/src/lib/enums/pages/list-enums-manager-page/hooks/use-enums-list-columns.tsx`
4. **Edit page**: Read `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/edit-enum-manager-page.tsx`
5. **Form hook**: Read `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/hooks/use-edit-enum-form.tsx`
6. **Actions hook**: Read `packages/web-feature-magazine/src/lib/enums/pages/edit-enum-manager-page/hooks/use-edit-actions.tsx`

### Key conventions

- **Imports**: Use `@maas/*` package imports, never relative cross-package imports
- **Workspace URL**: Always use `useCurrentWorkspaceUrlPrefix()` from `@maas/core-workspace`
- **Workspace ID**: Use `useGetCurrentWorkspaceId()` from `@maas/core-workspace`
- **Create mode**: Detected by `{entityId} === 'new'`
- **Form fields**: Use `createConnectedInputHelpers<{Entity}>()` from `@maas/web-form`
- **Validation**: `zodResolver` with schemas from `@maas/core-api-models`
- **Form wrapper**: `FormProvider` from `react-hook-form`
- **Toasts**: `toast` from `sonner`
- **Icons**: `@tabler/icons-react` for page actions (IconPlus, IconEdit, IconTrash)
- **Layout**: `<LayoutBreadcrumb>` in `<header>`, then `<LayoutContent>` wrapping `<LayoutHeader>` + content
- **Collection**: `<Collection>` from `@maas/web-collection` with `useLocationAsState` prop
- **Error handling**: Map `error.parametersErrors` to `form.setError()` in mutations

### List page structure

```
<div>
  <header><LayoutBreadcrumb items={[...]} /></header>
  <LayoutContent>
    <LayoutHeader pageTitle="..." actions={<Button asChild><Link to="...new">New</Link></Button>} />
    <Collection useLocationAsState columns={columns} useQueryFn={useGet{Entities}} queryFields={{...}} filtersConfiguration={{...}} />
  </LayoutContent>
</div>
```

### Edit page structure

```
<div>
  <header><LayoutBreadcrumb items={[...]} /></header>
  <LayoutContent>
    <LayoutHeader pageTitle={...} actions={!isCreateMode && <DeleteButton />} />
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6 transition-opacity', isLoading && 'pointer-events-none opacity-50')}>
        <Card><CardContent><FieldGroup>...fields...</FieldGroup></CardContent></Card>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => form.reset()}>Reset</Button>
          <Button type="submit" disabled={isSaving}>{isCreateMode ? 'Create' : 'Save'}</Button>
        </div>
      </form>
    </FormProvider>
  </LayoutContent>
</div>
```

## Integration after creation

1. **Export** from the feature package's `index.ts`
2. **Register routes** using `/add-route admin {entities}` which updates:
    - `core-routes/routes.ts` (SEGMENTS + ADMIN_ROUTES)
    - `core-routes/route-builders.ts` (adminUrlBuilders)
    - `core-routes/hooks/use-workspace-routes.ts` (workspace route methods)
    - `core-workspace/provider/workspace-provider.tsx` (defaultRoutes)
3. **Mount route** in `apps/maas-app/src/app/routes/workspace-routes.tsx`
4. **Add navigation** in `apps/maas-app/src/app/hooks/use-main-navigation.tsx`
5. **Run typecheck**: `npx nx typecheck @maas/{feature-package}`
