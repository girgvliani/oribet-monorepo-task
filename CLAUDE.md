# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## General

- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

- When refactoring, do not assume I want you to keep the same functionality elsewhere unless explicitly stated. If in a single request I tell you to remove some part of the program and do something in another, do not re-implement the removed feature elsewhere unless specifically stated, remove it.

- Some files will have overwrites by the developer which are done temporarily for testing purposes (e.g., themewrapper changes). Do not flag them as bugs.

## UI gotchas

- `@oribet/ui` `CustomModal` renders a **bare, transparent** container (`ModalContainer` has no bg/radius/border/padding). Any content passed to it MUST bring its own surface — `background: bg.secondary`, `border-radius`, padding, an inset border (`box-shadow: inset 0 0 0 1px surface.borderSubtle`), and a bounded width — or it floats see-through over the backdrop. (Recurred twice: cancel-bonus modal `7eb3f5e`, korea update-phone modal.)

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questioons extremely concise. Sacrifice grammar for the sake of concision.

---

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: React 19, TypeScript, Vite, styled-components
- **State**: Redux Toolkit (slices) + React Query
- **Routing**: react-router v7
- **Realtime**: socket.io-client
- **i18n**: i18next (7 languages)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Project Structure

- After any changes to the project structure are made, make sure to update the project structure in the claude.md file to keep the documentation up to date.

```
oribet-monorepo/
├── apps/
│   └── oribet/                  # Main frontend app (@oribet/app-oribet)
│       └── src/
│           ├── api/             # API layer
│           │   ├── axios.tsx        # Axios instance & interceptors
│           │   ├── baseUrl.ts       # API base URL config
│           │   ├── oribet.socket.ts # Socket.io connection
│           │   ├── services/        # API service modules (Auth, Game, Bonus, User, etc.)
│           │   └── types/           # API-specific types
│           ├── components/      # Presentational / UI components
│           │   ├── common/          # Reusable UI primitives (Buttons, Inputs, Modal, Spinner, etc.)
│           │   ├── modals/          # App-wide modals & modal wrappers
│           │   ├── Casino/          # Casino game views
│           │   ├── Bonus/           # Bonus display components
│           │   ├── GameCard/        # Game card rendering
│           │   ├── PlayGamePage/    # In-game play page
│           │   ├── Account/         # Account/wallet UI
│           │   ├── AppHeader/       # Top navigation bar
│           │   ├── AppSidebar/      # Side navigation
│           │   └── ...              # Other feature components
│           ├── containers/      # Smart/connected components (data fetching, routing logic)
│           │   ├── App/             # Root app container
│           │   ├── AppRoutes.tsx    # All route definitions
│           │   ├── Layout/          # Page layout wrappers
│           │   ├── Casino/          # Casino page container
│           │   ├── Login/           # Login flow
│           │   ├── Registration/    # Registration flow
│           │   └── ...              # Other page containers
│           ├── redux/           # Redux store
│           │   ├── store.ts         # Store configuration
│           │   ├── hooks.ts         # Typed useSelector/useDispatch
│           │   └── slices/          # Feature slices (user, game, config, settings, sports, blogs)
│           ├── hooks/           # Custom React hooks
│           │   ├── user/            # Auth & user-related hooks
│           │   ├── wallet/          # Wallet/balance hooks
│           │   ├── game/            # Game-related hooks
│           │   └── bonus/           # Bonus-related hooks
│           ├── types/           # Shared TypeScript types (Auth, Game, Bonus, etc.)
│           ├── styles/          # Global styles & theming (styled-components theme)
│           ├── locale/          # i18n translation JSONs (en, es, de, ru, ar, pt, tr)
│           ├── util/            # Helpers (route paths, defaults, formatting)
│           ├── assets/          # Static images & icons
│           └── lotties/         # Lottie animation files
├── packages/
│   ├── ui/                        # Shared UI component library (@oribet/ui)
│   │   └── src/
│   │       ├── index.ts           # Barrel export
│   │       ├── theme/             # AppTheme interface + styled.d.ts augmentation
│   │       ├── types/             # IReactIcon interface
│   │       ├── icons/             # IconChevronDown/Left/Right, IconEye
│   │       └── components/        # All shared UI primitives
│   │           ├── Skeleton/
│   │           ├── BoxContainer/
│   │           ├── ButtonContainer/
│   │           ├── CheckBox/
│   │           ├── Spinner/
│   │           ├── Buttons/       # Primary, Secondary, Minimal, Bonus, Deposit
│   │           ├── Modal/
│   │           ├── Popover/
│   │           ├── Tooltip/
│   │           ├── Tab/
│   │           ├── Select/        # Select + CustomSelect
│   │           ├── Inputs/        # CustomInput
│   │           └── Pagination/    # OribetPagination
│   ├── assets/                    # Shared static assets (@oribet/assets)
│   │   └── src/
│   │       ├── flags/             # Country/language flags (8 files)
│   │       ├── icons/             # App icons (95 files)
│   │       ├── logos/             # Brand + payment logos (18 files)
│   │       └── atoms/             # Decorative SVG components (25 files)
│   ├── locale/                    # i18n factory + default translations (@oribet/locale)
│   │   └── src/
│   │       ├── createI18n.ts      # Factory accepting { fallbackLng, langs, overrides }
│   │       ├── defaults.ts        # defaultTranslations, supportedLangs
│   │       └── translations/      # 7 JSONs: en, ar, de, es, pt, ru, tr
│   ├── core/                      # Business infra (@oribet/core)
│   │   └── src/
│   │       ├── api/               # axios, baseUrl, socket, 20 services, types
│   │       ├── redux/             # store, hooks, selectors, 6 slices, types
│   │       ├── hooks/             # Custom hooks (bonus/, game/, socket/, user/, wallet/, and top-level)
│   │       ├── util/              # appRoutePath, appUtil, defaults, constants (SLOTSOFT), UserProfileHelper, SidebarListHelper, extractApiError, resolveAvatarUrl
│   │       └── types/             # Domain types (Auth, Bonus, Game, Wallet, Chat, LeaderBoard, common, seo)
│   ├── modules/                   # Feature modules (@oribet/modules)
│   │   └── src/
│   │       ├── lobby/             # Lobby.tsx, LobbyContainer, Banner, LobbyCard, LobbyTabItem, OribetSwitcher...
│   │       ├── game-swiper/       # GameSwiper
│   │       ├── game-card/         # GameCard, GameCardSkeleton, PlayButton, BonusModeMask
│   │       ├── sport-swiper/      # SportSwiper, SportCardItem
│   │       ├── provider-swiper/   # ProviderSwiper, ProviderCardItem
│   │       ├── bets-table/        # BetsTable + container
│   │       ├── recent-wins/       # RecentWins + container
│   │       ├── no-crypto-banner/  # NoCryptoBanner
│   │       ├── head-section/      # HeadSection + SeoContainer
│   │       └── upgaming/          # Upgaming
│   ├── templates/                 # Page templates (@oribet/templates)
│   │   └── src/
│   │       ├── types.ts           # RouteConfig, AppConfig
│   │       └── lobby/             # LobbyTemplate (composes modules)
│   └── config/                    # Shared configs (tooling + runtime)
│       ├── eslint/                # ESLint presets (@oribet/eslint-config)
│       ├── typescript/            # TSConfig presets (@oribet/typescript-config)
│       ├── vite/                  # Vite config presets (@oribet/vite-config)
│       ├── theme/                 # Theme factory + defaultTheme (@oribet/theme-config)
│       └── types/                 # Cross-cutting TS types (@oribet/shared-types)
└── docs/                        # Documentation (audit.md, monorepo-plan.md)
```

