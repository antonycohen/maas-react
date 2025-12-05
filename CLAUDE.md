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
