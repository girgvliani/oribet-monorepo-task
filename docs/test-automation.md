# Test Automation — ID Map System

How the test-automation (TA) layer works in this monorepo: a UI-agnostic way to
target and verify interactable elements across apps that share one core but ship
different modules, themes, and features.

**Related:** [`NEW-APP.md`](NEW-APP.md) (app composition + override ladder),
[`overrides.md`](overrides.md) (per-app divergence mechanisms).

---

## 1. The Problem

Every client app (`apps/oribet`, `apps/oribet-korea`, …) is a thin composition of
the same shared packages (`@oribet/{ui,modules,templates,core}`) but each can enable
different features, fork different pages, and ship a different theme. Classic
per-app selectors (`.btn-login-3 > span`) don't survive that — they break per brand
and tell the framework nothing about what *should* exist.

So instead:

1. **Stable IDs are authored once** in a shared package and reused wherever a
   primitive/module is composed. The same functional element gets the **same
   `data-testid` in every app** — no string drift.
2. **A build-time generator** emits, per app, a **single ID-map file**
   (`apps/<app>/idmap.json`): the subset of IDs that app actually ships, how they
   nest, and a per-feature coverage report. QA targets IDs from this artifact, and
   the structure tells the framework *what should be present* — so a
   required-but-missing element is catchable instead of invisible.
3. **A hand-authored per-app manifest** (`apps/<app>/config/site-features.ts`)
   declares which features the app *should* ship. The generator gates the map
   against it: a declared feature whose ids aren't wired fails the **coverage gate**
   — catching a forked/added module that shares functionality but was never tagged.
4. **A completeness linter** (`pnpm idmap:lint`) statically scans the modules for
   interactive elements that carry no `data-testid`. The gate catches
   *registered-but-unwired* ids; the linter catches *interactive elements that were
   never registered*. Together they make "every interactive element has an id"
   enforceable.

The subset is **not** decided by env flags alone. The same functional element can
be rendered by a *different component* per app — e.g. oribet renders the shared
`AuthorizationModal` while oribet-korea renders `CasinoAuthModal`. So the generator
statically analyses each app's **component reachability** (which components the app
actually composes, from its entry through layout → page templates → modules) and
only reports an id when the component that emits it is genuinely reachable. Both
modals are tagged with the *same* registry ids, so the maps agree on the shared
functional ids despite the different implementations.

---

## 2. Moving Parts

| Piece | Location | Role |
| ----- | -------- | ---- |
| **Registry** | `packages/test-ids/` (`@oribet/test-ids`) | Single source of truth: typed ID constants + a hand-authored structure tree, one file per feature area. |
| **Feature catalog** | `packages/test-ids/src/features.ts` | The shared vocabulary: `FEATURE_KEYS` (the manifest units) + `featureForId(id)` (maps each id to its feature via ordered prefix rules). |
| **`testId` prop** | `@oribet/ui` primitives | Forwards a registry ID onto the real interactive DOM element as `data-testid`. |
| **Wiring** | `@oribet/modules` (every feature module) | Imports the constants and passes them to primitives / raw elements. |
| **Manifest** | `apps/<app>/config/site-features.ts` | Hand-authored `Record<FeatureKey, boolean>` — what the app *should* ship. Typechecked (exhaustive over `FEATURE_KEYS`). |
| **Generator** | `tools/idmap/generate.ts` + `reachability.ts` (`pnpm gen:idmap`) | Reads all registries + each app's `.env`, import graph, and manifest; keeps an id only if reachable AND its env rule holds; runs the coverage gate; writes one map file per app. |
| **Linter** | `tools/idmap/lint.ts` (`pnpm idmap:lint`) | Static completeness check: flags interactive elements with no `data-testid`/`testId`. |
| **ID map** | `apps/<app>/idmap.json` | **One file per app** — the artifact the TA framework consumes (structure + ids + manifest + coverage). |

### Coverage status — ✅ complete

Test-ids were rolled out feature-by-feature in the order an average player meets
them (see plan `a-ids-should-be-linked-spindle.md`). **All areas are done**; the
completeness linter reports **zero untagged interactive elements** app-wide, and
both apps pass the coverage gate (`coverage.ok: true`).

