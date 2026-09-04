# Creating a New Client App

This monorepo is designed to spin up a new casino brand by copying ~15 files and editing tokens, not by writing new business logic. Everything is a workspace package under `@oribet/*`; the client app is a thin composition layer.

This doc walks through the bootstrap + every customization axis.

**Related:**
- [`docs/overrides.md`](docs/overrides.md) — deep-dive cookbook for each override mechanism (icons, logos, modules, templates, features, backend, locale, theme).
- [`README.md`](README.md) — platform-level architecture reference ("Platform Architecture Reference", "Override Mechanisms").

---

## 1. The Mental Model

A client app owns exactly these things:

| Layer              | Owned by app? | Where                                         |
| ------------------ | ------------- | --------------------------------------------- |
| Boot logic         | No            | `@oribet/templates/main/useAppBootstrap`      |
| Providers          | Yes           | `ClientApp.tsx` (Redux, QueryClient, Theme)   |
| Routes list        | Yes           | `src/containers/AppRoutes.tsx`                |
| Page composition   | Sometimes     | Fork template into `src/pages/` if needed     |
| Theme tokens       | Yes           | `src/styles/theme/themes/<brand>.ts`          |
| Locale overrides   | Yes           | `src/locale/i18n.tsx`                         |
| Asset overrides    | Yes           | `src/assets/` + Vite alias                    |
| SEO strings        | Yes           | `src/server/seo.js`                           |
| Feature flags      | Yes           | `src/config/features.ts` (as const)           |
| Backend URL        | Yes           | `.env` (`VITE_API_URL`, `VITE_SOCKET_URL`)    |
| Everything else    | No            | `@oribet/{core,modules,templates,ui,assets}`  |

If you find yourself writing business logic (API calls, Redux, data transforms) inside the app folder — stop and ask whether that belongs in `@oribet/*` instead. App folder is **composition only**.

---

## 2. Bootstrap — Step by Step

Starting from a fresh `apps/<client>/` folder. This is the minimum viable casino. Copy from `apps/oribet/` and edit.

### Step 1: Create the folder + `package.json`

```
apps/<client>/
```

`package.json` — copy `apps/oribet/package.json`, then:
- Change `name` to `@oribet/app-<client>`
- Prune deps you don't need (every remaining `@oribet/*` should stay at `workspace:*`)

Every client app uses all runtime packages; the deps list in `apps/oribet/package.json` is the canonical set.

### Step 2: Config files

| File                 | Action                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `tsconfig.json`      | Copy from oribet. Trim the `paths` map to what you actually use (see §3). |
| `tsconfig.node.json` | Copy verbatim.                                                            |
| `vite.config.ts`     | Copy from oribet. Change the `babel-plugin-styled-components` namespace. Add asset-override aliases as you create them. |
| `index.html`         | Copy. Change `<title>`, favicon refs, SEO meta tags.                      |
| `.env.example`       | Copy. Fill `VITE_API_URL`, `VITE_SOCKET_URL`, etc. per client.            |
| `.gitignore`         | Copy.                                                                     |
| `public/`            | Copy `favicon.*`, add brand-specific static files (home-banner.png, etc.) |

### Step 3: Ambient types — `src/{vite-env,global,styled}.d.ts`

- `vite-env.d.ts` — copy from oribet. Declares `Window.LiveChatWidget`, `Window.dataLayer`, `@omno-payment/checkout-js` module, env var types. Safe to copy as-is.
- `global.d.ts` — copy.
- `src/styled.d.ts` — required for styled-components `DefaultTheme` to resolve to `AppTheme`:

```ts
import 'styled-components'
import type { AppTheme } from '@oribet/ui'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
```

### Step 4: Entry points — `src/main.tsx` + `src/ClientApp.tsx`

`src/main.tsx` is trivial — a lazy-loaded `ClientApp` for SSR-safe boot gating:

```tsx
import ReactDOM from 'react-dom/client'
import React, { useEffect, useState } from 'react'

const ClientApp = React.lazy(() => import('./ClientApp'))

const App = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  if (!isClient) return null
  return <ClientApp />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
```

`src/ClientApp.tsx` — providers + AppShell. Copy `apps/oribet/src/ClientApp.tsx`, then change `onLiveChatReady` if the client has a compliance seal init or similar.

### Step 5: Theme — `src/styles/theme/themes/<brand>.ts`

Minimum: one theme file with every `AppTheme` colour token filled in. Copy `apps/oribet/src/styles/theme/themes/oribet.ts` and change values.

**Two options** for wiring:

**(a) Single theme** (simplest): drop the per-client `ThemeWrapper` and use `@oribet/theme-config` directly in ClientApp:

```tsx
import { createTheme } from '@oribet/theme-config'
import { ThemeProvider } from 'styled-components'
import { brandTheme } from './styles/theme/themes/brand'

const theme = createTheme(brandTheme)

<ThemeProvider theme={theme}>...</ThemeProvider>
```

