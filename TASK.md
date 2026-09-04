## 1. The Task

Replace the **initial screen of the wallet (deposit) modal** with the design in
`apps/oribet/design.pen`, and drive it from the real cashier API.

Three deliverables, all on the _first_ screen of the wallet:

1. **Pixel-perfect design.** The initial wallet screen must match `design.pen` exactly —
   spacing, radii, colors, type scale, icon sizes, states (default / hover / pressed /
   disabled / loading), desktop **and** mobile.
2. **Correct payment methods per selected wallet.** The list of deposit methods must come
   from the cashier session's `providers` array for the **currently selected wallet** — not
   from redux settings, not hardcoded. Switching wallet must re-drive the method list. The
   provider → method mapping is specified in §7.1.
3. **A working bonus selection dropdown.** A collapsible/dropdown bonus selector fed by the
   cashier session's `available_bonuses`, with a "No bonus" option, that lets you actually
   pick a bonus and persists that pick onto the cashier session (`bonus_ids`). Rules in §7.2.

**You are not building the rest of the deposit flow.** What happens _after_ a method is
picked (address/QR screens, amount + quote, the omno iframe, withdraw, transactions) is out
of scope — see §12.

### Why this is not a cosmetic change

The wallet you see today decides which methods to show from a **redux settings blob**
(`state.settings.systemSettings.multi_currency`), and its "bonus" control is a **global
account preference toggle** (`want_deposit_bonus`), not a per-deposit bonus picker. Both are
wrong. The single endpoint `POST /api/cashier/init` already returns, for one specific wallet,
exactly which providers are enabled and which bonuses that deposit may attach. The task is to
make the UI a function of that response.

---

## 2. Getting Started From Scratch

### 2.1 Prerequisites

| Tool | Version  | Notes                                                                                |
| ---- | -------- | ------------------------------------------------------------------------------------ |
| Node | **20.x** | The version this project is built with. Newer majors work locally.                   |
| pnpm | **9**    | Pinned via `"packageManager": "pnpm@9.0.0"`. `corepack enable` or `npm i -g pnpm@9`. |

Do **not** use npm or yarn — the workspace is pnpm-only (`pnpm-workspace.yaml`, `workspace:*` deps).

### 2.2 Clone the task repo

```bash
git clone git@github.com:caspar000/oribet-monorepo-task.git
cd oribet-monorepo-task
```

`develop_task` is the only branch and the default, so there is nothing to check out.

### 2.3 Create `apps/oribet/.env`

`.env` is gitignored, so the clone does not contain one — you create it. The repo ships
`apps/oribet/.env.example` as a template, but it points at a _different_ backend, so don't just
copy it. Create `apps/oribet/.env` with exactly this:

```dotenv
# Vite environment variables (use VITE_ prefix)

# Config
VITE_MODE="development"
VITE_APP_NAME="oribet"
VITE_IS_DEMO="true"

# Domain URLs
VITE_API_URL="https://api.oribet.space"
VITE_SOCKET_URL="https://ws.oribet.space"
VITE_CHAT_SOCKET_URL="https://chat.oribet.space"

# Giphy SDK
VITE_GIPHY_SDK_API_KEY=""

# FingerprintJS SDK
VITE_FINGERPRINT_API_KEY=""
VITE_FINGERPRINT_REGION="eu" # e.g. "us", "eu"

# Upgaming Sportbook
VITE_SB_CLIENT_ID=""
VITE_SB_CLIENT_NAME=""
```

> `VITE_API_URL` is consumed as `VITE_API_URL + '/api'`
> (`packages/core/src/api/baseUrl.ts`) — so the axios `baseURL` is
> `https://api.oribet.space/api`. Don't include `/api` in the env value.

**The three blank values are deliberate and you do not need them for this task.**
`VITE_FINGERPRINT_API_KEY` is optional by design — `packages/modules/src/fingerprint/config.ts`
degrades the whole feature to a no-op when it is absent, and `LoginContainer.tsx` only attaches
`fingerprint_request_id` to the login request when one exists, so sign-in works normally (you
will see one console warning). `VITE_SB_CLIENT_ID` / `VITE_SB_CLIENT_NAME` drive the Upgaming
sportsbook, which is disabled in this slice (`sports.entry: false`). If you ever need real
values, ask — they are supplied out of band, not in this repo.

### 2.4 Install and run

```bash
pnpm install            # from the repo ROOT, not from apps/oribet
pnpm dev:oribet         # → http://localhost:3000  (vite opens it for you)
```

`pnpm install` at the root is mandatory even if a `node_modules/` directory is already
present: this branch is a fork with a different dependency set, and a stale install shows up
as a wall of `TS2307: Cannot find module '@oribet/ui' / '@oribet/assets/icons/...'` errors on
`pnpm typecheck` even though every file exists. If you see those, re-run `pnpm install`.

### 2.5 The port-3000 rule (read this — it will cost you an hour otherwise)

**The API only accepts requests from `http://localhost:3000`.** CORS on the dev backend is
pinned to that origin.

Vite is configured with `server.port: 3000` (`apps/oribet/vite.config.ts`) but **falls back to
3001 without failing** if 3000 is occupied — the app then loads fine and every single API call
dies with a CORS error. Before starting, make sure nothing else holds the port:

```bash
lsof -ti:3000        # anything listed must be killed
kill -9 $(lsof -ti:3000)
```

Then confirm the URL bar really says `localhost:3000`.

### 2.6 Log in

|          |               |
| -------- | ------------- |
| Username | `testuser000` |
| Password | `TestUser!2`  |

This account has **two wallets**, which is what makes it useful for this task:

| Wallet id | Currency | `is_crypto` | `is_default` | Providers returned by the cashier |
| --------- | -------- | ----------- | ------------ | --------------------------------- |
| `4859`    | USDT     | `true`      | `true`       | `["nowpayments"]` → Crypto        |
| `4858`    | USD      | `false`     | `false`      | `["omno"]` → Card                 |

So the two wallets must produce **two different method lists**. That is the acceptance test
for deliverable 2.

### 2.7 Open the wallet

Sign in → the header shows a balance pill and a **Deposit** button (top right). Click it. In
this build that dispatches `changeGlobalDepositModal(true)` and the modal mounted by
`MainTemplate` opens on the method chooser. Full click-to-render chain in §4.2.

### 2.8 Checks you must keep green

```bash
pnpm typecheck      # tsc --noEmit across the workspace
pnpm lint           # eslint
pnpm test           # vitest
pnpm gen:idmap      # regenerates apps/oribet/idmap.json + runs the coverage gate
pnpm idmap:lint     # flags interactive elements with no data-testid
pnpm format         # prettier
```

Do not run `pnpm build` / `pnpm dev` for other brands; they aren't part of this task.

---

## 3. What "vertical slice" means

`develop_task` was cut down on purpose — it is a lobby-only vertical slice of the oribet app,
published here as a single snapshot commit rather than the full upstream history. Only the
**lobby** exists, signed-out and signed-in.
Sign-in works; sign-up does not. Every other route (casino, games, bonuses, promotions, blog,
settings, sport, play-game, the whole `/account` area) has been removed along with its
modules, and `AppRoutes.tsx` sends every unknown path back to the lobby instead of 404ing.