| Feature area | Registry | Feature keys (manifest units) |
| ------------ | -------- | ----------------------------- |
| Auth | `auth.ts` | `auth.{login,register,google,forgotPassword,resetPassword}` |
| Navigation | `navigation.ts` | `nav.{header,accountMenu,sidebar,bottomMenu,languageSelect,geoBlock,footer,notifications,bonusMenu}` |
| Discovery | `discovery.ts` | `discovery.{gameCard,categoryCards,search,filters,providers,casinoSwitcher,banners,swipers,liveFeed}` |
| Play | `play.ts` | `play.{footer,mobile,demo,modals,bonusMode}` |
| Deposit + wallet | `deposit.ts` | `deposit.{crypto,fiat,omno,agentPay,buyCrypto}`, `wallet.{deposit,balance,switch,bonus}` |
| Transactions | `transactions.ts` | `withdraw.{crypto,fiat}`, `transactions.{filters,history}` |
| Bonuses + promotions | `bonuses.ts`, `promotions.ts` | `bonuses.{list,wheel,modals,marketplace,header}`, `promotions.{list,detail}` |
| Account + KYC | `account.ts` | `account.{nav,profile,avatar,security,preferences,email,phone}`, `kyc.{level1,documents}` |
| Engagement + content + sports | `engagement.ts` | `engagement.{tournaments,leaderboards,rank}`, `comms.{notifications,chat}`, `content.{policies,blog}`, `misc.notFound`, `sports.entry` |

oribet ships ~249 ids; oribet-korea ~233 (the deltas are explained by env flags,
different components, and oribet-only / korea-only surfaces — see §8).

---

## 3. The Registry (`@oribet/test-ids`)

```
packages/test-ids/src/
├── types.ts        # IdNode / PresenceRule / TestIdRegistry / IdRole
├── features.ts     # FEATURE_KEYS, FeatureKey, SiteFeatures, featureForId(), isFeatureKey()
├── auth.ts         # AUTH_TEST_IDS + AUTH_STRUCTURE + AUTH_REGISTRY + GOOGLE_AUTH_ENV
├── navigation.ts   # NAV_TEST_IDS + …
├── discovery.ts    # DISCOVERY_TEST_IDS + …
├── play.ts         # PLAY_TEST_IDS + …
├── deposit.ts      # DEPOSIT_TEST_IDS + …
├── transactions.ts # TRANSACTIONS_TEST_IDS + …
├── bonuses.ts      # BONUSES_TEST_IDS + …
├── promotions.ts   # PROMOTIONS_TEST_IDS + …
├── account.ts      # ACCOUNT_TEST_IDS + …
├── engagement.ts   # ENGAGEMENT_TEST_IDS + …
└── index.ts        # barrel
```

Each feature file exports `<AREA>_TEST_IDS` (constants), `<AREA>_STRUCTURE`
(`IdNode[]`), and `<AREA>_REGISTRY` (`{ feature, structure }`). The generator
combines every registry's structure into one tree per app.

It is consumed as TypeScript source (`workspace:*`, no build step), like every
other `@oribet/*` package.

### 3a. ID constants — `AUTH_TEST_IDS`

A nested `as const` map. **Components import these; never hand-write the string.**
The string value *is* the rendered `data-testid`. Convention: dot-scoped namespace,
kebab-case leaf.

```ts
import { AUTH_TEST_IDS } from '@oribet/test-ids'

AUTH_TEST_IDS.login.emailInput   // 'auth.login.email-input'
AUTH_TEST_IDS.google.button      // 'auth.google.button'
```

### 3b. Structure tree — `AUTH_STRUCTURE`

The **union** of every auth element across all apps, as a list of `IdNode` roots
(a feature can expose several independent surfaces — modal, reset-password page,
etc.). Each node:

```ts
interface IdNode {
  id: string                      // the test-id (= data-testid value)
  role: IdRole                    // 'button' | 'textbox' | 'password' | 'checkbox'
                                  // | 'combobox' | 'link' | 'dialog' | 'tab'
                                  // | 'group' | 'alert'
  label?: string                  // human description (docs / QA contract)
  presentWhen?: { env: string; equals: string }  // build-time gate; omit = always
  runtimeConditional?: boolean    // present depends on runtime/API state — never hard-fail
  collection?: boolean            // id is a PREFIX for repeated instances (`<id>.<key>`)
  children?: IdNode[]
}
```

- **`presentWhen`** — statically evaluable against an app's `.env`. The generator
  *prunes* the node when the rule is false. Example: the Google button is
  `presentWhen: { env: 'VITE_ENABLE_GOOGLE_AUTH', equals: 'true' }`.
