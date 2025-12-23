# @maas/web-collection

A reusable data table/collection component library that provides a complete abstraction over TanStack Table with integrated filtering, pagination, sorting, and server-side query management.

## Overview

This package simplifies building complex data tables while maintaining separation between state management, data fetching, and UI presentation.

**Key Design Principles:**

- **Composition-based:** Built from composable hooks and components
- **Server-side aware:** Designed for server-side filtering, sorting, and pagination
- **Configuration-driven:** Accepts configuration objects to customize behavior
- **State management:** Integrates URL-based state persistence with React Router
- **Query integration:** Works seamlessly with TanStack Query for data fetching

## Exports

### Components

| Component | Description |
|-----------|-------------|
| `Collection<T, Q>` | Main table component that orchestrates all hooks and sub-components |
| `CollectionColumnHeader<TData, TValue>` | Sortable column header with dropdown menu |
| `CollectionRowActions<T>` | Row actions dropdown menu (links, dialogs, onClick) |
| `CollectionToolbar<TData>` | Filter and search toolbar |
| `CollectionPagination<TData>` | Pagination controls |
| `CollectionFacetedFilter<TData, TValue>` | Faceted/multi-select filter dropdown |
| `CollectionViewOptions<TData>` | Column visibility toggle dropdown |

### Hooks

| Hook | Description |
|------|-------------|
| `useCollectionState` | State management for table state with optional URL persistence |
| `useCollectionQuery` | Query orchestration for server-side operations |
| `useCollectionTable` | TanStack Table instance creation |

## Architecture

```
Collection
├── useCollectionState()           → UI state (filters, sorting, pagination)
├── useCollectionQuery()           → Fetches data from server
├── useCollectionTable()           → Creates TanStack Table instance
└── JSX:
    ├── CollectionToolbar          → Search & filter UI
    ├── Table (from web-components)
    │   ├── TableHeader            → Sortable column headers
    │   └── TableBody              → Rows with cells
    └── CollectionPagination       → Page controls
```

## State Management

### `useCollectionState` Hook

Manages all table state with two operation modes:

**State Managed:**

- `globalFilter` - Text search input
- `rowSelection` - Selected rows
- `columnVisibility` - Hidden/shown columns
- `columnFilters` - Applied column filters
- `sorting` - Current sort direction/field
- `pagination` - Current page and page size

**Memory Mode** (`useLocationAsState: false` - default):

- State stored only in component memory
- Lost on page refresh

**URL-based Persistence** (`useLocationAsState: true`):

- State synced to URL search params
- Persists across page refreshes
- URL params: `search`, `page`, `pageSize`, `filters`, `sort`, `visibility`

## Query Handling

### `useCollectionQuery` Hook

Translates table state into API query parameters:

```typescript
interface UseCollectionQueryProps<T, S = undefined> {
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting?: SortingState;
  filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table'>;
  useQueryFn: UseQueryTable<T, S>;    // Custom hook for API call
  queryFields?: FieldQuery<T>;
  staticParams?: S;
}
```

**Translation Logic:**

1. Text filter → `filters[textFilter.queryParamName] = globalFilter`
2. Faceted filters → maps column filters to query param names
3. Sorting → `{ field, direction: 'asc' | 'desc' }`
4. Pagination → `{ offset, limit }`

## Table Functionality

### `useCollectionTable` Hook

Creates a TanStack Table instance with:

- **Manual modes enabled:** Server handles filtering, sorting, pagination
- **Client-side features:** Selection, visibility, grouping
- **Faceted values:** Computed from local data for filter UI

## Component Details

### CollectionToolbar

- Search input (if `textFilter` configured)
- Faceted filter buttons (dropdowns for multi-select filters)
- Reset filters button (shows when filters applied)
- View options toggle (if `showColumnSelector` true)

### CollectionColumnHeader

- Displays column title
- Sortable columns show dropdown with sort options and hide column option
- Icons: ↑ (asc), ↓ (desc), ≡ (unsorted)

### CollectionFacetedFilter

- Popover with searchable list of filter options
- Shows count of available items per option
- Displays selected values as badges
- "Clear filters" option when selections exist

### CollectionViewOptions

- Dropdown menu showing all hideable columns
- Checkboxes to toggle visibility
- Hidden on mobile (<lg breakpoint)

### CollectionPagination

- Shows selected row count
- Rows per page selector (10, 20, 30, 40, 50)
- Current page indicator
- Navigation buttons (first, previous, next, last)

### CollectionRowActions

Three types of row actions:

```typescript
// Link action - Navigate to a URL
{ label: "Edit", linkTo: (row) => `/edit/${row.id}` }

// Dialog action - Open a modal dialog
{ label: "Delete", dialog: { id: "delete-dialog", component: DeleteDialog } }

// OnClick action - Direct callback
{ label: "Copy ID", onClick: (row) => navigator.clipboard.writeText(row.id) }
```

## Usage Example

```tsx
import { Collection } from '@maas/web-collection';
import { useGetUsers } from '@maas/core-api';
import { userColumns } from './columns';

function UsersPage() {
  return (
    <Collection<User>
      columns={userColumns}
      useQueryFn={useGetUsers}
      showColumnSelector={true}
      useLocationAsState={true}
      queryFields={{ name: true, email: true }}
      filtersConfiguration={{
        textFilter: {
          placeholder: "Search users...",
          queryParamName: "q"
        },
        facetedFilters: [
          {
            columnId: "status",
            title: "Status",
            queryParamName: "status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" }
            ]
          }
        ]
      }}
    />
  );
}
```

## Data Flow

1. User types search → `setGlobalFilter()` → URL updates
2. URL query includes search param
3. `useCollectionQuery()` reads `globalFilter`
4. Translates to `{ q: "user search text" }`
5. Calls `useGetUsers({ filters: { q: "..." }, ... })`
6. Data returned to Collection component
7. `useCollectionTable` renders updated rows

## Dependencies

- `@maas/web-components` - UI primitives (Button, Input, Select, etc.)
- `@maas/core-api` - API types and query functions
- `@maas/core-utils` - Utilities like `cn()`, `useDialogState()`
- `@tanstack/react-table` - Core table logic
- `@tanstack/react-query` - Data fetching
- `react-router-dom` - URL state management

## Running unit tests

Run `nx test @maas/web-collection` to execute the unit tests.