Consequences you will actually hit:

- **The wallet is only reachable from the header Deposit button** (plus the sidebar deposit
  card and the mobile account menu). There is no `/account/wallet` page in this build —
  `packages/modules/src/account/Wallet.tsx` and `Mobile/WalletMobilePage.tsx` still exist but
  are unrouted.
- `apps/oribet/src/components/` is empty apart from `__tests__`; `apps/oribet/src/containers/`
  holds only `App/` and `AppRoutes.tsx`. **Nearly all the code you will touch lives in
  `packages/`, not in `apps/oribet`.**
- `apps/oribet-korea`, `-africa`, `-turkey`, `-redesign` are stubs. Ignore them.
- The features this task is allowed to rely on are declared `true` in
  `apps/oribet/config/site-features.ts` — note the comment there: _"deposit + wallet — the
  surface the wallet task is built on"_:
  `deposit.crypto`, `deposit.fiat`, `deposit.omno`, `deposit.agentPay`, `deposit.buyCrypto`,
  `wallet.deposit`, `wallet.balance`, `wallet.switch`, `wallet.bonus`.

---

## 4. Code Map

### 4.1 Stack

React 19 · TypeScript · Vite · **styled-components** · Redux Toolkit (+ React Query for server
state) · react-router v7 · i18next · socket.io-client · Vitest + RTL.

Monorepo layout (pnpm workspaces + Turborepo):

| Package                 | Import as              | Holds                                                                                         |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| `apps/oribet`           | —                      | App shell, routes, theme wrapper, `.env`, `idmap.json`, `design.pen`                          |
| `packages/core`         | `@oribet/core`         | axios instance, **all API services**, redux store + slices, domain hooks, domain types, utils |
| `packages/ui`           | `@oribet/ui`           | Design primitives + design tokens (`fontSize`, `spacing`, `radii`, `media`, `zIndex`)         |
| `packages/modules`      | `@oribet/modules`      | Feature modules — **`account/` is the current wallet**                                        |
| `packages/templates`    | `@oribet/templates`    | `MainTemplate` — mounts the app-wide modals                                                   |
| `packages/assets`       | `@oribet/assets`       | Icons (`/icons/IconX`), logos, flags, atoms                                                   |
| `packages/locale`       | `@oribet/locale`       | i18n factory + the translation JSONs                                                          |
| `packages/test-ids`     | `@oribet/test-ids`     | The `data-testid` registry (see §8)                                                           |
| `packages/config/theme` | `@oribet/theme-config` | `defaultTheme` — the styled-components theme object                                           |

### 4.2 The wallet you are replacing — exact chain

```
packages/modules/src/app-header/components/DepositView.tsx:128        (single-wallet player)
packages/modules/src/app-header/components/MultiWalletView.tsx:122    (2+ wallets  ← testuser000)
    <DepositButton data-testid="wallet.deposit-open.header" onClick={onOpenDeposit}>
        ↓
packages/modules/src/app-header/AppHeaderAuthorizedContent.tsx:245-260
    picks MultiWalletView vs DepositView by playerInfo.player.wallets.length > 1
        ↓
packages/modules/src/app-header/AppHeader.tsx:50,155
    dispatch(changeGlobalDepositModal(true))
        ↓
packages/core/src/redux/slices/userSlice.ts:27,65,251-253,339
    state.user.globalDepositModal = true          ← the global open flag (no named selector)
        ↓
packages/modules/src/account/ChooseDepositMethodModal/DepositMethodModalShell.tsx:6-13
    reads the flag, renders <ChooseDepositMethodModal isOpen onClose>
        ↑ mounted by
packages/templates/src/main/MainTemplate.tsx:383   <DepositMethodModalShell />
        ↑ mounted by
packages/modules/src/.../AppShell.tsx  →  apps/oribet/src/ClientApp.tsx:49-51,78-79
```

The modal itself: **`packages/modules/src/account/ChooseDepositMethodModal/ChooseDepositMethodModal.tsx`**

- Local step machine: `'choose-method' | 'fiat-select-wallet' | 'fiat-cashier' | 'transfer-crypto' | 'buy-crypto' | 'agentpay'`, reset to `choose-method` every time `isOpen` goes false. It deliberately never auto-skips the chooser (see the comment at L92).
- Renders `<MethodChooser>` on `choose-method` — **this is the screen you are redesigning**
  (`packages/modules/src/account/ChooseDepositMethodModal/MethodChooser.tsx`).
- Method visibility today comes from redux, L45-48:
  `showFiat = !multi_currency.only_crypto`, `showCrypto = multi_currency.has_crypto_wallet`.
  **This is what deliverable 2 removes.**
- Desktop → `CustomModal`; mobile → `MobileContainer`.

Other files in `packages/modules/src/account/` worth knowing:

| File                                                        | Status                                                                               |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `ChooseDepositMethodModal/MethodChooser.tsx`                | The current initial screen. Method cards + the `want_deposit_bonus` toggle.          |
| `ChooseDepositMethodModal/DepositMethodModalShell.tsx`      | Redux ⇄ modal bridge. The only thing `MainTemplate` imports from the account barrel. |
| `OmnoDepositModal/WalletSelector.tsx`                       | Existing "pick a wallet" list (used for the fiat multi-wallet step).                 |
| `OmnoDepositModal/OmnoCashierContainer.tsx`                 | Omno SDK iframe host.                                                                |
| `containers/DepositContainer.tsx` → `Deposit.tsx`           | Legacy crypto deposit (nowpayments direct, not the cashier).                         |
| `DepositModal.tsx`, `OmnoDepositModal/OmnoDepositModal.tsx` | **Dead code** — exported from the barrel, imported by nobody. Do not build on them.  |

The wallet list itself comes from **`playerInfo.player.wallets`** in the `user` slice
(populated from `GET /api/user`), e.g. `packages/modules/src/account/containers/DepositContainer.tsx:15-16`.

### 4.3 Where the API layer lives

`packages/core/src/api/`

- `axios.ts` — the shared instance. Adds `Authorization: Bearer <localStorage.token>` and
  `Accept-Language` to every request. Use it; do not create your own axios.
- `baseUrl.ts` — `getBaseUrl() = VITE_API_URL + '/api'`.
- `services/Account.api.ts` — **`cashierInit`, `updateCashierSession`, `cashierQuote`,
  `transactionsInit`, `getDepositCurrencies` already exist here.** `cashierInit` is currently
  called from nowhere — wiring it up is your job.
- `services/Settings.api.ts:56` — `updateWantDepositBonus(boolean)` → `POST /players`.

There are **no cashier types and no cashier hooks** on this branch. Add them (suggested homes:
`packages/core/src/types/Cashier.type.ts`, `packages/core/src/hooks/wallet/`). Ready-made type
definitions are in §6.6 — copy them.

---

## 5. The Design (`apps/oribet/design.pen`)