- **`runtimeConditional`** — the element is part of the union but its presence
  depends on runtime/API state (mobile vs desktop, a multi-currency API flag, an
  inline error showing). The framework must **not** fail when it's absent. These ids
  are **excluded from the coverage gate's "required" set** (see §6b).
- **`collection`** — the id is a *prefix*; every rendered instance is `<id>.<key>`
  (see §9 Collections). The framework targets instances by the `<id>.` prefix.

A node's **feature** is not stored on the node — it's derived from the id by
`featureForId()` in `features.ts` (ordered prefix rules; the id namespace already
encodes the designation). That feature key is the manifest unit the gate checks.

---

## 4. How an ID reaches the DOM

`@oribet/ui` primitives accept an optional `testId` prop and forward it as
`data-testid` on the **interactive** element (the `<input>`, `<button>`, …, not the
wrapper). Adding it is non-breaking — every existing call site omits it.

Tagged primitives (`@oribet/ui`): `CustomInput` (also emits `${testId}-error` on its
error region and `${testId}.visibility-toggle` for password show/hide), `CustomPrimaryButton`,
`CustomSecondaryButton`, `CustomMinimalButton`, `CustomBonusButton`, `CustomCheckBox`,
`CustomSelect` (emits searchable input `${testId}.search` and per-option
`${testId}.${value}`), base `Select` (emits a per-option `${testId}.${value}`),
`CustomModal` (emits backdrop `${testId}.backdrop`), `OribetPagination` (emits
`${testId}.prev` / `.next` / `.page.<n>`), `NewTabComponent` (`getTabTestId`),
`DepositButton`. Several shared module wrappers also forward a `testId` or apply a
registry id internally (e.g. `SidebarMenuItem`, `SectionButton`, `GameCard`,
`PlayButton`, `GameModeToggle`, `BonusCard`, `ActionButton` spreads props). The
linter treats wrappers that require a caller-provided `testId` as interactive call
sites, so missing wrapper IDs are catchable.

The module passes the registry constant down:

```tsx
// packages/modules/src/authorization/Login.tsx
import { AUTH_TEST_IDS } from '@oribet/test-ids'

<CustomInput testId={AUTH_TEST_IDS.login.emailInput} … />   // <input data-testid="auth.login.email-input">
<CustomPrimaryButton testId={AUTH_TEST_IDS.login.submit} …>Login</CustomPrimaryButton>
```

Raw (non-primitive) elements get `data-testid` inline:

```tsx
<button data-testid={AUTH_TEST_IDS.google.button} onClick={onGoogleAuth}>…</button>
```

Because auth lives in the **shared shell** (`MainTemplate` → `AuthorizationModal`),
both apps inherit the identical IDs for free — that's the agnosticism.

### Build flags

A per-app build flag drives the one auth element that differs between apps. The
gate **must** use the literal `import.meta.env` form so Vite statically replaces it
and tree-shakes the disabled branch:

```ts
// packages/modules/src/authorization/AuthorizationContent.tsx
const ENABLE_GOOGLE_AUTH = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true'
…
{ENABLE_GOOGLE_AUTH && (<ExternalSection> … Google button … </ExternalSection>)}
```

The env var name is mirrored by `GOOGLE_AUTH_ENV` in `@oribet/test-ids`, which the
generator reads from each app's `.env`. Set it in `apps/<app>/.env`:

```
VITE_ENABLE_GOOGLE_AUTH="true"    # apps/oribet
VITE_ENABLE_GOOGLE_AUTH="false"   # apps/oribet-korea
```

---

## 5. Running the Apps

```bash
pnpm install              # once

pnpm dev:oribet           # default-templates reference app (port 3000)
pnpm dev:oribet-korea     # Korean brand fork

pnpm build:oribet
pnpm build:oribet-korea

pnpm typecheck            # all packages + apps
```

`data-testid`s are present in both dev and production builds (they are not stripped
by minification).

---

## 6. Generating the ID Map

```bash
pnpm gen:idmap                                   # all apps (oribet + oribet-korea)
pnpm gen:idmap -- --app=oribet                   # one app
pnpm gen:idmap -- --app=oribet --app=oribet-korea
```

`pnpm gen:idmap` runs `tsx tools/idmap/generate.ts`. It combines **every** registry
(the `REGISTRIES` array) into one `ALL_STRUCTURE` tree. For each app it:

