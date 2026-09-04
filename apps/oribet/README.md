# @oribet/app-oribet

Main Oribet casino application.

## Development

```bash
# From monorepo root
pnpm dev:oribet

# Or from this directory
pnpm dev
```

Dev server runs on http://localhost:3000

## Build

```bash
pnpm build    # TypeScript check + Vite build
pnpm preview  # Preview production build
```

Output: `dist/`

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | WebSocket server URL |
| `VITE_CHAT_SOCKET_URL` | Chat WebSocket URL |
| `VITE_APP_NAME` | Application name |
| `VITE_GIPHY_SDK_API_KEY` | Giphy API key |
| `VITE_SPORT_BOOK_SRC` | Sportsbook iframe URL |

## Path Aliases

| Alias | Path |
|-------|------|
| `@components/*` | `src/components/*` |
| `@containers/*` | `src/containers/*` |
| `@redux/*` | `src/redux/*` |
| `@hooks/*` | `src/hooks/*` |
| `@styles/*` | `src/styles/*` |
| `@utils/*` | `src/util/*` |
| `@api/*` | `src/api/*` |
| `@assets/*` | `src/assets/*` |
| `@locale/*` | `src/locale/*` |
| `@types/*` | `src/types/*` |

## Migration Notes

Migrated from CRA + Craco to Vite. Key changes:
- Environment variables: `REACT_APP_*` → `VITE_*`
- Env access: `process.env.*` → `import.meta.env.*`
- Test files excluded from production build
