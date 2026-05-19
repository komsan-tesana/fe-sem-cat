# AGENTS.md - Codebase Guide for AI Agents

## Project Overview

This is a Social Enterprise Management Web Application (Cats) built with React 19, Vite, and modern JavaScript tooling.

## Build/Lint/Test Commands

```bash
# Development
npm run dev           # Start Vite dev server

# Production
npm run build         # Build for production
npm run preview       # Preview production build

# Linting
npm run lint          # Run ESLint on entire codebase

# No test framework is currently configured
```

## Project Structure

```
src/
├── app/
│   ├── features/          # Feature pages (home, auth, checkout, admin, etc.)
│   ├── providers/         # React context providers (auth, cart, adopt, config)
│   ├── router/            # Routing configuration
│   ├── shared/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API/service functions
│   │   └── utils/         # Utility functions
│   └── store/             # Zustand stores
├── main.jsx               # App entry point
└── App.jsx                # Root component
```

## Code Conventions

### File Naming
- Components: `PascalCase.jsx` (e.g., `ProductCard.jsx`)
- Utilities/Hooks/Stores: `camelCase.js` (e.g., `use-cart.js`, `cats-store.js`)
- Barrel exports: `index.ts` (only TypeScript files in project)

### Import Conventions
- Use double quotes for strings in imports: `import { x } from "path"`
- Use path aliases: `import { x } from "@/app/providers/auth"`
- Group imports: external libraries first, then internal modules

### Path Aliases
Configured in `vite.config.js` and `jsconfig.json`:
- `@/*` maps to `src/*`

### Component Patterns
```jsx
// Default export for page components
export default function ProductDetails() { }

// Named export for reusable components
export function ProductCard({ product }) { }
```

### Hook Patterns
```javascript
// Custom hooks follow use-prefix naming
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
```

### State Management
Uses Zustand for global state:
```javascript
import { create } from "zustand";
export const catsStore = create((set) => ({
  cats: [],
  setCats: (cats) => set({ cats, displayCats: cats }),
}));
```

### Data Fetching
Uses React Query (@tanstack/react-query):
```javascript
const { data, isFetching } = useQuery({
  queryKey: ["catsHero"],
  queryFn: ({ signal }) => getCatsHero(signal),
  staleTime: 1000 * 120,
});
```

### Form Handling
Uses react-hook-form:
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();
```

### Error Handling in Services
```javascript
export const getCats = (tags, limit, signal) => {
  return fetch(url, { method: "GET", signal })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
};
```

## Tech Stack

| Category | Library |
|----------|---------|
| UI Framework | React 19 |
| Build Tool | Vite (rolldown-vite) |
| Routing | react-router-dom v7 |
| State | zustand v5 |
| Data Fetching | @tanstack/react-query v5 |
| Forms | react-hook-form v7 + zod v4 |
| UI Components | antd v6 |
| Styling | Tailwind CSS v4 |
| Validation | @hookform/resolvers |
| Testing | Not configured |
| Linting | ESLint 9 |

## ESLint Configuration

Located in `eslint.config.js`:
- Uses flat config format
- Enforces react-hooks rules
- Allows unused vars with UPPER_CASE pattern (for constants)
- Ignores `dist` directory

## Styling

- Uses Tailwind CSS with Antd component library
- Component styles in `App.css` and inline styles where appropriate
- Antd theming configured via `AntConfigProvider`

## API Patterns

External APIs used:
- `https://cataas.com/api/*` - Cat images API
- Services pass AbortController signal for cancellation

## Agent Skills

- `skill({ name: "frontend-design" })` 
- `skill({ name: "vercel-react-best-practices" })` 


## Notes

- No TypeScript - project uses plain JavaScript with JSDoc optional
- No test framework configured
- Uses `@faker-js/faker` for mock data
- Ant Design v6 uses `variant` and `color` props instead of `type`

## page-object-generate

```json
{
  "framework": "react",
  "pagesRoot": "src/app/features",
  "controlsRoot": "src/app/shared/components",
  "outputDir": "e2e/page-objects",
  "selectorProfile": "react-antd"
}
```
