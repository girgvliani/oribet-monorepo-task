# Oribet Monorepo

Turborepo + pnpm monorepo for the Oribet casino platform. Designed as a multi-client platform — shared packages ship a bug fix once, and all downstream client apps opt in via a manual deploy.

See [docs/monorepo-plan.md](docs/monorepo-plan.md) for the full architecture and migration plan.

## Quick Start

```bash
pnpm install
pnpm dev:oribet          # dev server
pnpm build:oribet        # production build
pnpm --filter=@oribet/app-oribet typecheck
```


## Structure

```
oribet-monorepo/
├── apps/
│   └── oribet/                     # Main app (@oribet/app-oribet)
├── packages/
│   ├── ui/                         # @oribet/ui — primitives (buttons, modal, tokens, theme type)
│   ├── assets/                     # @oribet/assets — icons, logos, atoms, flags
│   ├── locale/                     # @oribet/locale — createI18n factory + default translations
│   └── config/
│       ├── eslint/                 # @oribet/eslint-config       (tooling)
│       ├── typescript/             # @oribet/typescript-config   (tooling)
│       ├── vite/                   # @oribet/vite-config         (tooling)
│       ├── theme/                  # @oribet/theme-config        (runtime — createTheme + defaultTheme)
│       └── types/                  # @oribet/shared-types        (runtime — cross-cutting TS types)
├── pnpm-workspace.yaml
└── turbo.json
```

## Commands

| Command             | Description                |
| ------------------- | -------------------------- |
| `pnpm dev:oribet`   | Start oribet app in dev    |
| `pnpm build:oribet` | Build oribet app           |
| `pnpm lint`         | Lint all packages          |
| `pnpm typecheck`    | Typecheck all packages     |
| `pnpm test`         | Run Vitest                 |
| `pnpm format`       | Prettier all files         |
| `pnpm clean`        | Clean build artifacts      |

---

# Platform Architecture Reference

Reference for starting a new multi-client project. These are the decisions that worked; copy them as-is unless you have a concrete reason not to.

## Core Operating Model

- **One upstream codebase, many clients.** Every client is an `apps/<client>/` folder. Bug fix lands once, then each client can be rebuilt and deployed.
- **Fork only as last resort.** If a client needs major structural changes, fork into a separate repo with its own team. Default is to keep everyone in the monorepo.
- **No per-client component forks.** Custom components go into shared `ui`/`modules` and become opt-in via config. The library grows; app folders stay thin.
- **Thin app folders.** Each client app contains only: theme overrides, locale overrides, asset overrides, feature flags, routes/module config, `main.tsx`. No component code.
- **Build-time config only.** No runtime config fetch. All flags (crypto-only, fiat-only, bonus enabled, sports enabled, etc.) are compiled constants so Vite can tree-shake unused branches.
- **No Module Federation.** Build-time monorepo. Simpler to reason about; every client rebuilds when shared code changes.

## Package Naming

- Runtime packages: `@<org>/<name>` (e.g. `@oribet/ui`, `@oribet/assets`, `@oribet/locale`).
- Tooling/config packages: `@<org>/<name>-config` (e.g. `@oribet/eslint-config`, `@oribet/vite-config`, `@oribet/theme-config`).
- Apps: `@<org>/app-<client>` (e.g. `@oribet/app-oribet`).
- Tooling and new runtime "config" packages live side-by-side under `packages/config/` — one folder, no need for a separate `packages/configs/`.

## Pnpm + Turbo Setup

- `pnpm-workspace.yaml` globs: `packages/*`, `packages/config/*`, `apps/*`.
- Turbo `dependsOn: ["^build"]` ensures upstream packages build before apps.
- All workspace deps use `"workspace:*"`.
- Pnpm symlinks `packages/<x>` into each app's `node_modules/@<org>/<x>` automatically.

## Override Mechanisms (memorize these patterns)

### Theme — `createTheme()` factory with deep-merge

```ts
// @oribet/theme-config exports:
export function createTheme(overrides?: DeepPartial<AppTheme>): AppTheme

// apps/<client>/src/config/theme.ts:
export const theme = createTheme({
  colors: { bg: { primary: '#000' } },  // only override what differs
})
```

### Locale — `createI18n()` factory with deep-merge

```ts
// @oribet/locale exports:
export function createI18n(options: {
  fallbackLng?: string
  langs?: SupportedLang[]           // subset of shipped langs
  overrides?: Partial<Record<SupportedLang, Partial<Translations>>>
}): i18n

// apps/<client>/src/locale/i18n.ts:
const i18n = createI18n({
  fallbackLng: 'en',
  langs: ['en', 'de'],              // this client ships only 2
  overrides: { en: { 'welcome': 'Hi' } }
})
```

### Assets — explicit Vite alias per override

No fallback-resolver plugin. Clients that want to override a shared asset add a specific alias in their Vite config:

```ts
// apps/<client>/vite.config.ts:
resolve: {
  alias: {
    '@oribet/assets/logos/LogoMain': path.resolve(__dirname, 'src/assets/logos/LogoMain.tsx'),
  }
}
```

**Import rule:** asset consumers MUST use the per-file deep path — `import { LogoMain } from '@oribet/assets/logos/LogoMain'`, not the barrel `'@oribet/assets/logos'`. Vite `resolve.alias` matches on the written import specifier. Barrel imports go through the package's internal relative imports (`./LogoMain`), which a client-level alias cannot intercept.

Same rule applies to all overridable per-file assets: `@oribet/assets/{icons,logos,atoms,flags}/<Name>`. See [docs/overrides.md](docs/overrides.md) for concrete per-client override examples.

### Features — build-time flags as const

