---
name: create-api-entity
description: Creates the complete API layer for a new entity including Zod models, endpoint class, query/mutation hooks, and route constants. Use when adding a new domain entity to the backend API layer.
argument-hint: [entity-name] [plural-name] [api-base-path]
disable-model-invocation: true
---

# Create API Entity

Creates the full API stack for a new entity: models, endpoint, query hooks, and route constants.

## Arguments

- `$ARGUMENTS[0]` = Entity name in kebab-case (e.g., `invoice`)
- `$ARGUMENTS[1]` = Plural name in kebab-case (e.g., `invoices`). If omitted, append "s".
- `$ARGUMENTS[2]` = API base path (e.g., `/api/v1/invoices`). If omitted, use `/api/v1/{entities}`.

## What to create

### 1. Zod Models (`packages/core-api-models/src/lib/{entity}/models.ts`)

Follow the 5-schema pattern used throughout the codebase. Reference: `packages/core-api-models/src/lib/enum/models.ts`

```typescript
import * as z from 'zod';
import { readOrganizationRefSchema } from '../organizations';

// Ref schema (for foreign keys)
export const {entity}RefSchema = z.object({ id: z.string() });

// Read ref schema (for dropdowns)
export const read{Entity}RefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

// Full read schema (API responses)
export const {entity}Schema = z.object({
  id: z.string(),
  name: z.string().max(255),
  // Add entity-specific fields
});

// Create schema (with validation)
export const create{Entity}Schema = z.object({
  name: z.string().min(1).max(255),
  organization: readOrganizationRefSchema.nullable(),
  // Add required fields
});

// Update schema
export const update{Entity}Schema = z.object({
  name: z.string().min(1).max(255).optional(),
  // Add optional fields
});

// Types
export type {Entity}Ref = z.infer<typeof {entity}RefSchema>;
export type Read{Entity}Ref = z.infer<typeof read{Entity}RefSchema>;
export type {Entity} = z.infer<typeof {entity}Schema>;
export type Create{Entity} = z.infer<typeof create{Entity}Schema>;
export type Update{Entity} = z.infer<typeof update{Entity}Schema>;
```

Then export from `packages/core-api-models/src/lib/{entity}/index.ts` and add to `packages/core-api-models/src/index.ts`.

### 2. Endpoint Class (`packages/core-api/src/lib/endpoints/{entities}.ts`)

Reference: `packages/core-api/src/lib/endpoints/enums.ts`

```typescript
import { {Entity}, Create{Entity}, Update{Entity} } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '{api-base-path}';

export interface Get{Entities}Filter {
  organizationId?: string;
  name?: string;
}

export class {Entities}Endpoint {
  constructor(private client: ApiClient) {}

  async get{Entities}(params: GetCollectionQueryParams<{Entity}> & { filters?: Get{Entities}Filter }): Promise<ApiCollectionResponse<{Entity}>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<{Entity}>(BASE_PATH, fields, { offset, limit, ...filters });
  }

  async get{Entity}(params: GetQueryByIdParams<{Entity}>): Promise<{Entity}> {
    return this.client.getById<{Entity}>(`${BASE_PATH}/${params.id}`, params.fields);
  }

  async create{Entity}(data: Create{Entity}): Promise<{Entity}> {
    return this.client.post<{Entity}>(BASE_PATH, data);
  }

  async update{Entity}({entityId}: string, data: Update{Entity}): Promise<{Entity}> {
    return this.client.patch<{Entity}>(`${BASE_PATH}/${{entityId}}`, data);
  }

  async delete{Entity}({entityId}: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${{entityId}}`);
  }
}
```

Register in `packages/core-api/src/lib/api.ts` on the `MaasApi` class.

### 3. Query Hooks (`packages/core-api/src/lib/queries/{entities}/`)

Create 5 files following the exact pattern from `packages/core-api/src/lib/queries/enums/`:

- `index.ts` - barrel export
- `use-get-{entities}.ts` - collection query with `queryKey: ['{entities}', params]`
- `use-get-{entity}-by-id.ts` - single item query with `queryKey: ['{entity}', params.id, params.fields]`
- `use-create-{entity}.ts` - mutation that invalidates `['{entities}']`
- `use-update-{entity}.ts` - mutation that invalidates `['{entities}']` and `['{entity}', variables.{entityId}]`
- `use-delete-{entity}.ts` - mutation that invalidates `['{entities}']`

Export from `packages/core-api/src/lib/queries/{entities}/index.ts` and add to the main queries barrel export.

### 4. Route Constants (`packages/core-routes/src/lib/routes.ts`)

Add to SEGMENTS:

```typescript
{ENTITIES}: '{entities}',
```

Add to ADMIN_ROUTES:

```typescript
{ENTITIES}: SEGMENTS.{ENTITIES},
{ENTITIES}_WILDCARD: `${SEGMENTS.{ENTITIES}}/*`,
{ENTITY}_NEW: `${SEGMENTS.{ENTITIES}}/${SEGMENTS.NEW}`,
{ENTITY}_EDIT: `${SEGMENTS.{ENTITIES}}/:{entityId}`,
```

### 5. Register Routes (use `/add-route` skill)

The route registration touches 4-6 files across `core-routes` and `core-workspace`. Use the `/add-route admin {entities}` skill for this step, which updates:

1. `packages/core-routes/src/lib/routes.ts` — SEGMENTS + ADMIN_ROUTES
2. `packages/core-routes/src/lib/route-builders.ts` — adminUrlBuilders
3. `packages/core-routes/src/lib/hooks/use-workspace-routes.ts` — workspace route methods
4. `packages/core-workspace/src/lib/provider/workspace-provider.tsx` — defaultRoutes fallback

## Verification

After creating everything, run:

```bash
npx nx typecheck @maas/core-api-models
npx nx typecheck @maas/core-api
npx nx typecheck @maas/core-routes
npx nx typecheck @maas/core-workspace
```
