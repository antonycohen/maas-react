---
name: create-public-page
description: Creates a public-facing page (no authentication required). Use when adding reader-facing pages like magazine listings, article views, pricing pages, or landing pages.
argument-hint: [page-name] [route-path]
disable-model-invocation: true
---

# Create Public Page

Creates a public-facing page that does NOT require authentication.

## Arguments

- `$ARGUMENTS[0]` = Page name in kebab-case (e.g., `about`, `faq`)
- `$ARGUMENTS[1]` = Route path (e.g., `/about`, `/faq`). If omitted, use `/{page-name}`.

## Context

Public pages in this project:

- Are NOT wrapped in `ProtectedPage`
- Use `Layout` (not `AdminLayout`) — this provides the public header with navigation
- Do NOT use workspace context (no `useCurrentWorkspaceUrlPrefix()`)
- Are mounted in `apps/maas-app/src/app/routes/root-routes.tsx` inside the public `Layout` wrapper
- Use `PUBLIC_ROUTES` constants from `@maas/core-routes`

## Reference existing public pages

Read these for patterns:

- `packages/web-feature-home/src/lib/pages/home-page/home-page.tsx` — simple content page
- `packages/web-feature-home/src/lib/magazines/pages/magazines-page.tsx` — list page
- `packages/web-feature-home/src/lib/magazines/pages/magazine-details-page.tsx` — detail page
- `packages/web-feature-home/src/lib/routes/` — route definitions
- `packages/web-feature-pricing/src/lib/pages/pricing-page/pricing-page.tsx` — static page

## Options

### Option A: Add to existing feature package

If the page belongs to an existing domain (e.g., `web-feature-home`, `web-feature-pricing`):

1. Create page component in the existing package
2. Add route in the existing routes file
3. Export from index.ts if creating new routes

### Option B: Create new feature package

If the page needs its own package:

```bash
npx nx g @nx/react:lib web-feature-{name} \
    --directory=packages/web-feature-{name} \
    --importPath=@maas/web-feature-{name} \
    --bundler=none --unitTestRunner=none --linter=eslint
```

Then create:

```
packages/web-feature-{name}/src/
├── index.ts
└── lib/
    ├── routes/{name}-routes.tsx
    └── pages/{page-name}/{page-name}.tsx
```

## Public page structure

```tsx
export function MyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page content — uses Tailwind classes directly */}
            <h1 className="mb-6 text-3xl font-bold">Page Title</h1>
            {/* Content */}
        </div>
    );
}
```

Public pages typically:

- Use the Tangente theme classes (`.tangente` variant)
- Don't use `<LayoutContent>` or `<LayoutHeader>` (those are admin patterns)
- Use standard container/grid layouts
- Can fetch data with TanStack Query hooks directly
- May use components from `@maas/web-components`

## Integration

1. **Mount in root-routes.tsx** inside the public `Layout`:

    ```tsx
    <Route element={<Layout />}>
      <Route path="/{route-path}/*" element={<{Name}Routes />} />
    </Route>
    ```

2. **Add to public navigation** if needed in `packages/web-layout/src/lib/layout-header-bar/layout-header-bar.tsx`

3. **Add route constant** to `PUBLIC_ROUTES` in `packages/core-routes/src/lib/routes.ts`

4. **Run Tailwind sync**: `npx nx sync`