## Where to Look

- **Routes/pages**: `containers/AppRoutes.tsx` defines all routes. Each route maps to a container in `containers/`.
- **API calls**: `api/services/*.api.tsx` — one file per domain (Auth, Game, Bonus, User, etc.)
- **State management**: `redux/slices/` for global state; React Query used alongside for server state in hooks.
- **Reusable UI**: `packages/ui/` (`@oribet/ui`) is the source of truth for shared primitives. `components/common/` re-exports from `@oribet/ui` for backward compat. Non-extracted components (GameSwiper, GameCard, Snackbar) remain in `components/common/`.
- **Feature UI**: `components/<Feature>/` for presentational parts, `containers/<Feature>/` for the connected/page-level logic.
- **Styling/theme**: `styles/theme/` — theme tokens and styled-components theme provider.
- **Translations**: `locale/<lang>.json` — add keys here for new user-facing strings.
- **Route paths**: `util/appRoutePath.ts` — single source of truth for all URL patterns.
- **Shared configs**: `packages/config/` — ESLint, TypeScript, and Vite configs shared across the monorepo.

## Commands

```bash
pnpm dev:oribet       # Start dev server for main app (do not run unless specifically stated)
pnpm build:oribet     # Build main app
pnpm test             # Run tests (Vitest)
pnpm lint             # Lint all packages
pnpm lint:fix         # Lint & auto-fix
pnpm typecheck        # TypeScript type checking
pnpm format           # Prettier format all files
```