**(b) Multi-theme switcher** (like oribet's 8 themes): copy `src/containers/App/ThemeWrapper.tsx` and register your themes.

### Step 6: Locale — `src/locale/i18n.tsx`

If you use all 7 default languages with no string overrides:

```ts
import { createI18n, supportedLangs } from '@oribet/locale'
import { getUserLanguage } from '@oribet/core/util/appUtil'

export default createI18n({
  fallbackLng: getUserLanguage(),
  langs: supportedLangs,
})
```

For a subset of languages or brand-specific overrides, see [`docs/overrides.md` §7](docs/overrides.md#7-override-translations).

### Step 7: SEO — `src/server/seo.js`

Copy `apps/oribet/src/server/seo.js`, rewrite every `title` and `description` for the brand. The `screens` export shape is load-bearing — keep the keys; only change the string values.

### Step 8: Routes — `src/containers/AppRoutes.tsx`

Copy `apps/oribet/src/containers/AppRoutes.tsx`. This is the per-client route table.

- **To remove a route**: delete its `<Route>` line. The template stays in `@oribet/templates` — the client just doesn't use it.
- **To change a page's composition**: fork the template (Step 9), don't edit the shared one.
- **To add a brand-new page**: write a new `*Template.tsx` under `src/pages/` and add a `<Route>` entry.

### Step 9: Pages — `src/pages/` (optional forks)

**Rule:** you fork a page template only when you want to change what modules it composes or in what order.

The pattern is:

```
src/pages/LobbyTemplate.tsx  ← copy of packages/templates/src/lobby/LobbyTemplate.tsx
```

Then your `AppRoutes.tsx` imports `@pages/LobbyTemplate` (via the `@pages/*` alias). See [`docs/overrides.md` §4](docs/overrides.md#4-override-a-page-template).

If you don't need to customize a page, **don't fork it** — just reference `@oribet/templates/<page>` directly in `AppRoutes.tsx`.

### Step 10: Feature flags — `src/config/features.ts` (as needed)

Only create this file if the client wants to disable a feature entirely:

```ts
export const FEATURES = {
  crypto: true,
  fiat: false,
  bonus: true,
  sports: true,
  chat: true,
} as const
```

The `as const` is load-bearing — without it, Vite can't DCE the unused branches. See [`docs/overrides.md` §5](docs/overrides.md#5-disable-a-feature-entirely-no-route-no-module).

### Step 11: Register the app with the workspace

1. `pnpm install` from repo root (pnpm auto-detects new apps under `apps/*`).
2. Add `dev:<client>` + `build:<client>` scripts to the root `package.json` if you want a shortcut.
3. Add a Turbo pipeline entry if you want `turbo run` coverage.

### Step 12: Verify

```bash
pnpm --filter=@oribet/app-<client> typecheck
pnpm --filter=@oribet/app-<client> build
pnpm --filter=@oribet/app-<client> dev
```

If the app compiles + builds + renders the lobby, the bootstrap is done.

---

## 3. `tsconfig.paths` — What You Actually Need

The legacy oribet `tsconfig.json` has 15+ path aliases for `@components`, `@redux`, `@hooks`, etc. After the refactor **most of those target directories no longer exist** inside the app (everything moved to packages). A new app only needs:

```json
"paths": {
  "@pages/*":      ["./src/pages/*"],
  "@containers/*": ["./src/containers/*"],
  "@server/*":     ["./src/server/*"],
  "@styles/*":     ["./src/styles/*"],
  "@locale/*":     ["./src/locale/*"],
  "@assets/*":     ["./src/assets/*"]  // only if you have asset overrides
}
```

Match the same aliases in `vite.config.ts` under `resolve.alias`.

---

## 4. Scenarios — When to Do What

Quick decision table. Each row links to `docs/overrides.md` for the concrete recipe.

| Scenario                                              | Mechanism                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Change brand colours                                   | Theme file (Step 5)                                                                               |
| Replace a single icon/logo/flag/atom                   | Vite alias to a deep-path file ([overrides §1-2](docs/overrides.md#1-override-a-single-icon))     |
| Replace a whole module (e.g. custom sidebar)           | Vite alias on module specifier ([overrides §3](docs/overrides.md#3-override-a-whole-module))      |
| Replace a whole page layout                            | Fork template into `src/pages/` ([overrides §4](docs/overrides.md#4-override-a-page-template))    |
| Replace the entire shell chrome (no header/sidebar)    | `layout` prop on `AppShell` — see [README "Shell Layout"](README.md#shell-layout--layout-prop-on-appshell) |
| Strip a feature out of the bundle                      | Feature flag + don't register its routes ([overrides §5](docs/overrides.md#5-disable-a-feature-entirely-no-route-no-module)) |
| Different backend                                      | `.env` vars ([overrides §6](docs/overrides.md#6-use-a-different-backend))                         |
| Override specific translation strings                  | `createI18n({ overrides })` ([overrides §7](docs/overrides.md#7-override-translations))           |
| Ship only a subset of languages                        | `createI18n({ langs: ['en', 'de'] })` ([overrides §7](docs/overrides.md#7-override-translations)) |
| Drop Redux slices to slim the bundle                   | `createAppStore({ ... })` ([README "Redux"](README.md#redux--createappstore-factory-for-per-client-slice-composition)) |
| Completely different boot flow                         | Skip `AppShell`, call `useAppBootstrap()` yourself and compose the pieces                         |

---

## 5. The Replaceability Ladder (order of increasing invasiveness)

When a client needs to diverge from oribet, prefer mechanisms higher on the list:

1. **Env var** — `VITE_API_URL` etc. Zero code changes.
2. **Theme token** — `createTheme({ colors: {...} })`.
3. **Locale override** — `createI18n({ overrides: {...} })`.
4. **Feature flag** — flip a boolean in `config/features.ts`; `as const` + DCE removes the code.
5. **Don't register a route** — route simply doesn't exist for the client.
6. **Vite alias to a single file** — icons, logos, atoms, flags.
7. **Vite alias to a whole module** — custom sidebar, footer, etc.
8. **Fork a page template** — under `src/pages/`, import via `@pages/*`.
9. **`layout` prop on AppShell** — swap all chrome for a custom layout.
10. **Skip AppShell entirely** — compose `useAppBootstrap` + `<Router>` + `<Snackbar>` + your own shell. Documented in [README "Shell Layout"](README.md#shell-layout--layout-prop-on-appshell).
11. **Write a brand-new module** — add to `@oribet/modules/` (shared) or keep as an app-only file (local). Default: make it shared unless the use case is genuinely one-client-only.

**Never fork a shared package.** If you're tempted to fork `@oribet/modules/app-header` into a client-local copy "for one small change", stop and alias the specific sub-file via Vite instead.

---

## 6. Gotchas

- **Deep-path imports for overridable assets.** Consumers must import via `@oribet/assets/icons/IconChat`, not `@oribet/assets/icons` (barrel). Vite `resolve.alias` matches on the written specifier; barrel imports bypass the alias because they resolve internally via relative paths. See [`docs/overrides.md` §1](docs/overrides.md#1-override-a-single-icon) for the full story.
- **Peer deps matter.** Any package that renders React **must** declare `react` as a peer dep (not a regular dep), or two copies of React end up in the bundle and hooks break. Same for `styled-components`. The existing `@oribet/*` packages already do this correctly; don't change it.
- **`as const` is required for feature flags.** Without it, Vite can't tree-shake the unreachable branch — the whole bundle ships code for disabled features.
- **Subpath exports in `package.json` must match actual file extensions.** If the barrel is `index.tsx`, the `exports` map must say `./src/flags/index.tsx`, not `.ts`. TypeScript's `moduleResolution: "bundler"` respects the exports map and won't fall back.
- **`@server/seo.js` is per-client.** The `screens` export shape is load-bearing — every key (`home`, `casino`, `slots`, `bonuses`, etc.) is referenced by `AppRoutes.tsx`. Don't rename keys; only change the string translations.
- **Don't put business logic in the app folder.** If you catch yourself writing API calls, Redux slices, or data transforms under `apps/<client>/src/`, it belongs in `@oribet/core` or `@oribet/modules` instead. Client apps compose; they don't implement.

---

## 7. Reference: `apps/oribet/` as Canonical Client

The oribet app is the reference implementation. Every file under `apps/oribet/src/` that isn't in the list below is either legacy scaffolding that can be pruned, or client-specific customization:

- `main.tsx` — minimal entry
- `ClientApp.tsx` — provider stack + AppShell
- `containers/AppRoutes.tsx` — the per-client route table
- `containers/App/ThemeWrapper.tsx` — multi-theme switcher (optional; single-theme clients don't need this)
- `server/seo.js` — per-client SEO strings
- `styles/{GlobalStyles.ts,theme/}` — theme tokens + global CSS
- `locale/i18n.tsx` — i18n factory call
- `pages/` — forked page templates (only for pages the client customizes; empty is fine)
- `assets/` — per-client asset overrides (empty is fine — defaults come from `@oribet/assets`)
- `vite.config.ts` — Vite config + asset aliases
- `tsconfig.json`, `tsconfig.node.json`, `index.html`, `package.json`, `public/` — standard scaffolding
- `vite-env.d.ts`, `global.d.ts`, `styled.d.ts` — ambient types

Anything else (including the legacy `demoTestData.ts`, `setupTests.ts`, `reportWebVitals.ts`, `react-app-env.d.ts`, `lotties/`, `components/__tests__/`) is optional or legacy.
