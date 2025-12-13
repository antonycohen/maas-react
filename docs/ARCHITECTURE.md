# Architecture

This document describes the architecture and design patterns used in the Kodd monorepo.

## Workspace Structure

The monorepo is organized into three main directories:

```
maas-react/
├── apps/
│   └── maas-app/              # Main React application entry point
├── packages/
│   ├── core-api/              # API client implementation
│   ├── core-api-models/       # Shared TypeScript types
│   ├── core-store-oauth/      # OAuth state management
│   ├── core-store-session/    # Session management
│   ├── core-utils/            # Shared utilities
│   ├── web-components/        # Reusable UI components
│   ├── web-layout/            # Layout components
│   ├── web-themes/            # Tailwind theme config
│   ├── web-form/              # Form components
│   ├── web-collection/        # Data table components
│   └── web-feature-*/         # Feature modules
└── tools/
    └── tailwind-sync-plugin/  # Custom Nx plugin
```

## Package Organization

Packages follow a naming convention that indicates their purpose:

### Core Packages (`core-*`)

Backend-agnostic business logic and state management:

| Package | Description |
|---------|-------------|
| `core-api` | API client implementation with endpoint definitions |
| `core-api-models` | Shared TypeScript types and models |
| `core-store-oauth` | OAuth state management using Zustand with cookie persistence |
| `core-store-session` | Session management, user context, and protected route components |
| `core-utils` | Shared utility functions |

### Web Packages (`web-*`)

Frontend-specific UI components and features:

| Package | Description |
|---------|-------------|
| `web-components` | Reusable UI components (built with Radix UI and shadcn/ui patterns) |
| `web-layout` | Application layout components (shell, sidebar, navigation) |
| `web-themes` | Tailwind theme configuration and CSS variables |
| `web-form` | Form components and utilities |
| `web-collection` | Data collection/table components |

### Feature Packages (`web-feature-*`)

Self-contained feature modules with routes, pages, and components:

| Package | Description |
|---------|-------------|
| `web-feature-login` | Authentication flows and login pages |
| `web-feature-settings` | User account management |
| `web-feature-users` | User management and administration |
| `web-feature-feeds` | Feed/dashboard features |

Each feature package exports a `*Routes` component (e.g., `LoginRoutes`, `UsersRoutes`) that defines its routing structure.

## Routing Architecture

The app uses a hierarchical routing system with React Router v7.

### Route Hierarchy

```
/
├── /login/*           → LoginRoutes (public)
└── /*                 → ProtectedRoutes (requires auth)
    ├── /              → Dashboard/Home
    ├── /account/*     → Account settings
    ├── /users/*       → User management
    └── /settings/*    → Application settings
```

### Route Structure

1. **Root Routes** (`apps/maas-app/src/app/routes/root-routes.tsx`)
   - Top-level router splitting between public and protected routes
   - `/login/*` → `LoginRoutes` (public)
   - `/*` → `ProtectedRoutes` (requires authentication)

2. **Protected Routes**
   - `ProtectedPage` component checks for OAuth access token
   - Redirects to `/login` if not authenticated
   - Wraps authenticated pages with `Layout` component
   - Feature-specific routes mounted at different paths

3. **Feature Routes**
   - Each `web-feature-*` package exports a `*Routes` component
   - Contains internal routing using React Router's nested `<Routes>` and `<Route>`

## State Management

### Client State (Zustand)

Global state is managed with Zustand stores:

- **OAuth Store** (`core-store-oauth`)
  - Stores access and refresh tokens
  - Uses `persist` middleware with custom cookie storage
  - Enables cross-tab synchronization

- **Session Store** (`core-store-session`)
  - Stores current user data
  - Provides `ProtectedPage` and `ProtectedRoute` components

### Server State (TanStack Query)

Server state is managed with TanStack Query:

- Default `staleTime: Infinity` - data is considered fresh until invalidated
- Query hooks are colocated with API client in `core-api/lib/queries/*`
- Custom hooks wrap API calls (e.g., `useGetUsers`, `useGetUserById`)

## Authentication Flow

```
┌─────────────────┐
│ User accesses   │
│ protected route │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     No      ┌─────────────────┐
│ ProtectedPage   │────────────►│ Redirect to     │
│ checks token    │             │ /login          │
└────────┬────────┘             │ Store target URL│
         │ Yes                  └────────┬────────┘
         ▼                               │
┌─────────────────┐                      ▼
│ Render          │             ┌─────────────────┐
│ protected page  │             │ OAuth login     │
└─────────────────┘             │ flow            │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ Store tokens    │
                                │ in cookies      │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ Redirect to     │
                                │ stored URL      │
                                └─────────────────┘
```

1. User accesses protected route
2. `ProtectedPage` checks `accessToken` from `useOAuthStore`
3. If missing: redirects to `/login`, stores target URL in localStorage
4. Login flow completes, tokens stored in `core-store-oauth` (cookies)
5. User redirected to stored target URL or home

## API Client Pattern

The `core-api` package exports a singleton `maasApi` instance.

### Structure

```typescript
// Singleton API instance
export const maasApi = new ApiClient(config);

// Endpoint classes encapsulate API calls
class UsersEndpoint {
  getAll(): Promise<User[]> { ... }
  getById(id: string): Promise<User> { ... }
  create(data: CreateUserDto): Promise<User> { ... }
}

// Custom hooks wrap with TanStack Query
export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => maasApi.users.getAll(),
  });
}
```

### Configuration

- Base URL from `VITE_API_URL` environment variable
- Authentication via OAuth tokens from `core-store-oauth`

## Tailwind Integration

The custom `@maas/tailwind-sync-plugin` manages Tailwind CSS configuration.

### How It Works

1. Plugin scans all packages in the monorepo
2. Updates `@source` directives in `apps/maas-app/src/styles.css`
3. Ensures Tailwind scans all components for utility classes

### Running the Plugin

```sh
npx nx sync
```

### Source Configuration

The `apps/maas-app/src/styles.css` file contains:

```css
@import "tailwindcss";
@source "../../packages/web-components/src/**/*.tsx";
@source "../../packages/web-layout/src/**/*.tsx";
/* ... other packages */
```

## Creating New Packages

### Feature Package

```sh
npx nx g @nx/react:lib web-feature-<name> \
    --directory=packages/web-feature-<name> \
    --importPath=@maas/web-feature-<name> \
    --bundler=none \
    --unitTestRunner=none \
    --linter=eslint
```

### Core Package

```sh
npx nx g @nx/react:lib core-<name> \
    --directory=packages/core-<name> \
    --importPath=@maas/core-<name> \
    --bundler=none \
    --unitTestRunner=none \
    --linter=eslint
```

### Post-Creation Checklist

1. Add to `@source` list in `apps/maas-app/src/styles.css` (if it has styled components)
2. Run `npx nx sync` to update Tailwind configuration
3. Export main modules from `packages/<name>/src/index.ts`
4. Update TypeScript path mappings if needed (auto-configured by Nx)

## Key Configuration Files

| File | Description |
|------|-------------|
| `nx.json` | Nx workspace configuration with plugin setup and target defaults |
| `tsconfig.base.json` | TypeScript path mappings: `@maas/*` → `packages/*/src/index.ts` |
| `apps/maas-app/.env` | Environment variables for API URL and OAuth client ID |
| `apps/maas-app/src/styles.css` | Global styles with `@source` directives for Tailwind |

## Dependency Graph

Visualize the project dependency graph:

```sh
npx nx graph
```

This opens an interactive visualization showing how packages depend on each other.
