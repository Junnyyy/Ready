# Prewarmed Cache Demo

A demonstration of React Query's persistent cache feature using IndexedDB. Experience **instant data loading** on return visits by prewarming the cache-data displays immediately while revalidating in the background.

## What is a Prewarmed Cache?

Traditional web apps fetch data on every visit, showing loading states each time. With a prewarmed cache:

1. **First visit**: Data loads normally with a 2-second simulated delay
2. **React Query persists** the entire cache to IndexedDB
3. **Return visits**: Cached data displays instantly (0ms) while revalidating in background
4. **Cache persists** for 24 hours across browser sessions

This demo visualizes NYC power grid data (July–September 2024) with charts and paginated tables to showcase the performance difference.

## Live Demo Features

### Real-time Cache Status Indicator

- 🔴 **Loading** - First visit, fetching from server (2s delay)
- 🟠 **Updating** - Showing cached data while revalidating
- 🟢 **Fresh** - Cache ready and up-to-date
- ⚫ **Error** - Failed to load

### Interactive Controls

- **Refresh** - Revalidate all queries
- **Clear Cache** - Wipe IndexedDB and start fresh
- **Pagination** - Navigate pages (each page cached separately)

### Layout Shift Prevention

- Table maintains consistent height across all pages
- Pagination controls remain visible during loading
- Metadata endpoint provides page count before data loads

## Tech Stack

- **[Next.js 15](https://nextjs.org)** with App Router & Turbopack
- **[React 19](https://react.dev)** with TypeScript
- **[TanStack Query v5](https://tanstack.com/query)** (React Query) with IndexedDB persistence
- **[shadcn/ui](https://ui.shadcn.com)** (new-york style, neutral theme)
- **[Recharts](https://recharts.org)** for data visualization
- **[Tailwind CSS v4](https://tailwindcss.com)**
- **[nuqs](https://nuqs.dev)** for URL state management

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Testing the Cache

1. **First visit**: Wait for data to load (~2 seconds)
2. **Refresh the page**: Data appears instantly from cache
3. **Navigate pages**: Each page is cached separately
4. **Close browser**: Cache persists across sessions (24 hours)
5. **Click "Clear Cache"**: Reset to first-time experience

### Development Commands

```bash
pnpm dev     # Start dev server with Turbopack
pnpm build   # Build for production
pnpm start   # Start production server
pnpm lint    # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── power-usage/route.ts       # Power data endpoint (2s delay)
│   │   └── grid-events/
│   │       ├── route.ts                # Paginated events endpoint
│   │       └── metadata/route.ts       # Pagination metadata
│   ├── layout.tsx                      # Root layout with Providers
│   ├── page.tsx                        # Home: queries + components
│   ├── providers.tsx                   # React Query + IndexedDB setup
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── cache-status-indicator.tsx      # Real-time cache status
│   ├── power-usage-chart.tsx           # Recharts line chart
│   └── events-table.tsx                # Paginated table with skeletons
└── lib/
    ├── constants.ts                    # Mock data generation
    ├── persister.ts                    # IndexedDB persister
    └── utils.ts                        # cn() utility
```

## How It Works

### 1. Persistence Setup (`src/app/providers.tsx`)

```tsx
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: createIDBPersister() }}
  onSuccess={() => queryClient.resumePausedMutations()}
>
```

### 2. Cache Configuration

- **gcTime**: 24 hours (when cache expires)
- **staleTime**: 0 (always revalidate on access)
- **Persister**: IndexedDB via `idb-keyval`

### 3. Query Pattern

```tsx
const eventsQuery = useQuery({
  queryKey: ["grid-events", page],
  queryFn: async () => {
    const res = await fetch(`/api/grid-events?page=${page}`);
    return res.json();
  },
  staleTime: 0, // Revalidate every time
});
```

Each page is cached separately by query key, enabling instant navigation.

### 4. Metadata Architecture

Pagination metadata is fetched independently from data:

- `/api/grid-events/metadata` → `{ totalCount, totalPages, pageSize }`
- Cached for 1 hour (rarely changes)
- Enables accurate pagination rendering before data loads
- Prevents layout shift from unknown page counts

## Key Patterns

### Layout Shift Prevention

**Problem**: Variable table row counts and disappearing pagination cause layout jumps.

**Solution**:

- Table always renders exactly 5 rows (padding with invisible placeholders)
- Pagination always visible (no conditional rendering)
- Metadata loaded separately (totalPages known before data)
- Skeleton states match final content dimensions

### Hydration Mismatch Prevention

**Problem**: Server renders without cache, client hydrates with cached data from IndexedDB.

**Solution**:

```tsx
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => setIsHydrated(true), []);

// Show consistent state until hydrated
if (!isHydrated) {
  return <LoadingSkeleton />;
}
```

### Simulated Network Delay

API routes include a `delay` parameter for realistic testing:

```tsx
// Default 2s delay
fetch("/api/grid-events?page=1");

// No delay for testing
fetch("/api/grid-events?delay=0");
```

## Browser Storage

Data is persisted to IndexedDB at:

```
Application -> IndexedDB -> keyval-store -> reactQuery
```

Inspect the cached data in Chrome DevTools -> Application -> IndexedDB.

## Learn More

- [TanStack Query Persistence](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

## License

MIT
