# Kodd

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern React monorepo built with Nx, featuring a modular architecture for scalable web applications.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **React Router v7** for routing
- **Vite 7** for building and dev server
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **TanStack Query v5** for server state management
- **Zustand v5** for client state management
- **Radix UI** primitives for accessible components
- **Nx 22** for monorepo orchestration
- **pnpm** for package management

## Getting Started

### Prerequisites

```sh
npm install -g pnpm
```

### Installation

```sh
pnpm install
```

### Development

Start the development server:

```sh
npx nx dev @maas/maas-app
```

The app will be available at `http://localhost:4200`

### Environment Variables

Copy `.env.example` to `apps/maas-app/.env` and configure:

```env
VITE_API_URL=http://localhost:8080
VITE_OAUTH_CLIENT_ID=oidc-client-public
```

## Project Structure

The monorepo is organized into three main directories:

- **`apps/maas-app/`** - Main React application
- **`packages/`** - Shared libraries organized by domain
- **`tools/`** - Custom Nx plugins and build tools

### Package Organization

Packages follow a naming convention:

#### Core Packages (`core-*`)
Backend-agnostic business logic:
- `core-api` - API client with endpoint definitions
- `core-api-models` - Shared TypeScript types
- `core-store-oauth` - OAuth state management with Zustand
- `core-store-session` - Session management and protected routes
- `core-utils` - Shared utility functions

#### Web Packages (`web-*`)
Frontend UI components:
- `web-components` - Reusable UI components (Radix UI + shadcn/ui)
- `web-layout` - Application layout and navigation
- `web-themes` - Tailwind theme configuration
- `web-form` - Form components and utilities
- `web-collection` - Data tables and collections

#### Feature Packages (`web-feature-*`)
Self-contained feature modules:
- `web-feature-login` - Authentication flows
- `web-feature-settings` - User account management
- `web-feature-users` - User administration
- `web-feature-feeds` - Dashboard and feeds

## Common Commands

### Development
```sh
npx nx dev @maas/maas-app        # Start dev server
npx nx build @maas/maas-app      # Production build
npx nx preview @maas/maas-app    # Preview production build
```

### Testing
```sh
npx nx test @maas/maas-app              # Run tests
npx nx test @maas/maas-app --coverage   # With coverage
npx nx test <package-name>              # Test specific package
```

### Code Quality
```sh
npx nx lint @maas/maas-app           # Run ESLint
npx nx typecheck @maas/maas-app      # Type check
npx nx typecheck <package-name>      # Type check package
```

### Workspace Management
```sh
npx nx show projects                 # List all projects
npx nx graph                         # Visualize dependencies
npx nx sync                          # Sync workspace config
```

## Architecture

### Routing

The app uses a hierarchical routing system:

1. **Root Routes** (`apps/maas-app/src/app/routes/root-routes.tsx`)
   - `/login/*` → Public login routes
   - `/*` → Protected application routes

2. **Protected Routes** - Require authentication:
   - `ProtectedPage` component checks OAuth token
   - Redirects to `/login` if not authenticated
   - Wraps authenticated pages with `Layout` component

3. **Feature Routes** - Each feature package exports its own routes component

### State Management

- **Zustand** for global state (OAuth, session)
  - Cookie-based persistence for cross-tab sync
- **TanStack Query** for server state
  - Custom hooks in `core-api/lib/queries/*`
  - Default `staleTime: Infinity`

### Authentication

1. User accesses protected route
2. `ProtectedPage` checks for OAuth `accessToken`
3. If missing → redirect to `/login`, store target URL
4. After login → tokens stored in cookie → redirect to target

### API Client

Singleton `maasApi` instance from `core-api`:
- Base URL from `VITE_API_URL`
- Endpoint classes (e.g., `UsersEndpoint`)
- Custom hooks wrap calls with TanStack Query

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

After creating a package:
1. Add to `@source` list in `apps/maas-app/src/styles.css` (if it has styled components)
2. Run `npx nx sync` to update Tailwind configuration
3. Export main modules from `packages/<name>/src/index.ts`

## Tailwind Integration

The custom `@maas/tailwind-sync-plugin` automatically updates `@source` directives in `apps/maas-app/src/styles.css` to ensure Tailwind scans all packages for utility classes.

## Learn More

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
