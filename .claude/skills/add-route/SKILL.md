---
name: add-route
description: Registers a new admin or public route in core-routes, core-workspace, workspace-routes, and sidebar navigation. Use when adding a new route for a feature that needs to be wired into the routing system.
argument-hint: [admin|public] [segment-name] [plural-name]
disable-model-invocation: true
---

# Add Route

Registers a new route across the entire routing chain. This involves up to 6 files depending on whether it's an admin or public route.

## Arguments

- `$ARGUMENTS[0]` = Route type: `admin` or `public`
- `$ARGUMENTS[1]` = Segment name in kebab-case (e.g., `invoices`, `notifications`)
- `$ARGUMENTS[2]` = (Optional) Additional context like the feature package name

## Route Chain Overview

Adding a route in this project requires updating files in this order:

### For ADMIN routes (5-6 files):

1. **`packages/core-routes/src/lib/routes.ts`** — Add SEGMENTS constant + ADMIN_ROUTES entries
2. **`packages/core-routes/src/lib/route-builders.ts`** — Add `adminUrlBuilders` entries
3. **`packages/core-routes/src/lib/hooks/use-workspace-routes.ts`** — Add workspace route methods
4. **`packages/core-workspace/src/lib/provider/workspace-provider.tsx`** — Add to `defaultRoutes`
5. **`apps/maas-app/src/app/routes/workspace-routes.tsx`** — Mount the Route component
6. **`apps/maas-app/src/app/hooks/use-main-navigation.tsx`** — Add sidebar nav item

### For PUBLIC routes (3-4 files):

1. **`packages/core-routes/src/lib/routes.ts`** — Add SEGMENTS constant + PUBLIC_ROUTES entry
2. **`packages/core-routes/src/lib/hooks/use-public-routes.ts`** — Add public route method
3. **`apps/maas-app/src/app/routes/root-routes.tsx`** — Mount the Route component
4. Optionally add to public navigation header

## Step-by-step: Admin Route

### Step 1: Add segment and route constants

In `packages/core-routes/src/lib/routes.ts`:

```typescript
// In SEGMENTS object (if the segment doesn't exist yet):
MY_ENTITY: 'my-entities',

// In ADMIN_ROUTES object:
MY_ENTITIES: SEGMENTS.MY_ENTITY,
MY_ENTITIES_WILDCARD: `${SEGMENTS.MY_ENTITY}/*`,
MY_ENTITY_NEW: `${SEGMENTS.MY_ENTITY}/${SEGMENTS.NEW}`,
MY_ENTITY_EDIT: `${SEGMENTS.MY_ENTITY}/:myEntityId`,
```

Follow existing patterns for naming:

- Simple CRUD: `{ENTITY}`, `{ENTITY}_WILDCARD`, `{ENTITY}_NEW`, `{ENTITY}_EDIT`
- With tabs: add `{ENTITY}_INFO`, `{ENTITY}_DETAILS`, etc.
- Nested under parent: `PMS_{ENTITY}`, `PMS_{ENTITY}_WILDCARD`, etc.

### Step 2: Add admin URL builders

In `packages/core-routes/src/lib/route-builders.ts`, add to `adminUrlBuilders`:

```typescript
// Simple CRUD entity
myEntities: () => ADMIN_ROUTES.MY_ENTITIES,
myEntityNew: () => `${SEGMENTS.MY_ENTITY}/${SEGMENTS.NEW}`,
myEntityEdit: (myEntityId: string) => buildPath(`${SEGMENTS.MY_ENTITY}/:myEntityId`, { myEntityId }),
```

### Step 3: Add workspace route hooks

In `packages/core-routes/src/lib/hooks/use-workspace-routes.ts`, add to the returned object:

```typescript
/** My entities list URL */
myEntities: () => `${baseUrl}/${adminUrlBuilders.myEntities()}`,
/** New my entity URL */
myEntityNew: () => `${baseUrl}/${adminUrlBuilders.myEntityNew()}`,
/** Edit my entity URL */
myEntityEdit: (myEntityId: string) => `${baseUrl}/${adminUrlBuilders.myEntityEdit(myEntityId)}`,
```

### Step 4: Add to defaultRoutes

In `packages/core-workspace/src/lib/provider/workspace-provider.tsx`, add to `defaultRoutes`:

```typescript
myEntities: () => '/my-entities',
myEntityNew: () => '/my-entities/new',
myEntityEdit: () => '/my-entities',
```

### Step 5: Mount in workspace routes

In `apps/maas-app/src/app/routes/workspace-routes.tsx`:

```typescript
// Import
import { MyEntitiesRoutes } from '@maas/web-feature-my-entities';

// Mount (inside the <Routes> element that's inside <AdminLayout>)
<Route path={ADMIN_ROUTES.MY_ENTITIES_WILDCARD} element={<MyEntitiesRoutes />} />
```

### Step 6: Add to sidebar navigation

In `apps/maas-app/src/app/hooks/use-main-navigation.tsx`:

```typescript
// Import the icon
import { SomeIcon } from 'lucide-react';

// Add to the appropriate section
{
    title: 'My Entities',
    url: routes.myEntities(),
    icon: SomeIcon,
},
```

## Step-by-step: Public Route

### Step 1: Add to PUBLIC_ROUTES

In `packages/core-routes/src/lib/routes.ts`:

```typescript
// In SEGMENTS (if needed):
MY_PAGE: 'my-page',

// In PUBLIC_ROUTES:
MY_PAGE: `/${SEGMENTS.MY_PAGE}`,
```

### Step 2: Add public route hook

In `packages/core-routes/src/lib/hooks/use-public-routes.ts`:

```typescript
/** My page URL */
myPage: PUBLIC_ROUTES.MY_PAGE,

/** My page detail URL */
myPageDetail: (id: string) => `${PUBLIC_ROUTES.MY_PAGE}/${id}`,
```

### Step 3: Mount in root routes

In `apps/maas-app/src/app/routes/root-routes.tsx`, inside the public `Layout`:

```typescript
<Route path="/my-page/*" element={<MyPageRoutes />} />
```

## Verification

After adding routes, run:

```bash
npx nx typecheck @maas/core-routes
npx nx typecheck @maas/core-workspace
npx nx typecheck @maas/maas-app
```

This ensures all route types are consistent across the chain.