`design.pen` **is the specification.** Where this document and the design disagree about
anything visual, the design wins.

`.pen` files are encrypted — you cannot `cat`, `grep`, or diff them, and there is no exported
PNG in the repo. Open them with **Pencil** (pen.dev):

1. Install the Pencil extension for your editor (VS Code / VS Code Insiders) or the Pencil
   desktop app.
2. Open `apps/oribet/design.pen` from this repo. The canvas renders the wallet screens.
3. Inspect elements directly on the canvas for exact geometry, color, and type values.

If you drive an AI agent that has the Pencil MCP server attached, the design file **must be
open in the editor** for the MCP tools to reach it (`get_app_state`, `execute`, `get_style`
all operate on the currently-open `.pen` file; they fail with _"A file needs to be open in the
editor"_ otherwise). Never point `Read`/`Grep` at a `.pen` file.

What "pixel perfect" is graded on:

- Every measurement (padding, gap, height, radius, border width, icon size, font size/weight/
  line-height) matches the design.
- Both breakpoints in the design are implemented. Mobile helpers: `media.sm` = `max-width: 600px`
  (`packages/ui/src/tokens/breakpoints.ts`), and the app has `useIsMobile()`
  (`@oribet/core/hooks/useIsMobile`).
- All interaction states drawn in the design exist in code.
- Values come from theme/tokens where a token matches the design (§10); a raw hex is fine only
  when the design uses a color the theme does not have.

---

## 6. API Reference — `POST /api/cashier/init`

Bootstraps a **payment session** for one wallet and returns everything the wallet screen needs:
the enabled providers, the attachable bonuses, and (after a provider is chosen) the deposit
currencies. This is the only call the initial wallet screen needs.

### 6.1 Auth

Every cashier call is authenticated. Get a token from `POST /api/login`:

```bash
curl -s -X POST 'https://api.oribet.space/api/login' \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"email":"testuser000","password":"TestUser!2"}'
```

> The field is named `email` but accepts the **username** — `{"email":"testuser000"}` is
> correct. Response: `data.access_token.token` (+ `expire_at`) and `data.player`.
> The in-app axios instance reads the token from `localStorage.token` automatically.

Send on cashier calls: `Authorization: Bearer <token>`, `Content-Type: application/json`,
`Accept: application/json`, `Accept-Language: <lang>` (localizes `name` / `desc` maps).

### 6.2 Request

```
POST /api/cashier/init
```

| Field       | Type     | Required                   | Notes                                                                                                                                        |
| ----------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `wallet_id` | `number` | No, but **always send it** | The wallet to fund. Omitted ⇒ the player's default wallet. Since the whole point is "methods for the _selected_ wallet", pass it explicitly. |

```json
{ "wallet_id": 4859 }
```

### 6.3 Response

`200` → `{ "data": CashierSession, "success": true }`

| Field                   | Type                       | Meaning                                                                                                                                                                                                        |
| ----------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uuid`                  | `string`                   | The payment-session id. Sent back as **`payment_session_id`** on every follow-up call.                                                                                                                         |
| `type`                  | `string`                   | `"deposit"`.                                                                                                                                                                                                   |
| `status`                | `string`                   | `"pending"`.                                                                                                                                                                                                   |
| `wallet`                | object                     | `{ id, currency, is_crypto, is_default, balance }` — the wallet this session funds. `balance` is a **number** here (it is a decimal _string_ on `player.wallets`).                                             |
| `currency_wallet`       | `string`                   | Wallet currency, e.g. `"USDT"`.                                                                                                                                                                                |
| `currency`              | `string \| null`           | The **deposit** currency chosen so far (`null` on init).                                                                                                                                                       |
| `provider`              | `string \| null`           | The provider locked onto the session (`null` on init).                                                                                                                                                         |
| `address` / `tag`       | `string \| null`           | Crypto destination — populated later in the flow, not on the first screen.                                                                                                                                     |
| **`providers`**         | `string[]`                 | **Enabled providers for this wallet → drives the method list.** See §7.1.                                                                                                                                      |
| `chosen_bonuses`        | `CashierBonus[]`           | Bonuses currently attached to this session (`[]` on init).                                                                                                                                                     |
| **`available_bonuses`** | `CashierBonus[]`           | **Bonuses this deposit may attach → feeds the bonus dropdown.**                                                                                                                                                |
| `available_currencies`  | `AvailableCurrency[]`      | **`[]` until a provider is set** (§6.5). Then the deposit currencies for that provider.                                                                                                                        |
| `min_deposit_amount`    | `number \| string \| null` | Appears once `currency` is set; minimum in the _deposit_ currency, computed server-side per session (moves with the rate). Distinct from `AvailableCurrency.min_deposit`, which is a static per-network floor. |
| `expires_at`            | ISO-8601                   | Session expiry — **30 minutes** from init.                                                                                                                                                                     |

`CashierBonus` fields that matter to you: `id`, `name` (localized map, e.g. `{"en":"Deposit bonus"}`),
`desc` (localized, may contain HTML), `type`, `is_percent`, `wagering_coefficient`, `expire_in`,
`take_on`, `deposit_count`, and **`currency_config`** — a per-currency map of
`{ amount, max_bet, min_bet, min_deposit, max_amount? }` whose values arrive as **strings or
numbers interchangeably** (`"10"` vs `100`). Always `Number(...)` them.

### 6.4 Live examples

**Crypto wallet (`4859`, USDT)** — abridged, bonuses trimmed:

```bash
curl -s -X POST 'https://api.oribet.space/api/cashier/init' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -H 'Accept: application/json' -H 'Accept-Language: en' \
  -d '{"wallet_id":4859}'
```

```json
{
  "data": {
    "uuid": "74e886cf-7c92-4405-aaac-d7ae418d2539",
    "type": "deposit",
    "status": "pending",
    "wallet": {
      "id": 4859,
      "currency": "USDT",
      "is_crypto": true,
      "is_default": true,
      "balance": 0
    },
    "currency_wallet": "USDT",
    "currency": null,
    "provider": null,
    "address": null,
    "tag": null,
    "providers": ["nowpayments"],
    "chosen_bonuses": [],
    "available_bonuses": [
      {
        "id": 96,
        "name": { "en": "First Deposit 100% BM" },
        "desc": { "en": "First Deposit 100% BM" },
        "type": "play_bonus_money",
        "is_percent": true,
        "wagering_coefficient": 1,
        "expire_in": 10,
        "take_on": "deposit",
        "deposit_count": 1,
        "bm_max_claim_x": 10,
        "currency_config": {
          "USDT": {
            "amount": 100,
            "max_bet": 999,
            "min_bet": 0,
            "max_amount": 500,
            "min_deposit": 0
          },
          "USD": {
            "amount": 100,
            "max_bet": 999,
            "min_bet": 0,
            "max_amount": 500,
            "min_deposit": 0
          },
          "EUR": {
            "amount": 100,
            "max_bet": 999,
            "min_bet": 0,
            "max_amount": 500,
            "min_deposit": 0
          },
          "KRW": { "amount": 0, "max_bet": 0, "min_bet": 0, "max_amount": 12, "min_deposit": 0 }
        }
      },
      {
        "id": 318,
        "name": { "en": "Deposit bonus" },
        "desc": { "en": "<p>Deposit bonus</p>" },
        "type": "play_bonus_money",
        "is_percent": false,
        "wagering_coefficient": 30,
        "expire_in": 30,
        "take_on": "deposit",
        "deposit_count": 1,
        "bm_max_claim_x": 1,
        "currency_config": {
          "USDT": { "amount": "10", "max_bet": "1000", "min_bet": "1", "min_deposit": "50" },
          "USD": { "amount": "10", "max_bet": "1000", "min_bet": "1", "min_deposit": "50" },
          "EUR": { "amount": "10", "max_bet": "1000", "min_bet": "1", "min_deposit": "50" },
          "KRW": { "amount": "10", "max_bet": "1000", "min_bet": "1", "min_deposit": "50" }
        }
      }
    ],
    "available_currencies": [],
    "expires_at": "2026-09-04T09:45:45+00:00"
  },
  "success": true
}
```

**Fiat wallet (`4858`, USD)** — same call with `{"wallet_id":4858}`:

```json
{
  "data": {
    "uuid": "825f6203-9a00-444e-8b61-f70f657f4f55",
    "wallet": {
      "id": 4858,
      "currency": "USD",
      "is_crypto": false,
      "is_default": false,
      "balance": 0
    },
    "currency_wallet": "USD",
    "providers": ["omno"],
    "chosen_bonuses": [],
    "available_bonuses": [
      /* same two bonuses, ids 96 + 318 */
    ],
    "available_currencies": [],
    "expires_at": "2026-09-04T09:46:20+00:00"
  },
  "success": true
}
```

Note the difference — **`["nowpayments"]` vs `["omno"]`**. Same player, same bonuses,
different methods. That is deliverable 2 in one line.

### 6.5 Companion endpoint — `POST /api/cashier/session/update`

You need this on the first screen for two reasons: to attach the chosen bonus, and to lock the
provider when a method is clicked (which is also what populates `available_currencies`).

| Field                       | Type       | Notes                                                                                                                                                                         |
| --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_session_id`        | `string`   | **Required.** The `uuid` from init. The session is identified by this alone.                                                                                                  |
| `wallet_id`                 | `number`   | Switches the session to another wallet — `providers` is recomputed and `provider`/`currency` reset to `null`. A valid alternative to re-initing when the user changes wallet. |
| `provider`                  | `string`   | Must be one of the session's `providers`. Setting it populates `available_currencies`.                                                                                        |
| `currency`                  | `string`   | A `code` from `available_currencies`. Setting it adds `min_deposit_amount`.                                                                                                   |
| `bonus_ids`                 | `number[]` | Replaces `chosen_bonuses` wholesale. `[]` clears. Multiple ids are accepted by the API.                                                                                       |
| `type`                      | `string`   | Only `"deposit"` is valid on this backend; `"withdraw"` returns 422.                                                                                                          |
| `amounts`, `address`, `tag` |            | Later steps — out of scope.                                                                                                                                                   |

Send **only the fields you are changing**. Combining is allowed
(`{ payment_session_id, provider, bonus_ids }` in one call works — verified). Response is the
same full `CashierSession` shape as init, so treat it as "the new session" and replace your state.

```bash
# lock provider + attach bonus in one call
curl -s -X POST 'https://api.oribet.space/api/cashier/session/update' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_session_id":"<uuid>","provider":"nowpayments","bonus_ids":[96]}'
```

After `provider: "nowpayments"` the crypto wallet returns **21** `available_currencies`:

```json
{
  "code": "USDTT",
  "name": "Tron USDT",
  "group_name": "USDT",
  "logo": "https://api.oribet.space/currencies/usdttrc20.svg",
  "type": "crypto",
  "network_code": "TRC20",
  "network_name": "Tron (TRC-20 token)",
  "deposit_active": true,
  "withdrawal_active": true,
  "requires_tag": false,
  "min_deposit": null,
  "max_deposit": null,
  "min_withdraw": null,
  "max_withdraw": null
}
```

Codes seen on this backend: `ADA BCH BSC BTC BUSD DAI DOGE ETH LTC TRX USDC USDCS USDTB USDTS
USDTTON VERSE XRP TON SOL USDTE USDTT`. Several share a `group_name` (five map to `USDT`) —
group by `group_name` when you get to a currency picker. `requires_tag: true` on `XRP`, `TON`,
`USDTTON`.

After `provider: "omno"` the fiat wallet returns **3**: `USD`, `EUR`, `KRW`, with
`type: "fiat"`, `network_code: null`, and — watch out — **`logo: {}`** (an empty object, not a
string). Guard with `typeof logo === 'string'`.

### 6.6 TypeScript contract

Drop this in `packages/core/src/types/Cashier.type.ts`:

```ts
/** Per-currency limits on a bonus (values may arrive as strings or numbers). */
export interface CashierBonusCurrencyConfig {
  amount: string | number
  max_bet: string | number
  min_bet: string | number
  min_deposit: string | number
}

/** Bonus entry from the cashier session (`available_bonuses` / `chosen_bonuses`). */
export interface CashierBonus {
  id: number
  /** Localized name — string or `{ en, ko, … }`. */
  name: string | Record<string, string>
  type?: string
  wagering_coefficient?: number
  is_percent?: boolean
  currency_config?: Record<string, CashierBonusCurrencyConfig>
  [key: string]: unknown
}

/** Deposit currency delivered inline on the session (`available_currencies`). */
export interface AvailableCurrency {
  code: string
  name: string
  group_name: string
  /** URL string for crypto; `{}` for fiat. */
  logo: string | Record<string, never>
  type: string
  network_code: string | null
  network_name: string | null
  deposit_active: boolean
  withdrawal_active?: boolean
  /** Memo/tag networks (TON, XRP) need a destination tag alongside the address. */
  requires_tag?: boolean
  min_deposit: number | null
  max_deposit?: number | null
}

/** `data` payload from `/cashier/init` and `/cashier/session/update`. */
export interface CashierSession {
  /** Payment session uuid — sent as `payment_session_id` on updates. */
  uuid: string
  type: string
  status: string
  wallet: {
    id: number
    currency: string
    is_crypto: boolean
    is_default: boolean
    balance: number
  }
  currency_wallet: string
  currency: string | null
  provider: string | null
  address?: string | null
  tag?: string | null
  /** Enabled providers for this wallet — drives which deposit methods show. */
  providers: string[]
  chosen_bonuses: CashierBonus[]
  available_bonuses: CashierBonus[]
  /** Empty until a provider is locked onto the session. */
  available_currencies?: AvailableCurrency[]
  /** Minimum deposit for the locked currency, in that deposit currency. */
  min_deposit_amount?: number | string | null
  expires_at: string
}
```

`Account.api.ts` returns raw axios responses, so the payload is at `response.data.data`.

> House rule: **never use `any`** unless genuinely unavoidable. `[key: string]: unknown` (as
> above) is the escape hatch for the loosely-typed bonus fields.

### 6.7 Session lifecycle — the rules that will bite you

1. **One live session per player.** Calling `/cashier/init` again _invalidates the previous
   session_. The old `uuid` then fails every call with
   `422 {"data":{"error":"This payment session has expired or has already been used"},"success":false}`.
   Keep exactly one session in state and replace it wholesale on every response.
2. **30-minute TTL** (`expires_at`). Past that, same 422.
3. **Sessions are single-use once consumed** by a downstream method. If the user backs out of a
   method to the initial screen, re-init rather than reusing the session.
4. **Every response is the whole session.** `session/update` returns the same shape as `init` —
   don't merge field-by-field, just store the new object.
5. Switching wallet → either `session/update` with `wallet_id`, or a fresh `init`. Both reset
   `provider` and `currency` to `null` and recompute `providers`.

### 6.8 Error catalogue (all observed live)

| Status | Body                                                                                              | Cause                                            |
| ------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `401`  | `{"message":"Unauthenticated."}`                                                                  | Missing/expired bearer token.                    |
| `404`  | `{"data":{"error":"Wallet not found or not active"},"success":false}`                             | `wallet_id` isn't this player's, or is inactive. |
| `422`  | `{"data":{"error":"This payment session has expired or has already been used"},"success":false}`  | Stale / superseded / consumed session. Re-init.  |
| `422`  | `{"success":false,"message":"The selected provider is invalid.","data":{"provider":["…"]}}`       | `provider` not in the session's `providers`.     |
| `422`  | `{"success":false,"message":"The selected bonus_ids.0 is invalid.","data":{"bonus_ids.0":["…"]}}` | Bonus id not in `available_bonuses`.             |
| `422`  | `{"success":false,"message":"The selected type is invalid.","data":{"type":["…"]}}`               | `type` other than `deposit`.                     |
| `405`  | `MethodNotAllowedHttpException`                                                                   | Used `GET`. Both cashier endpoints are `POST`.   |

Note the **two different error envelopes** — top-level `message` + per-field `data` for
validation, versus `data.error` for domain errors. `packages/core/src/util/extractApiError.ts`
already normalizes both; use it for snackbar text.

### 6.9 Endpoints you might find but should _not_ use for this task

| Endpoint                                                 | Why not                                                                                                                                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/cashier/currencies/deposit`                    | The full unfiltered currency list across all providers. The session's `available_currencies` is the per-provider, per-wallet subset — use that.                                                            |
| `GET /api/bonus/deposit`                                 | A separate legacy bonus feed (`player_bonuses` + `available_bonuses`, different field shapes). The **bonus dropdown must use the session's `available_bonuses`**, which is already scoped to this deposit. |
| `GET /api/settings/system` → `multi_currency`            | What the old code gates methods on. Explicitly replaced by `session.providers`. (It is still legitimately used elsewhere for currency lists / branding.)                                                   |
| `POST /api/transactions/deposit`                         | The legacy per-provider deposit call used by `Deposit.tsx` / `Omno.api.ts`. Not part of the cashier session flow.                                                                                          |
| `POST /api/cashier/quote`, `POST /api/transactions/init` | Later steps of the flow — out of scope (§12).                                                                                                                                                              |

---

## 7. Wiring Rules

### 7.1 Payment methods ← `session.providers`

The method list is derived **solely** from the session's `providers`. No legacy/non-cashier
method may appear. Mapping:

| Provider      | Method         | Suggested copy (i18n keys)                                                  |
| ------------- | -------------- | --------------------------------------------------------------------------- |
| `omno`        | **Card**       | `wallet.card` / `wallet.cardDesc` → "Card" / "Cards & local methods"        |
| `nowpayments` | **Crypto**     | `account.cryptoMethod` / `wallet.depositWithCrypto` → "Deposit with crypto" |
| `changelly`   | **Buy Crypto** | `account.buyCrypto` / `wallet.buyCryptoDesc` → "Buy crypto with card"       |
| `agentpay`    | **Bank**       | `wallet.bank` / `wallet.bankTransfer`                                       |

Requirements:

- Render one card per provider present, in the order the design specifies.
- With `testuser000`: wallet **4859 shows Crypto only**, wallet **4858 shows Card only**.
- Selecting a wallet re-drives the list (via `wallet_id` on `session/update`, or a fresh init).
- Clicking a method **locks the provider onto the session** (`session/update` with `provider`,
  plus the current `bonus_ids`) _before_ advancing, and the click must show a pending state
  while that resolves. Failure → snackbar via `extractApiError`, stay on the screen.
- Empty `providers` → the design's empty state (`wallet.noMethods` = "No deposit methods
  available"). Init failure → an error state with a retry that re-inits (do **not** leave a
  permanent "Loading…", and remember a single-wallet player has no chooser to go back to).

### 7.2 Bonus selection dropdown ← `session.available_bonuses`

A collapsible selector whose header shows the current pick and whose expanded list shows the
options, per the design.

- **Options:** one row per entry in `session.available_bonuses`, **plus a "No bonus" row**
  (`wallet.noBonusTitle` / `wallet.noBonusDesc`).
- **Single-select** in the UI, even though the API accepts an array — send `[id]` or `[]`.
- **Row labels:** `name` and `desc` are **localized maps**. Use
  `getLocalizedString(value)` from `@oribet/core/util/appUtil` — never render the object.
  `desc` can contain HTML (`"<p>Deposit bonus</p>"`); strip or sanitize it (`xss` is already a
  dependency), don't dump raw markup.
- **Fallback subtitle** when a bonus has no description: the min deposit —
  `Number(bonus.currency_config?.[walletCurrency]?.min_deposit)` — else
  `Wagering ×{wagering_coefficient}`. Read `currency_config` with the **wallet** currency
  (`session.wallet.currency`), and coerce with `Number()` (values are strings or numbers).
- **Min-deposit hint:** when the selected bonus has `min_deposit > 0`, surface
  `wallet.bonusMinDepositInfo` — _"Deposit at least {{amount}} {{currency}} to receive the
  "{{bonus}}" bonus. A smaller deposit will not qualify for it."_
- **Persist the pick** onto the session: `session/update` with `bonus_ids`. Verify by
  re-reading `chosen_bonuses` from the response.
- **Re-validate on every new session.** A re-init can return a different `available_bonuses`;
  a pick that is no longer offered must be dropped, not carried over. A still-valid pick should
  survive a benign re-init.
- **`want_deposit_bonus` interaction.** `playerInfo.player.want_deposit_bonus` (default `true`
  when absent) is a _global account preference_, separate from the per-deposit pick. Keep the
  existing semantics: when it is `false`, the selector reads "No bonus" and no bonus rides
  along. Choosing "No bonus" while it is `true` requires an explicit confirmation before
  calling `updateWantDepositBonus(false)` (copy: `deposit.disableAutoBonuses` /
  `deposit.disableAutoBonusesDesc`, buttons `common.cancel` / `common.confirm`). Picking a real
  bonus while it is `false` turns it back on **without** a prompt.
- With `testuser000` both wallets offer bonuses **96** ("First Deposit 100% BM", percent-type,
  `min_deposit: 0`) and **318** ("Deposit bonus", fixed, `min_deposit: "50"`) — so bonus 318 is
  the one that must show the min-deposit hint.

### 7.3 Wallet selection

`playerInfo.player.wallets` (from `GET /api/user`) is the source. `testuser000` has two, so a
wallet selector must be reachable and switching must re-drive §7.1. `WalletSelector.tsx` and
the `wallet.select.card` / `wallet.select.change-wallet` test-ids already exist — reuse or
replace them as the design requires.

---

## 8. Test IDs and the ID map (not optional)

QA automation targets `data-testid`s from a generated, gated artifact. **A PR that adds
interactive elements without ids fails CI.** Full explanation: `docs/test-automation.md`.

How it works:

| Piece                                     | Location                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| Registry (single source of truth)         | `packages/test-ids/src/*.ts` — deposit/wallet ids live in `deposit.ts` |
| Feature catalog + id→feature rules        | `packages/test-ids/src/features.ts`                                    |
| App manifest (what the app _should_ ship) | `apps/oribet/config/site-features.ts`                                  |
| Generator + coverage gate                 | `pnpm gen:idmap` → rewrites `apps/oribet/idmap.json`                   |
| Completeness linter                       | `pnpm idmap:lint`                                                      |

Rules:

1. **Never inline a testid string.** Add a constant to `packages/test-ids/src/deposit.ts` and
   import it. Collections (one id per item) use the documented `<id>.<suffix>` convention, e.g.
   `wallet.deposit-open.header`, `wallet.deposit.method.crypto`.
2. `@oribet/ui` primitives take a **`testId` prop** which they forward as `data-testid` onto the
   real interactive element. `CustomSelect` also auto-derives `${testId}.${value}` per option,
   `${testId}.search`, and `${testId}-error` — check whether that satisfies the design before
   hand-rolling a dropdown.
3. Raw interactive JSX (`div` acting as a button, `button`, `input`, `a`) needs an explicit
   `data-testid`. Genuine exceptions get an inline `// idmap-ignore: <reason>` comment — that's
   how the existing structural modal wrappers opt out.
4. New ids must be classified in `features.ts` so the coverage gate can place them. Existing
   prefix rules relevant here:
   `wallet.deposit-open` → `wallet.deposit` · `deposit.method.*` → `wallet.deposit` ·
   `deposit.crypto.*` → `deposit.crypto` · `deposit.omno.*` → `deposit.omno` ·
   `wallet.balance.*` → `wallet.balance` · `wallet.switch.*` → `wallet.switch` ·
   `wallet.bonus.*` → `wallet.bonus` · and `wallet.modal.* | wallet.tab | wallet.deposit.* |
wallet.withdraw.* | wallet.bonus-select.* | wallet.select.*` → `wallet.deposit`.
5. Run `pnpm gen:idmap` and **commit the regenerated `apps/oribet/idmap.json`**. Then
   `pnpm idmap:lint` must be clean.

Already-registered ids you can use as-is (`packages/test-ids/src/deposit.ts`):

```
WALLET_TEST_IDS  (constant path → emitted data-testid)
  modal.root            → wallet.modal.root
  modal.close           → wallet.modal.close
  modal.closeConfirm    → wallet.modal.close-confirm
  modal.closeDismiss    → wallet.modal.close-dismiss
  tab.root              → wallet.tab                    collection: .deposit|.withdraw|.transactions
  deposit.back          → wallet.deposit.back
  deposit.method        → wallet.deposit.method         collection: .<crypto|bank|omno|changelly>
  deposit.currencyOption→ wallet.deposit.currency-option    collection: .<code>
  deposit.networkOption → wallet.deposit.network-option     collection: .<network>
  deposit.cryptoAmount  → wallet.deposit.crypto-amount
  deposit.cryptoContinue→ wallet.deposit.crypto-continue
  deposit.addressCopy   → wallet.deposit.address-copy
  bonus.header          → wallet.bonus-select.header    ← the bonus dropdown trigger
  bonus.option          → wallet.bonus-select.option    collection: .<none|id>
  bonus.disableConfirm  → wallet.bonus-select.disable-confirm
  bonus.disableCancel   → wallet.bonus-select.disable-cancel
  select.card           → wallet.select.card            collection: .<walletId>
  select.changeWallet   → wallet.select.change-wallet

DEPOSIT_TEST_IDS
  open                  → wallet.deposit-open           collection: .header|.wallet-card.<currency>|…
  method.fiat|crypto|buyCrypto|agentPay → deposit.method.<fiat|crypto|buy-crypto|agent-pay>
  method.bonusToggle|bonusConfirm|bonusCancel → deposit.method.bonus-<toggle|confirm|cancel>
  omno.walletOption     → deposit.omno.wallet-option    collection: .<currency>
  wallet.balancePill    → wallet.balance.pill
  wallet.expand         → wallet.balance.expand
  wallet.switchCard     → wallet.switch.card            collection: .<currency>
  walletModal           → WALLET_TEST_IDS (nested re-export)
```

`WALLET_TEST_IDS` is currently **registry-only** in this build — nothing renders those ids
because the component that used to has been removed. It is a ready-made vocabulary for exactly
the surface you are building; prefer extending it over inventing a parallel one. If the design
needs ids it doesn't cover (a session error/retry state, for instance), add them there.

---

## 9. i18n

Flat dotted keys in one `translation` bundle with **`keySeparator: false`** — `wallet.card` is a
literal key, not a nested path.

- Canonical English: `packages/locale/src/translations/en.json` (plus `ar de es ko pt ru tr …`).
- Factory: `packages/locale/src/createI18n.ts`.
- App wiring: `apps/oribet/src/locale/i18n.tsx` — it rebrands `asdfbet` → `oribet` in every
  value and passes the result as `overrides`.
- Usage: `const { t } = useTranslation()` → `t('wallet.card')`.

**Most of the copy you need already exists.** Verified present in `en.json`:

```
wallet.card                 "Card"
wallet.cardDesc             "Cards & local methods"
wallet.bank                 "Bank"
wallet.bankTransfer         "Bank transfer"
wallet.depositWithCrypto    "Deposit with crypto"
wallet.buyCryptoDesc        "Buy crypto with card"
wallet.noMethods            "No deposit methods available"
account.cryptoMethod        "Crypto"
account.chooseDepositMethod "Choose Deposit Method"
account.deposit             "Deposit"
account.selectWallet        "Select Wallet"
header.deposit              "Deposit"

deposit.depositBonus        "Deposit Bonus"
deposit.wantDepositBonus    "I want to use deposit bonus"
deposit.disableAutoBonuses / .disableAutoBonusesDesc
deposit.enableAutoBonuses  / .enableAutoBonusesDesc
wallet.noBonusTitle         "No bonus"
wallet.noBonusDesc          "Don't use a deposit bonus"
wallet.bonusMinDepositInfo  "Deposit at least {{amount}} {{currency}} to receive the “{{bonus}}” bonus. …"
wallet.minimumDeposit / wallet.wagering / wallet.minimum

wallet.balanceOverview      "{{currency}} Balance Overview"
wallet.realBalance "Real Balance" · wallet.real "REAL" · wallet.bonus "BONUS"
wallet.switch "SWITCH" · wallet.inPlay "In Play" · wallet.balance "Balance"
wallet.bonusBalance "Bonus Balance"

common.back "Back" · common.cancel "Cancel" · common.confirm "Confirm"
common.close "Close" · common.error "Something went wrong" · common.loading "Loading…"
common.tryAgain "Try again" · common.done "Done" · common.ok / common.no
wallet.closeConfirmMessage / wallet.closeConfirmKeepOpen
```

There is **no `common.retry`** — use `common.tryAgain`, or add a new key.

Add genuinely new strings to `en.json` (English is enough for this task) — never hardcode
user-facing text in a component. `t('x', { defaultValue: 'X' })` is the accepted pattern in this
codebase for a key that may be missing in some locale.

---

## 10. Styling, tokens, primitives, gotchas

### Theme

styled-components with a typed theme (`AppTheme` in `packages/ui/src/theme/theme.ts`, values in
`packages/config/theme/src/defaultTheme.ts`). Read it as `({ theme }) => theme.colors.…`:

```
colors.bg.primary #0d121d · bg.secondary #111827 · bg.tertiary #030712 · bg.input #101827
colors.text.primary #ffffff · text.secondary #9CA3AF · text.tertiary #8290a0 · text.icon #8290a0
colors.accent.primary #ECC53A · accent.secondary #BD8709 · accent.brand #1D4ED8 · accent.info #3B82F6
colors.surface.hover #1f2937 · surface.active #374151 · surface.border #374151
colors.surface.borderSubtle #1f2937 · surface.card #111827
colors.success #84CC16 · colors.error #CA1515 · colors.warning #ECC53A
colors.button.primary / .secondary / .action.*   (bg, hover, active, text, boxShadow, border)
```

### Tokens (`@oribet/ui`)

```
fontSize   xs 10 · sm 12 · base 14 · lg 16 · xl 18 · 2xl 24 · 3xl 32   (rem-based)
fontWeight normal 400 · medium 600 · bold 700
lineHeight tight 16 · normal 24 · relaxed 32
spacing    4px grid — spacing[1]=4 … spacing[4]=16 … spacing[24]=96
radii      sm 4 · md 8 · lg 10 · xl 12 · 2xl 16 · full 9999
media      sm 600 · md 768 · lg 1024 · xl 1200  (+ media.up.* for min-width)
zIndex, duration, easing, transition
```

Font: Titillium Web (`@fontsource/titillium-web`, weights 200–900 loaded in `ClientApp.tsx`).
Root font-size drops to 15px under 600px, so rem-based sizes shrink ~6% on mobile — worth
knowing when you compare against the design.

### Primitives (`@oribet/ui`)

`CustomModal` · `MobileContainer` · `Container` · `BoxContainer` · `Popover` · `Tooltip` ·
`CustomPrimaryButton` / `CustomSecondaryButton` / `CustomMinimalButton` / `CustomBonusButton` /
`DepositButton` · `CustomSelect` / `Select` · `CustomInput` · `CustomCheckBox` · `Spinner` ·
`Skeleton` · `NewTabComponent` · `OribetPagination` · `ErrorBoundary` · `Snackbar` ·
`useClickOutside` · `IconChevronDown/Left/Right`, `IconEye`.
Icons: `@oribet/assets/icons/IconX` — `IconGiftBox`, `IconWallet`, `IconDeposit`,
`IconChevronDown/Left/Right`, `IconInfo`, `IconArrowBack`, and ~95 more.

### Gotchas

- **`CustomModal` renders a bare, transparent container.** `ModalContainer` has no background,
  radius, border, or padding. Content passed to it must bring its own surface —
  `background: theme.colors.bg.secondary`, a radius, padding, an inset border
  (`box-shadow: inset 0 0 0 1px ${theme.colors.surface.borderSubtle}`) and a bounded width —
  or it floats see-through over the backdrop. This has bitten this repo twice.
- Snackbars: `notistack` (`enqueueSnackbar(msg, { variant: 'error' })`).
- Server state: React Query is already provided at the root (`ClientApp.tsx`). `useMutation`
  for the cashier calls fits the existing style (`useCreateOmnoCashierSession.ts` is the
  pattern).
- `packages/ui` is consumed as **source**, and `styled-components` / `react` are deduped in
  `vite.config.ts` — don't add a second copy of either.
- Wallet balances are decimal **strings** on `player.wallets` but a **number** on
  `session.wallet.balance`. Coerce.

---

## 11. Passing Criteria

### Design

- [ ] The initial wallet screen matches `apps/oribet/design.pen` at the pixel level — spacing,
      sizes, radii, colors, typography, icon sizes.
- [ ] Every state drawn in the design is implemented (default, hover, pressed, disabled,
      loading, empty, error).
- [ ] Desktop and mobile both match the design.
- [ ] Theme tokens / theme colors used wherever the design's value exists as a token.
- [ ] No layout shift or overflow at 320px, 375px, 768px, 1280px, 1920px.

### Payment methods

- [ ] `POST /api/cashier/init` is called with the **selected** `wallet_id` when the wallet opens.
- [ ] The method list is derived from `session.providers` only — no `multi_currency` gating, no
      hardcoded list, no legacy method leaking in.
- [ ] Mapping honoured: `omno`→Card, `nowpayments`→Crypto, `changelly`→Buy Crypto,
      `agentpay`→Bank.
- [ ] With `testuser000`: wallet `4859` (USDT) shows **Crypto only**; wallet `4858` (USD) shows
      **Card only**; switching between them updates the list without a page reload.
- [ ] Clicking a method locks the provider via `session/update` (with the current `bonus_ids`),
      shows a pending state, and only then advances / hands off.
- [ ] Empty `providers` → the design's empty state. Init failure → error + working retry, never
      an infinite "Loading…".

### Bonus dropdown

- [ ] Options come from `session.available_bonuses`, plus a "No bonus" option.
- [ ] Selecting a bonus is possible and visibly reflected in the collapsed header.
- [ ] The pick is persisted via `session/update` `bonus_ids` and is present in the response's
      `chosen_bonuses`.
- [ ] Localized `name` / `desc` maps are rendered via `getLocalizedString`; no `[object Object]`,
      no raw HTML tags on screen.
- [ ] `currency_config` values read with `Number()` against the **wallet** currency; bonus 318
      shows its `min_deposit` of 50, bonus 96 does not.
- [ ] A pick that is not in a newly-initialised session's `available_bonuses` is dropped, not
      carried over.
- [ ] `want_deposit_bonus` semantics preserved: "No bonus" while it is on asks for confirmation
      then calls `updateWantDepositBonus(false)`; picking a bonus while it is off re-enables it
      silently.

### Engineering

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` all pass.
- [ ] `pnpm gen:idmap` run and the regenerated `apps/oribet/idmap.json` committed;
      `pnpm idmap:lint` clean.
- [ ] Every new interactive element has a `data-testid` from `@oribet/test-ids` (or a justified
      `// idmap-ignore:`). No inline testid strings.
- [ ] **No `any`.**
- [ ] No new user-facing string hardcoded in a component.
- [ ] Cashier session state is single and replaced wholesale; no stale-uuid 422s in the console
      during normal use.
- [ ] API errors surface through `extractApiError` + a snackbar; nothing fails silently.
- [ ] `pnpm format` run; the diff contains no unrelated reformatting.
- [ ] Reasonable commit granularity, and `apps/oribet/.env` **not** committed.

---

## 12. Out of Scope

Do not build, and do not refactor:

- Anything after a method is selected: deposit address / QR screens, amount entry,
  `POST /api/cashier/quote`, `POST /api/transactions/init`, the omno iframe, Changelly offers.
- Withdrawals, transaction history, and the withdrawal wagering lock.
- The header balance pill / wallet dropdown, the sidebar, the lobby.
- Login, registration, KYC.
- Other brands (`apps/oribet-korea|africa|turkey|redesign`).
- Backend changes of any kind.

If the design shows later screens, implement **only the initial screen** and leave the existing
downstream flows reachable (an existing screen appearing after your new chooser is fine).

---

## 13. Troubleshooting

| Symptom                                                      | Cause / fix                                                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Every request CORS-blocked                                   | Not on `localhost:3000`. Kill whatever holds the port and restart (§2.5).                                                                        |
| `TS2307: Cannot find module '@oribet/ui'` (and friends)      | Stale/partial install. `pnpm install` at the repo root.                                                                                          |
| `401 Unauthenticated`                                        | No token in `localStorage`. Log in again; the axios interceptor reads `localStorage.token`.                                                      |
| `422 "payment session has expired or has already been used"` | You re-inited (invalidating the old uuid), the 30-min TTL lapsed, or the session was consumed. Keep one session; re-init on re-entry (§6.7).     |
| `422 "The selected provider is invalid."`                    | Sent a provider not in `session.providers`.                                                                                                      |
| `available_currencies` always empty                          | Expected on init — it populates only after `provider` is set (§6.5).                                                                             |
| Modal content floats transparent over the backdrop           | `CustomModal` has no surface of its own (§10 Gotchas).                                                                                           |
| Bonus row shows `[object Object]`                            | `name` / `desc` are localized maps — use `getLocalizedString`.                                                                                   |
| Only one method ever shows                                   | You're probably still reading `multi_currency` instead of `session.providers`, or always initing the default wallet instead of the selected one. |
| `pnpm gen:idmap` fails the coverage gate                     | A feature is `true` in `apps/oribet/config/site-features.ts` but its registry ids aren't wired. Read `docs/test-automation.md` §2.               |
| `pnpm idmap:lint` flags an element                           | Add a registry testid, or an inline `// idmap-ignore: <reason>`.                                                                                 |

---

## 14. Reference Index

**In-repo docs**

| Path                                  | What                                                        |
| ------------------------------------- | ----------------------------------------------------------- |
| `CLAUDE.md`                           | House rules, tech stack, project structure, UI gotchas      |
| `README.md`                           | Monorepo overview                                           |
| `docs/test-automation.md`             | The test-id / idmap system in full (read before adding ids) |
| `docs/NEW-APP.md`                     | App composition + the override ladder                       |
| `docs/overrides.md`                   | Per-app divergence mechanisms                               |
| `docs/site-functionality-overview.md` | Feature-by-feature product overview                         |
| `apps/oribet/README.md`               | App scripts, env vars, path aliases                         |

**Key files for this task**

| Path                                                               | Why                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `apps/oribet/design.pen`                                           | **The design — source of truth**                                            |
| `apps/oribet/config/site-features.ts`                              | Which features this build ships                                             |
| `apps/oribet/.env`                                                 | You create it (§2.3)                                                        |
| `apps/oribet/idmap.json`                                           | Generated; must be regenerated + committed                                  |
| `packages/core/src/api/services/Account.api.ts`                    | `cashierInit` / `updateCashierSession` live here                            |
| `packages/core/src/api/axios.ts`, `baseUrl.ts`                     | Auth header + base URL                                                      |
| `packages/core/src/redux/slices/userSlice.ts`                      | `globalDepositModal`, `playerInfo.player.wallets`, `changeWantDepositBonus` |
| `packages/core/src/util/appUtil.ts`                                | `getLocalizedString`                                                        |
| `packages/core/src/util/extractApiError.ts`                        | Error → message                                                             |
| `packages/core/src/util/currency.ts`                               | `getActiveCurrencySymbol`                                                   |
| `packages/modules/src/account/ChooseDepositMethodModal/`           | The wallet you're replacing                                                 |
| `packages/modules/src/account/OmnoDepositModal/WalletSelector.tsx` | Existing wallet picker                                                      |
| `packages/templates/src/main/MainTemplate.tsx:383`                 | Where the modal is mounted                                                  |
| `packages/test-ids/src/deposit.ts`                                 | `WALLET_TEST_IDS` + `DEPOSIT_TEST_IDS`                                      |
| `packages/test-ids/src/features.ts`                                | id → feature rules                                                          |
| `packages/ui/src/index.ts`                                         | The primitive + token barrel                                                |
| `packages/config/theme/src/defaultTheme.ts`                        | Theme values                                                                |
| `packages/locale/src/translations/en.json`                         | Copy                                                                        |

**API quick reference**

| Method | Path                          | Purpose                                                          |
| ------ | ----------------------------- | ---------------------------------------------------------------- |
| `POST` | `/api/login`                  | `{email: "<username>", password}` → bearer token                 |
| `GET`  | `/api/user`                   | Player + **`wallets[]`** + `default_wallet`                      |
| `POST` | **`/api/cashier/init`**       | `{wallet_id}` → session: `providers`, `available_bonuses`        |
| `POST` | `/api/cashier/session/update` | `{payment_session_id, …changed fields}` → updated session        |
| `POST` | `/api/players`                | `{want_deposit_bonus}` — the global bonus preference             |
| `GET`  | `/api/settings/system`        | Brand config (`payment_providers`, `multi_currency`, currencies) |

**Test credentials:** `testuser000` / `TestUser!2` — wallets `4859` (USDT, crypto,
`nowpayments`) and `4858` (USD, fiat, `omno`); bonuses `96` and `318` available on both.

---

## 15. Questions to raise before you start (if the design leaves them open)

- Does the design keep the modal's wallet-selection step, or show wallets inline on the initial
  screen?
- Is the bonus dropdown single-select only, or does the design allow stacking (the API accepts
  multiple `bonus_ids`)?
- Should the initial screen pre-select a bonus (the first available) or open on "No bonus"?
- Where does the design put the session error/retry state, and does it need new test-ids?