1. Loads the combined structure from `@oribet/test-ids`.
2. Parses `apps/<app>/.env` into an env map.
3. **Computes reachable ids** ([reachability.ts](../tools/idmap/reachability.ts)): statically
   walks the app's import graph from `ClientApp.tsx`, then collects every
   `<AREA>_TEST_IDS.*` member reference (and raw `data-testid` literals) in the
   reachable component files (see §6a).
4. **Keeps a node only if** its `presentWhen` rule holds for the env **and** its id
   is referenced by a reachable component (a container survives if any child does).
5. Loads the app's **manifest** (`config/site-features.ts`) and runs the
   **coverage gate** (§6b).
6. **Validates** the registry is drift-free — every constant appears exactly once in
   the structure and vice-versa; every `FEATURE_KEY` has ≥1 node; every node's id
   maps to a valid feature. **Fails loudly** otherwise (this is what stops drift).
7. Writes one file: `apps/<app>/idmap.json`.

Add `--check` (`pnpm gen:idmap -- --check`) to exit non-zero on a gate failure
without writing — for CI.

It is a **static** step — it never renders a browser or crawls a running app; the
import-graph walk is plain source analysis.

### 6b. The manifest + coverage gate

Each app hand-authors `apps/<app>/config/site-features.ts`:

```ts
import type { SiteFeatures } from '@oribet/test-ids'
export const SITE_FEATURES: SiteFeatures = {
  'auth.login': true,
  'auth.google': false,        // env flag off in this app
  'deposit.fiat': true,
  // … exhaustive over every FeatureKey (typecheck enforces it)
}
```

For each feature the generator computes: `requiredIds` = the feature's registry ids
that are **not** `runtimeConditional` and survive env pruning; `present` = which of
those are reachable; `missingIds` = required − reachable. The gate then:

- **fails** (`coverage.ok: false`, lists `missingFeatures`) when a feature marked
  `true` has non-empty `missingIds` — i.e. a declared feature whose required ids
  aren't wired (a forked/added module that forgot its test-ids);
- **warns** (`coverage.unexpected`) when a feature marked `false` has reachable
  required ids.

Because almost all leaf ids are `runtimeConditional` (modal/route/flag gated), the
gate is intentionally lenient on those — the manifest mainly documents intent and
catches the egregious "whole feature shipped untagged" case. Flip a feature `true`
whose ids aren't wired to see it fail; wire them to see it pass.

### 6c. The completeness linter (`pnpm idmap:lint`)

`tools/idmap/lint.ts` scans `packages/modules/src`, `packages/templates/src`,
`packages/ui/src`, and both app shells (`apps/oribet/src`, `apps/oribet-korea/src`) for
interactive elements — `<button>`/`<input>`/`<a>`, `onClick=`, `role="button"`, and
the `Custom*`/`Select`/`ActionButton`/`MethodCard`/`OribetPagination` primitives —
that carry **no** `data-testid`/`testId`. The gate (§6b) catches *registered* ids
that aren't wired; this linter catches *interactive elements never put in the
registry*. Opt out a genuinely-non-targetable element with an inline
`// idmap-ignore: <reason>` (or `{/* idmap-ignore: … */}`) on the element's line or
the line above. Components that self-tag internally live in the linter's
`SELF_TAGGING` allowlist. **Current state: zero findings.**

### 6a. How reachability works

Apps diverge by which components they compose, so "does this id ship?" is a
reachability question, not just an env question. The walk:

