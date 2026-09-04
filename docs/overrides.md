# Per-Client Overrides — Cookbook

How each kind of override works in practice. Common thread: Vite `resolve.alias` matches on the **written import specifier**, not the resolved physical path. For that reason, anything a client might override must be imported via a specifier the client can alias.

---

## 1. Override a single icon

**Use case:** client-X wants a different `IconChat.tsx`.

**Step 1** — create the replacement:

```
apps/client-x/src/assets/icons/IconChat.tsx
```

**Step 2** — add a Vite alias:

```ts
// apps/client-x/vite.config.ts
resolve: {
  alias: {
    '@oribet/assets/icons/IconChat': path.resolve(__dirname, 'src/assets/icons/IconChat.tsx'),
  }
}
```

**Step 3** — consumers already use deep paths (`import { IconChat } from '@oribet/assets/icons/IconChat'`) per the codebase convention. The alias intercepts. No other code changes needed.

**Why the convention matters:** if a consumer had written `import { IconChat } from '@oribet/assets/icons'` (barrel), the alias above wouldn't intercept — the barrel internally uses `./IconChat` (relative), which bypasses any module-specifier alias. Grep-enforce `@oribet/assets/(icons|logos|atoms|flags)'$` appearing ONLY in the package's own barrel files.

---

## 2. Override a logo / atom / flag

Same pattern as icons — per-file deep paths are overridable via alias.

```ts
// apps/client-x/vite.config.ts
resolve: {
  alias: {
    '@oribet/assets/logos/LogoMain': path.resolve(__dirname, 'src/assets/logos/LogoMain.tsx'),
    '@oribet/assets/atoms/AtomOribetHelmet': path.resolve(__dirname, 'src/assets/atoms/AtomOribetHelmet.tsx'),
    '@oribet/assets/flags/FlagArabic': path.resolve(__dirname, 'src/assets/flags/FlagArabic.tsx'),
  }
}
```

---

## 3. Override a whole module

**Use case:** client-X wants a custom AppSidebar.

**Step 1** — create the replacement (either the whole module or a specific sub-component):

```
apps/client-x/src/modules/app-sidebar/index.tsx
apps/client-x/src/modules/app-sidebar/AppSidebar.tsx
```

**Step 2** — Vite alias:

```ts
resolve: {
  alias: {
    '@oribet/modules/app-sidebar': path.resolve(__dirname, 'src/modules/app-sidebar'),
  }
}
```

**Caveats:**
- The override must export everything the shared module exported (or at least everything consumers import) — same named exports. Otherwise TS errors at consumer sites.
- For partial overrides (swap one sub-component, keep the rest), import the shared module's barrel inside your override, re-export everything, and override just the one file. Or expose per-file subpath exports on the module package so clients alias at file level instead of module level.

---

## 4. Override a page template

**Use case:** client-X wants a different LobbyTemplate — different module order, different set of modules.

**Step 1** — fork:

```
apps/client-x/src/pages/LobbyTemplate.tsx    # copy of packages/templates/src/lobby/LobbyTemplate.tsx, then edit freely
```

**Step 2** — lazy-load the local fork in the client's `AppRoutes.tsx` (already the pattern):

```ts
const LobbyTemplate = lazy(() => import('@pages/LobbyTemplate'))
```

`@pages/*` is the app-level path alias pointing to `apps/<client>/src/pages/`. Every app gets this alias in their tsconfig + vite.config.

**Why fork-not-alias for templates:** templates are composition source — clients are EXPECTED to edit the JSX. Forking makes that explicit. Shared template stays in `@oribet/templates/lobby` as the reference implementation new clients copy from.

---

## 5. Disable a feature entirely (no route, no module)

**Use case:** client-X is fiat-only — no bonus system at all.

**Step 1** — feature flag:

```ts
// apps/client-x/src/config/features.ts
export const FEATURES = {
  crypto: false,
  fiat: true,
  bonus: false,
  sports: false,
} as const
```

**Step 2** — consumer sites guard with the flag:

```tsx
{FEATURES.bonus && <BonusWidget />}
```

Vite DCE sees the `as const` literal `false`, strips the import + render entirely.

**Step 3** — client doesn't register the bonus-related routes in their `config/routes.ts`. The route simply doesn't exist for that client.

**Result:** no bonus code ends up in this client's bundle. No separate "bonus-less" template needed — same source, different build output.

---

## 6. Use a different backend

**Use case:** client-X talks to a different backend URL.

**Env-var driven** (simplest):

```
# apps/client-x/.env
VITE_API_URL=https://api.client-x.example.com
VITE_SOCKET_URL=https://ws.client-x.example.com
```

`@oribet/core/api/baseUrl.ts` reads these at build time. No code changes needed.

---

## 7. Override translations

**Use case:** client-X overrides specific strings for their brand.

```ts
// apps/client-x/src/locale/i18n.tsx
import { createI18n, supportedLangs } from '@oribet/locale'
import { getUserLanguage } from '@oribet/core/util/appUtil'

const i18n = createI18n({
  fallbackLng: getUserLanguage(),
  langs: ['en', 'de'],  // this client only ships 2 languages
  overrides: {
    en: { 'header.title': 'Welcome to ClientX' },
    de: { 'header.title': 'Willkommen bei ClientX' },
  }
})

export default i18n
```

Keys not overridden fall back to `@oribet/locale`'s defaults (all 7 languages' full translation files). Deep-merge, not replace.

---

## 8. Override theme

```ts
// apps/client-x/src/config/theme.ts
import { createTheme } from '@oribet/theme-config'

export const theme = createTheme({
  colors: {
    bg: { primary: '#000000' },
    accent: { primary: '#FF0033' },
    // only override what differs; rest stays default
  },
})
```

Each client ships a theme via `createTheme({ colors: {...} })` — all unset tokens come from `defaultTheme`.

---

## Decision tree

| Change wanted | Mechanism |
|---|---|
| Different single icon | §1 Vite alias to deep-path |
| Different logo/atom/flag | §2 Vite alias |
| Different sub-module | §3 Vite alias (whole module) |
| Different page layout | §4 fork template to `@pages/` |
| Entire feature off | §5 feature flag + route-list exclusion |
| Different backend | §6 env vars |
| String overrides | §7 createI18n overrides |
| Different colors | §8 createTheme overrides |
| Brand-new component nobody else needs | Client-only file in `apps/<client>/src/`, no package change |
| Brand-new component to share | New module in `@oribet/modules/` |