```ts
// apps/<client>/src/config/features.ts:
export const FEATURES = {
  crypto: true,
  fiat: false,
  bonus: true,
  sports: false,
} as const

// In shared module code:
if (!FEATURES.fiat) return null  // Vite DCE prunes the FiatDeposit subtree at build
```

Vite's dead-code-elimination prunes unreachable branches. The `as const` is critical — without it, Vite sees a variable, not a constant, and can't strip the code. Don't use env vars for this (env gets overloaded; types are less strict).

### Redux — `createAppStore` factory for per-client slice composition

Default store in `@oribet/core/redux/store` ships all 6 slices (user, game, config, settings, sports, blogs). Clients that want every slice use it as-is. Clients who want to drop slices instead compose their own store:

```ts
// apps/<client>/src/config/store.ts
import { createAppStore } from '@oribet/core/redux/createAppStore'
import { userReducer, gameReducer } from '@oribet/core/redux/slices'
// don't import slices you don't register — Vite DCE drops them from the bundle.

export const store = createAppStore({
  user: userReducer,
  game: gameReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Then the client's `<Provider store={store}>` uses the local store, and per-client `useAppSelector`/`useAppDispatch` hooks use the local `RootState`/`AppDispatch`.

Trade-off: the factory form loses some per-slice state narrowing that the literal singleton preserves. For consumer callbacks like `.find(p => p.slug)` where TS needs to infer `p`, either:
- Use the singleton store (keep all slices), or
- Cast in the selector: `useAppSelector(s => s.game.providers as IProvider[])`.

Most clients won't care — they use the singleton. The factory is for clients who deliberately slim their bundle.

### Routes + Modules — explicit declaration per client

```ts
// apps/<client>/src/config/app.ts:
import { LobbyTemplate, CasinoPage, AccountPage } from '@oribet/templates'

export const appConfig = {
  routes: [
    { path: '/', page: LobbyTemplate },
    { path: '/casino', page: CasinoPage },
    // client opts out of Bonus by not listing it
  ],
}
```

**From scratch**, no defaults, no presets. Clients write ~30-50 lines of explicit route config. More boilerplate than a preset system, but every client is self-contained and trivially customizable.

### Shell Layout — `layout` prop on AppShell

`AppShell` owns the provider stack (Snackbar + Router), bootstrap effects, global modals, and mounts a layout wrapping your routes. By default the layout is `MainTemplate` (header + sidebar + footer + chrome). Clients who want a different shell layout pass a `layout` prop:

```tsx
import { AppShell, type LayoutProps } from '@oribet/templates/main'

const HeadlessLayout = ({ children, mainLoading }: LayoutProps) => {
  if (mainLoading) return <Loading />
  return (
    <main>
      {/* no header, no sidebar, no footer */}
      {children}
    </main>
  )
}

<AppShell
  aboutUsItems={[]}
  getSocialIcons={() => []}
  layout={HeadlessLayout}
>
  <AppRoutes />
</AppShell>
```

The contract is `LayoutProps` — any component that accepts `{ children, mainLoading, aboutUsItems, socialIcons, customLogo }` can be dropped in. The surrounding `AppShell` keeps bootstrapping the app and rendering shell-level modals; only the chrome changes.

If a client wants something different from *everything* AppShell provides (different modal set, different router basename, no Snackbar, etc.), skip AppShell and assemble the pieces directly: `useAppBootstrap()` + `<Router>` + `<Snackbar>` + your own `<ShellModals>` + your layout. The minimum interface is: Redux `<Provider>`, `<QueryClientProvider>`, `<ThemeProvider>`, and a router — everything else is optional.

Proven with a shell-poc client during §27; the POC lived under `apps/shell-poc/`, compiled + built against `@oribet/templates/main` with a HeadlessLayout, and was deleted after verification (commits visible in git log).

## Packaging Gotchas

- **Subpath exports must match actual file extensions.** If your barrel is `index.tsx`, the `exports` map must say `./src/flags/index.tsx` — not `.ts`. TypeScript's `moduleResolution: "bundler"` respects the exports map and won't fall back.
- **Peer deps for React packages.** Any package that renders must declare `react` as a peer dep, not a regular dep, or you'll end up with two React copies and broken hooks.
- **`as const` for feature flags.** See above — Vite DCE needs constants.
- **Babel `styled-components` namespace per app.** Each app sets a unique `namespace` in its Vite config so styled-components class names don't collide across bundles.

## CI/CD Model

- **Manual deploys.** Use GitHub Actions `workflow_dispatch` with inputs (all clients / subset / single client). No auto-deploy on merge.
- **Rebuilds are per-client.** When `packages/*` changes, each client has to be rebuilt and deployed individually. Turborepo parallelizes.
- **Staging canary tier** recommended: designate 1-5 clients who receive updates first, bake for 24h, then release to the rest.

## What NOT to Do

- Don't fetch config at runtime — breaks tree-shaking.
- Don't put business logic in the app folder — it belongs in `@<org>/modules` or `@<org>/core`.
- Don't fork components per client — add to shared library, gate with feature flags.
- Don't use env vars for feature flags — use a typed `features.ts` constant.
- Don't import `@<org>/ui` directly from apps — go through modules/templates (enforceable via lint once modules exist).
- Don't use Module Federation unless you genuinely need runtime plug-in composition — build-time monorepo is simpler.

## Tech Stack

- **Build**: Vite 5 + Turborepo
- **Package Manager**: pnpm (workspaces)
- **Framework**: React 19
- **State**: Redux Toolkit + React Query
- **Router**: react-router v7
- **Styling**: styled-components (MUI removed)
- **i18n**: i18next
- **Testing**: Vitest + React Testing Library