- **Resolves** relative imports, app path-aliases (`@pages/*`, `@containers/*`, …
  from the app's `tsconfig`), and `@oribet/*` workspace subpath exports.
- Is **named-export aware**: importing `{ MainTemplate }` from the
  `@oribet/templates/main` barrel follows only `MainTemplate` — it does *not* pull
  in `NavHeaderLayout` (and thus `CasinoAuthModal`) that the same barrel re-exports.
- Parses **dynamic imports** — `import('@oribet/modules/authorization').then(m => m.Foo)`
  demands only `Foo`, not the whole barrel.
- Ignores declared **dependency-injection fallback edges** (e.g. `AppShell`'s default
  `import MainTemplate` — each app reaches its real layout from `ClientApp` instead).
  See `IGNORED_EDGES` in `reachability.ts`.

Net effect: oribet (renders the shared `AuthorizationModal` via `MainTemplate`) and
oribet-korea (renders `CasinoAuthModal` via `NavHeaderLayout`) each report only the
ids their own components emit — even though both are tagged from the same registry.
This generalises to every dual-tagged surface (footer, wallet, deposit, bonuses,
account, …). Set `IDMAP_DEBUG=1` to dump a per-app reachability report to
`apps/<app>/idmap/.reach-debug.json`.

---

## 7. The ID Map Output

One file per app, `apps/<app>/idmap.json`:

```jsonc
{
  "app": "oribet",
  "manifest": { "auth.login": true, "auth.google": false, "deposit.fiat": true, … },
  "features": {
    "auth.login":   { "expected": true,  "present": true,  "ids": [...], "missingIds": [] },
    "deposit.fiat": { "expected": true,  "present": true,  "ids": [...], "missingIds": [] }
    // … one entry per FeatureKey
  },
  "coverage": { "ok": true, "missingFeatures": [], "unexpected": [] },
  "structure": [ /* the full pruned IdNode tree across all feature areas */ ],
  "ids": ["auth.header.login-button", "auth.login.email-input", … ]  // flat, sorted
}
```

- **`coverage`** — the gate result. The TA framework's first assertion is
  `coverage.ok === true`.
- **`features`** — per-feature presence + any `missingIds`.
- **`manifest`** — the app's declared intent (mirrors `config/site-features.ts`).
- **`structure`** — what to expect and how it nests (which element is inside which
  surface). Collection nodes carry `collection: true` (target instances by prefix).
- **`ids`** — quick flat lookup of every ID present in this app.

---

## 8. How the TA Framework Uses It

1. **Load** `apps/<app>/idmap.json` and assert `coverage.ok === true` (a failed gate
   means the build shipped a declared feature with unwired ids — stop). `manifest`/
   `features`/`structure` tell the framework which app it's driving and which
   features exist.
2. **Target** by `data-testid` using the `ids` list, e.g. `[data-testid="auth.login.email-input"]`.
   For a `collection` node, target instances by the `<id>.` prefix
   (e.g. `[data-testid^="discovery.game-card."]`).
3. **Assert presence** by diffing the map's `structure` against the live DOM:
   - A node **without** `runtimeConditional` that is missing from the DOM (in the
     state where it should render) is a **bug**.
   - A `runtimeConditional` node may legitimately be absent (mobile-only, error not
     shown, API flag off) — don't hard-fail; assert it only when you've driven the
     app into the state that should produce it.
4. **Agnosticism** — the shared functional IDs are identical across apps, so one
   selector set drives any app. This holds even when the apps render *different
   components* for the same surface: oribet's `AuthorizationModal` and
   oribet-korea's `CasinoAuthModal` are tagged from the same registry, so
   `auth.login.email-input`, `auth.register.submit`, `auth.tab.login`, etc. resolve
   in both.
5. **Subsetting** — apps differ only where the map differs, and every difference is
   explainable. Example: diff the two generated maps —

   ```bash
   diff <(jq -r '.ids[]' apps/oribet/idmap.json) \
        <(jq -r '.ids[]' apps/oribet-korea/idmap.json)
   # < auth.google.button          present in oribet only (VITE_ENABLE_GOOGLE_AUTH on)
   # < deposit.fiat.*              Interkasa fiat — oribet only (korea funds via Omno)
   # < wallet.switch.card          oribet multi-wallet switcher; korea pill is display-only
   # > promotions.detail.close     korea promotion detail modal; oribet has no such modal
   ```

   The framework knows these *should not* exist in oribet-korea (different feature
   flag / different component), so their absence is expected — not a failure.

---

## 9. Adding / Changing IDs

### Add an element to an existing feature (auth)

1. Add the constant to `AUTH_TEST_IDS` in `packages/test-ids/src/auth.ts`.
2. Add a matching node to `AUTH_STRUCTURE` (set `role`; add `presentWhen` if a build
   flag gates it, or `runtimeConditional` if API/layout state does).
3. Wire it in the component — pass `testId={AUTH_TEST_IDS.…}` to a primitive, or add
   `data-testid={AUTH_TEST_IDS.…}` to a raw element.
4. `pnpm gen:idmap` — the drift check enforces that the constant and the structure
   node match; the build fails if you added one without the other.
5. If the wiring used a new user-facing string, add the i18n key to **all 8** locale
   JSONs (`packages/locale/src/translations/*.json`).

### Add a new feature surface (e.g. a new module area)

1. New file `packages/test-ids/src/<area>.ts` exporting `<AREA>_TEST_IDS`,
   `<AREA>_STRUCTURE`, and a `TestIdRegistry` (copy an existing area as a template).
2. Export the three symbols from `packages/test-ids/src/index.ts`.
3. Register it in the generator's `REGISTRIES` array in `tools/idmap/generate.ts`
   (and add the import).
4. Add the new **feature key(s)** to `FEATURE_KEYS` in `features.ts`, plus a
   `featureForId` prefix rule mapping the id namespace → the key (order matters —
   more specific prefixes first).
5. Add the key(s) to **both** apps' `config/site-features.ts` (`true`/`false` per
   whether that app ships it — typecheck fails until the manifest is exhaustive).
