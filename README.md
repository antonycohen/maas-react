# Kodd

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern React monorepo built with Nx, featuring a modular architecture for scalable web applications.

## Requirements

- **Node.js** >= 20.x
- **pnpm** >= 9.x (package manager)

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **React Router v7** for routing
- **Vite 7** for building and dev server
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **TanStack Query v5** for server state management
- **Zustand v5** for client state management
- **Radix UI** primitives for accessible components
- **Nx 22** for monorepo orchestration

## Getting Started

### 1. Install pnpm

```sh
npm install -g pnpm
```

### 2. Install dependencies

```sh
pnpm install
```

### 3. Configure environment

Copy the example environment file and configure it:

```sh
cp .env.example apps/maas-app/.env
```

Edit `apps/maas-app/.env` with your settings:

```env
VITE_API_URL=http://localhost:8080
VITE_OAUTH_CLIENT_ID=oidc-client-public
```

### 4. Start development server

```sh
npx nx dev @maas/maas-app
```

The app will be available at `http://localhost:4200`

## Commands

### Development

| Command | Description |
|---------|-------------|
| `npx nx dev @maas/maas-app` | Start dev server on port 4200 |
| `npx nx build @maas/maas-app` | Production build |
| `npx nx preview @maas/maas-app` | Preview production build |

### Testing & Code Quality

| Command | Description |
|---------|-------------|
| `npx nx test @maas/maas-app` | Run tests with Vitest |
| `npx nx test @maas/maas-app --coverage` | Run tests with coverage |
| `npx nx lint @maas/maas-app` | Run ESLint |
| `npx nx typecheck @maas/maas-app` | Run TypeScript type checking |

### Workspace

| Command | Description |
|---------|-------------|
| `npx nx show projects` | List all projects |
| `npx nx graph` | Visualize project dependencies |
| `npx nx sync` | Sync workspace configuration |

## Project Structure

```
maas-react/
├── apps/
│   └── maas-app/          # Main React application
├── packages/
│   ├── core-*             # Backend-agnostic business logic
│   ├── web-*              # Frontend UI components
│   └── web-feature-*      # Self-contained feature modules
└── tools/                 # Custom Nx plugins
```

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Learn More

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