6. Wire the constants into the components — and into **both** app variants when they
   diverge (the dual-tagging rule, below).
7. `pnpm gen:idmap` (gate must stay green) and `pnpm idmap:lint` (no new findings).

### Dual-tagging (the cross-app rule)

When oribet and oribet-korea render *different components* for the same function,
wire the **same** registry id into **both** so the maps agree. Established pairs:

| Surface | oribet | oribet-korea |
| ------- | ------ | ------------ |
| Auth modal | `authorization/AuthorizationModal` | `casino-authorization/CasinoAuthModal` |
| Header + account menu | `app-header/AppHeader*`, `AppHeaderAccountInfoMenu` | `app-header/CenteredNav*` |
| Footer | `main-footer/MainFooter` | `casino-footer/CasinoFooter` |
| Wallet / balance | `MultiWalletView`/`DepositView` | `CenteredNavBalancePill` |
| Deposit | `ChooseDepositMethodModal` | `korea-dashboard/DepositMoneySection` |
| Transactions | `account/Transaction` | `korea-dashboard/TransactionHistorySection` |
| Bonuses page | `bonuses-page/*` | `korea-bonuses/*` |
| Promotions | `promotions/*` | `korea-promotions/*` |
| Account / settings | `settings/*`, `account/*` | `korea-dashboard/*` |
| Policies | `policies/*` | `korea-policies/KoreaPoliciesModule` |

Reachability then decides which app actually ships each id — a difference in the
generated maps is expected wherever a flag, a different component, or an oribet-only
surface explains it.

### Collections (repeated items)

Game cards, provider tiles, nav items, tx rows, etc. each get their **own unique**
id of the form `<baseId>.<key>` — never the bare base id, and never two elements
with the same id. Compose the key from a stable, unique discriminator (game id,
slug, route, stable i18n key):

```tsx
<Card data-testid={`${DISCOVERY_TEST_IDS.gameCard.root}.${gameId}`} … />
```

Mark the structure node `collection: true` — it documents that the registry id is a
**prefix**. The framework targets instances by the `<baseId>.` prefix. Do NOT use
`data-key`/`data-nav-key`/`data-*` attributes; everything is on `data-testid`.

---

## 10. Conventions & Gotchas

- **Never hand-write a `data-testid` string** — always import from `@oribet/test-ids`.
  The drift validation only protects strings that go through the registry.
- **`presentWhen` is build-time only.** It must map to a `VITE_*` env var read by the
  component via the *literal* `import.meta.env.VITE_X` form (so Vite DCEs the branch).
  Don't gate on a computed env key — it won't tree-shake and the registry string will
  still ship.
- **Presence that depends on API/runtime state → `runtimeConditional`, not
  `presentWhen`.** The static generator can't evaluate it, and the framework must not
  treat its absence as a failure.
- **The registry string survives in the bundle even when the element is gated off**
  (it's a property of the imported constant object). That's expected — it does not
  mean the element renders. Trust the generated map / the runtime gate, not a bundle
  grep.
- **An id only ships if its component is reachable.** Wiring `AUTH_TEST_IDS.x` into a
  component that an app never composes won't put it in that app's map — which is the
  point. If an id you expect is missing, check that the app actually reaches that
  component (run with `IDMAP_DEBUG=1` and inspect `.reach-debug.json`).
- **New dependency-injection seams may need an `IGNORED_EDGES` entry.** If a shared
  component statically imports a *default* it renders only as a fallback (like
  `AppShell`→`MainTemplate`), add it to `IGNORED_EDGES` in `reachability.ts` so the
  fallback isn't counted for apps that inject their own.
- **The map is generated, not authored.** Re-run `pnpm gen:idmap` after changing the
  registry, a component's wiring, or an app's `.env`; don't hand-edit `idmap/*.json`.
