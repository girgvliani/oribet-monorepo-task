## How this document is organized

1. **[Design System Foundation](#1-design-system-foundation)** — colors, typography, spacing, radii, motion, z-index, shared UI primitives (buttons, inputs, modals…), icons & assets.
2. **[Navigation & Site Frame](#2-navigation--site-frame)** — header, sidebar, nav bars, footer, language.
3. **[Game Discovery & Browsing](#3-game-discovery--browsing)** — game card, carousels, lobby blocks, search, categories, providers.
4. **[Gameplay & Live Activity](#4-gameplay--live-activity)** — game player, bonus mode, sportsbook, live bets/wins feeds.
5. **[Bonuses, Promotions & Gamification](#5-bonuses-promotions--gamification)** — bonus hub, modals, wheel, promotions, VIP ranks, leaderboards, tournaments, marketplace.
6. **[Account, Wallet & Authentication](#6-account-wallet--authentication)** — auth flows, wallet/deposit/withdraw, settings, KYC, dashboard, profile, notifications.
7. **[Banners, Content, Support & System](#7-banners-content-support--system)** — hero banners, chat, blog, policies, geo-block, 404.
8. **[Page / Site Map](#8-page--site-map)** — how modules assemble into pages.
9. **[Notes for the prototype](#9-notes-for-the-prototype)** — multi-brand model, current-state caveats.

> **The multi-brand model (read this first).** Everything below is **one design system re-skinned per client brand**. Structure (sizes, spacing, radii, motion, layouts, behavior) is **constant**; only the **color theme** changes per brand. Two living brands illustrate the range:
>
> - **Oribet (v2 redesign)** — blue accent, flat dark cards, square chevron buttons, clean tiles. _This is the current design direction and is documented as primary._
> - **Korea** — identical layouts but a **gold gradient** treatment (gold borders, gold text, gold fills).
>
> Wherever a component has forks (`oribet-*` = v2, `korea-*` = gold, plus older legacy versions), the most complete version is documented and the variant differences are noted inline. A designer should treat "brand" as a **theme swap**, not a different product.

---

# 1. Design System Foundation

Everything is built from a small set of **design tokens** and **UI primitives**. A new brand is created by overriding the color tokens only.

## 1.1 Color Tokens

The base palette is **dark**: near-black navy backgrounds, white text, a blue brand accent, and gold + lime-green as standout colors. Brands override the accent set (redesign uses a lighter blue `#a9d1ff` as the primary accent; Korea uses gold).

**Backgrounds**
| Token | Hex | Role |
|---|---|---|
| bg / primary | `#0d121d` | Main app background (deep navy-black) |
| bg / secondary | `#111827` | Cards, raised surfaces |
| bg / tertiary | `#030712` | Deepest black — banners, tab tracks, inputs |
| bg / input | `#101827` | Input fill |

**Text**
| Token | Hex | Role |
|---|---|---|
| text / primary | `#ffffff` | Main text (white) |
| text / secondary | `#9CA3AF` | Labels, secondary text (cool gray) |
| text / tertiary | `#8290a0` | Placeholders, inactive tabs (muted slate) |

**Accent & status**
| Token | Hex | Role |
|---|---|---|
| accent / brand | `#1D4ED8` | Brand blue (spinners, primary actions, active states) |
| accent / primary | `#ECC53A` gold _(redesign: `#a9d1ff` blue · Korea: `#F0B100`)_ | The swappable brand highlight |
| accent / info | `#3B82F6` | Bright info blue |
| success | `#84CC16` | Lime green — deposit, positive, "buy" |
| error | `#CA1515` | Red — errors, losses, required marks |
| warning | `#ECC53A` | Amber/gold |

**Surface (borders, hover, dividers)**
| Token | Hex | Role |
|---|---|---|
| surface / hover | `#1f2937` | Hover fill, input borders, tooltip bg |
| surface / active | `#374151` | Pressed fill |
| surface / border | `#374151` | Standard border |
| surface / borderSubtle | `#1f2937` | Subtle border |

**Buttons are glossy/beveled, not flat** — primary buttons use layered shadows for a raised "candy" effect: a bottom drop shadow + an inner top-glow, e.g. primary blue `#1e40af` (hover `#1d4ed8`, active `#1e3a8a`) with `0px 2px 0px #172554, 0px 8px 12px #3b82f6 inset, 0px 1px 4px rgba(255,255,255,0.25) inset`. On press the inner glow flips to the bottom.

**Action-button palette** (in-game/feature CTAs — claim/wager/spin) comes in **5 intent colors**: blue (default/neutral), green (buy/positive), orange (bonus/wager/claim), pink, purple. Each has inactive/hover/pressed fills + a colored outer glow when active. Intent coloring is consistent everywhere: **orange = bonus money/wager**, **green = buy/positive**, **blue = neutral**, **grey = disabled**.

**Signature gradients** a designer will need: card surface `linear-gradient(180deg,#263246,#1e2a3d)`; skeleton shimmer `linear-gradient(90deg, rgba(43,54,80,.4), rgba(55,65,81,.6), rgba(43,54,80,.4))`; section pills — Casino blue `#2e65de→#2563eb`, Sport gold `#AA8515→#655628`, Bonus green `#15803d→#166534`; bonus-card outer orange `#fe9149→#fd5737`; **Korea gold stroke** `#FFD230→#F0B100` (used as a masked 1px border on cards, nav, etc.).

## 1.2 Typography

System/inherited font stack; only **size, weight, line-height** are tokenized (1rem = 16px; html drops to 15px under 600px to shrink the UI ~6%).

| Token       | px     | Weight tokens  | Line-heights |
| ----------- | ------ | -------------- | ------------ |
| xs          | 10     | normal **400** | tight 16px   |
| sm          | 12     | medium **600** | normal 24px  |
| base (body) | **14** | bold **700**   | relaxed 32px |
| lg          | 16     |                |              |
| xl          | 18     |                |              |
| 2xl         | 24     |                |              |
| 3xl         | 32     |                |              |

**Role presets:** caption (10/600), secondary (12/600), body (14/600), subheading (16/600, **UPPERCASE**), heading (18/700), display (24/700). **Uppercase is the convention** for labels, tabs, subheadings, and the deposit CTA.

## 1.3 Spacing, Radii, Breakpoints, Motion, Z-index

- **Spacing** — 4px base grid: 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px.
- **Radii** — sm 4 · md **8 (workhorse)** · lg 10 · xl 12 · 2xl 16 · full 9999. (10–12px for grouped/segmented surfaces; full for pills.)
- **Breakpoints** — xs 350 · sm 600 · md **768** · lg 1024 · xl 1200 · xxl 1400. Most responsive shifts trigger at `md` (≤768px). **Touch targets grow to 44px** on mobile.
- **Motion** — durations fast 0.15s · normal 0.2s · slow 0.3s · slower 0.5s; default easing `ease-in-out`. Buttons/hovers 0.2–0.3s; modal/popover fade 0.2s; tab indicator slide 0.3s; spinner 0.6s; skeleton shimmer 2s.
- **Z-index ladder** — dropdown 100 → overlay 500 → modal 1000 → popover 1300 → select 1400 → tooltip 1500 → modal-wrapper 2000.

## 1.4 Shared UI Primitives

The reusable building blocks every feature is assembled from. Each has a defined anatomy, variants, and states.

**Buttons** — shared frame: 8px radius, 6px gap, bold 14px label, glossy/beveled. Anatomy = `[leading icon? · label · trailing icon?]` with a centered 16px spinner overlay for loading (content fades, width preserved). States: default → hover → active → disabled (opacity 0.3) → loading.

- **Primary** — brand blue, main CTA, supports full-width.
- **Secondary** — dark neutral fill, same frame.
- **Minimal** — flat/quiet (secondary fill, no shadow), left/right content alignment override.
- **Bonus** — solid brand-blue promotional CTA.
- **Deposit** — 32px tall, success-green, **UPPERCASE 12px**, icon-left; squares to 44×44 (icon-only) on mobile.
- **Action button** (feature CTA) — full-width, the 5 intent colors, with typed icons (Claim/Wager/Spin/Deposit/Expired/Finished). Disabled = flat grey, 0.7 opacity.

**CustomInput** — anatomy: optional UPPERCASE label + red required `*` → input group `[start adornment? · field · end adornment / eye toggle?]` → error block (red text on red-tint panel). Variants: default vs `secondary` (darker), size small. States: default · focus · disabled · error (`aria-invalid`) · password reveal (eye glyph toggles open/struck-through).

**Select** (portal dropdown) — 48px trigger with value + rotating green chevron → portal menu (max 400px scroll, optional header/footer/empty message) → option rows (selected = filled + border). Single or **multi-select**, custom value renderer, left/right align. **CustomSelect** variant adds an inline searchable menu.

**CheckBox** — 14×14, 4px radius; unchecked (dark + grey border) vs checked (green fill + dark checkmark). 0.2s transition. No disabled/indeterminate.

**Spinner** — circular, top-edge-colored ring, 0.6s spin; size + color props (defaults to brand blue).

**Skeleton** — shimmering placeholder; variants text / rectangular / rounded / circular; shimmer over 2s.

**Modal** — dim backdrop (`rgba(0,0,0,0.5)`, 0.2s fade) + centered container; focus-trap, body-scroll-lock, close on backdrop/Escape. On mobile most modals become **full-screen bottom sheets** with a back-chevron header.

**Popover** — portal panel anchored to an element via a 9-point origin grid; repositions on scroll/resize; closes on outside-click/Escape. (Positioning primitive — content supplied by caller.)

**Tooltip** — hover/focus bubble (`#1f2937` bg, white 12px, optional arrow), 4 placements, viewport-clamped.

**Tabs (segmented control)** — full-width track (36px, 10px radius, dark) with equal tab items + a single **sliding indicator** (0.3s). Labels UPPERCASE 12px; active white, inactive grey; optional "soon" badge.

**Pagination** — numbered page buttons (32×32, 8px radius) + prev/next chevrons + ellipsis; active = filled. Always shows first/last + current ±1.

**Layout primitives** — BoxContainer (centered, max-width 1200px), Container (responsive max-widths + padding/flex), HeaderButtonContainer (square 40×40 / 44×44 icon-button shell, 12px radius), MobileContainer (slide-in panel below header), Snackbar (toast, bottom-left, 2s auto-hide), ErrorBoundary.

## 1.5 Icons & Assets

React SVG components, `currentColor`-friendly. Counts: **~98 app icons** (navigation, actions, gaming, 11 sports, social, status, bonus/gift, brand), **18 logos** (brand + payment/crypto: Visa, Mastercard, ApplePay, GooglePay, Bitcoin, Ethereum, Litecoin, Tether, Ripple, Tron), **10 flags** (language switchers), **24 decorative "atoms"** (bonus art, diamonds, rank illustrations, promo/cashback art), **1 Lottie** (bonus animation). A reusable `cardChrome` snippet paints the masked 1px gradient border used for distinct card edges (e.g. Korea's gold border) with no brand-specific code.

---

# 2. Navigation & Site Frame

The persistent chrome wrapping every page. Two generations exist (legacy `app-*` and v2 `oribet-*`); v2 documented as primary.

## 2.1 Top Header

A sticky 64px bar, full-width, dark with a hairline bottom border. Left cluster always present; right cluster swaps by login state.

- **Left cluster:** hamburger menu-toggle (38×38 icon button) · logo pill · **"BONUSES" chip** (logged-in only).
- **Right cluster — logged-out:** search icon button · rewards/gift icon button (accent-colored, the visual highlight) · **Login** pill (secondary) · **Sign Up** pill (primary blue).
- **Right cluster — logged-in:** the **Wallet dropdown** · search · **notifications bell** (legacy shows a red unread dot) · **account/profile menu** (circular avatar).

**Sub-components:**

- **Wallet dropdown** — collapsed **pill** (53px): balance text (or accent "(In Play)" while in a game) + chevron toggle + a **Deposit button** (blue, wallet icon + "Deposit" + "+"). Expanded **panel** (drops below, rounded, shadowed): single-wallet layout = a **Balance card** + a **Bonus Balance card** (orange diamond icon, amount, 5-segment glowing wager bar, state-driven footer button); multi-wallet layout = one **WalletCard** per currency (default wallet outlined in accent, others click-to-switch, dim while switching).
- **BONUSES chip + popover** — chip = bonus icon + "BONUSES" + a red `active/total` count badge. Popover (tall, scrollable): rank card → **Active** section (active bonus card with wager bar, free spins, deposit bonuses, optional bonus wheel, rakeback/cashback) → **Upcoming** section → "Explore more" Telegram block → sticky **"All Bonuses"** button with a fade overlay.
- **Account menu** — avatar button → dropdown: profile header card (avatar + username + user ID) + rows (Personal Information, Deposit, Withdraw, Notifications, Transactions, Verification) + divider + **Log Out** (opens a confirm modal). Legacy adds Wallet / Deposit Fiat/Crypto / Buy Crypto / Settings rows.
- **Bonus-mode state:** icon buttons are replaced by "Cancel Bonus" / "Exit Bonus Mode" buttons; balance shows "(In Play)".

**Behavior note:** the balance is live — seeded from the default wallet, updated via a throttled socket feed; treat it as an animating value.

## 2.2 Category Nav Bar

A horizontal strip of fully-rounded **pill tabs** (uppercase, letter-spaced). Default set: Casino, Live Casino, Sport, Tournaments, Promotions, Bonus. Active = filled (surface-hover) + primary text + `aria-current`; idle = transparent + secondary; hover brightens. Scrolls horizontally on mobile. Active detection matches the route path or prefix.

## 2.3 Sidebar

Left nav with two modes: **expanded (216px)** and **collapsed (72px icon rail)**, full-height, scrollable.

Expanded, top→bottom: **Casino/Sport switcher** (two toggle buttons, active gets accent gradient) → **promo/deposit card** ("Welcome Win" gradient card with a "CLAIM MATCH NOW" CTA) → divider → **main nav** (Lobby, Casino, Sports, dynamic game-block links, Marketplace, Tournaments, Blog) → divider → **collapsible Promotions section** (header + up to 6 promo rows, each with icon chip + title + a **countdown pill** "3d"/"5h") → **language selector** → **Affiliate row** (with "5%" pill) → **VIP Club row** (with "Hot" pill).

Collapsed = icon-only 34–48px tiles (tooltip labels). Nav row states: active (accent text/icon + faint accent bg + accent border), idle (secondary), hover (faint accent bg). Optional accent badge pill.

Legacy sidebar differs: context-sensitive menu groups (Casino menu only on casino routes, Sport menu only on sport routes) + General + Support groups; decorative section tiles; "LIVE"/"NEW" item badges; a bottom deposit card with payment logos + DEPOSIT button.

## 2.4 Mobile Bottom Bar

Fixed 60px bottom tab bar, 5 equal tabs: **Menu** (animated hamburger ↔ X), **Casino**, **Sport**, **Marketplace**, **Chat**. Each tab = 20px icon + uppercase 12px label; selected = primary color, idle = secondary. Menu toggles the sidebar drawer; Chat toggles the chat panel; auth-gated destinations open Login when logged out.

## 2.5 Footer

Centered, max-width, two bands.

- **Top band:** **brand block** (logo + long description paragraph) on the left; on the right a **Responsible Gaming** badge row (SSL, 18+, Verified shield) and a **social icons row** (round 40px buttons).
- **Divider.**
- **Link-columns band:** columns — **Information** (Affiliate, Company Details, Terms, Responsible Gaming, Privacy, Sportsbook Terms), **Help** (FAQ, KYC, Refund, Dispute Resolution, Fairness & RNG, Self-Exclusion), **Contact Us** (Live Chat 24/7, affiliate email, VIP email).
- Other footer variants add a **payment-method logo strip** (Visa, Mastercard, Apple Pay, Bitcoin, Ethereum, Litecoin, Tether) and a **license badge** (e.g. GCB) + legal text. Link rows and social icons brighten on hover.

## 2.6 Language Selector

Built on the Select primitive. **Sidebar mode:** full-width row = flag + "Language" + current code (e.g. "EN") + chevron. **Compact/header mode:** 32×32 flag-only square. Dropdown options = flag + language label; selected highlighted. Selecting rewrites the URL language segment, persists to backend + localStorage.

---

# 3. Game Discovery & Browsing

Two visual languages: **legacy** (gold/green accents, gradient-stroke borders, dark hover info-overlays, edge-card dimming, on-tile heart + bonus mask) and **v2** (blue accents, flat surfaces, square chevrons, "All (N)" count pills, blur-tint hover with a single play button, captioned tiles).

## 3.1 Game Card

The atomic game tile.

- **Anatomy (v2):** portrait **artwork tile** (~3:4, 12px radius, cover, placeholder/loading fallback) → **hover overlay** (desktop only, translucent blue tint + 9px blur, a centered **48px circular play button**) → **caption block** below (game **name** 14px bold, **provider name** 12px muted, both truncate).
- **Legacy adds on-tile chrome:** a **favorite/heart toggle** (top-right, empty vs filled-red, logged-in only), a hover **info overlay** with name/provider/"Coming soon"/"Not available" text, a card **lift** on hover, and a **Bonus-Mode mask** (4px accent border frame + a bottom "Bonus Mode" tab with double-chevrons).
- **Config variants:** aspect ratio 3:4 / 1:1 / 4:3; overlay-play-only; label-below. **Skeleton:** pulsing card-shaped box.
- States: loading · available · unavailable/coming-soon · favorited · logged-in/out · hover · bonus-mode.

## 3.2 Game Carousel (Content Rail)

A section = **header row + horizontally-scrollable card track**. The themed variants (Trending, Slots, Table, Mini-games, Game Shows, Recommended, New, Popular, Live Casino…) are the **same rail with a different content feed + title/icon** — not distinct components.

- **Header (v2):** title (20px bold) + **"All (N)" count pill** + two **square chevron arrows** (disabled arrow → 40% opacity).
- **Header (legacy):** leading icon + two-tone title (word in gold) + green "See All" link + chevron nav.
- **Track:** card track, 12px gaps, configurable slides-per-view (default 8 desktop / 4 mobile); legacy dims partially-visible edge cards to 0.1 opacity. **Loading** = row of card skeletons.

## 3.3 Lobby Blocks & Sections

Admin-driven: one API call returns all **game blocks**, each with surface flags (`show_in_lobby/casino/game`) and a position. The engine renders each block as one carousel row (block name = title, games sorted by position). Surface wrappers just set lobby/casino/game. **Two-row category swiper** variant: a gradient-bordered box with a grid-mode track (2 rows × N) of captioned cards. **Lobby tab** variant: a centered wrapping grid of cards + a "See all" link.

## 3.4 Casino Catalog & Search

A filter card (rounded, secondary bg) stacking, top→bottom:

- **Providers quick-strip** — horizontal swiper of provider logo cards (inactive desaturated, selected full-color + gold border) + small chevron nav.
- **Search bar** — search input (magnifier icon) + a **"Providers" button** (opens the modal, shows a selected-count badge).
- **Selected-provider chips** — wrapping row of removable provider pills + "Clear all".
- **Category pills** — horizontally-scrollable single-select pills ("All Games" + categories + sidebar game-blocks); active = gold text + gold border.
- **Providers modal** — multi-select picker: header (title + live search + close) + responsive provider grid (selected = gold/bold) + footer (Clear all / Apply).

Other search surfaces:

- **Lobby search-as-you-type** — debounced (≥3 chars), shows one row of results; no URL sync.
- **Global search modal** — full-screen/large modal: autofocused search (with clear) + filter row (**show/hide blocked games** select, **provider multi-select** with in-dropdown search + checkboxes, **sort-by** select: A-Z / Z-A / Popular / Featured) + results grid + **load-more** widget (progress bar + "Displaying X of Y" + button) + empty state ("No result").

## 3.5 Category Cards & Banners

- **v2 category cards:** two wide tiles (Casino / Sport), 140px, radial accent glow on the right + illustration, title + subtitle, whole card navigates.
- **Legacy category cards:** grid of 4 square tiles (Sports, Casino, Live Casino, Esports) with gold gradient-stroke borders that intensify on hover, centered image + gold label below.
- **Category banners:** two wide horizontal banner cards (Casino gold / Sport blue) — illustration + title + a small label/badge chip + description + a trailing circular chevron; collapses to a compact row on smaller screens.

## 3.6 Provider Showcase

- **v2 provider rail:** "Slot Providers" header (square chevrons) + cards with a **grayscale, washed-out logo** + an accent **"N Games" pill**; navigates to the filtered games list.
- **Legacy provider rail:** edge-fade rail, provider cards = logo + title + "N games" count line; `full` and `imageOnly` variants.
- **Provider grid page:** search input + wrapping grid of provider cards + empty state ("No result" + Clear search) + a "Providers" page header.

## 3.7 Sports Categories

A rail of sport tiles (Live, Soccer, Tennis, Basketball, Cricket, American Football, Ice Hockey, Baseball, Handball): each = centered sport icon + label below; all navigate into the sportsbook.

---

# 4. Gameplay & Live Activity

## 4.1 Game Player / Launcher

- **Game viewport (desktop):** an outer frame containing a **16:9 content well** (16px radius, secondary border — Korea: 2px gold gradient ring) holding a borderless **iframe** of the game. **Loading** = centered **pulsing brand logo**. Modes: real-money / demo / login-prompt placeholder / restricted.
- **Region-denied / demo upsell card** (shown in the well when logged-out / pre-selection): "denied" graphic + uppercase title + two subtitle lines + a **SIGN UP** (blue) and optional **DEMO** (secondary, play icon) button.
- **Footer toolbar (desktop, logged-in):** left = game title + clickable provider (chevron fades in on hover); right = **demo/real toggle** (iOS-style switch, accent when "real") + divider + **favorite heart** + **fullscreen** icon.
- **Bonus-mode header (desktop):** two pill cards — **"Wager Progress"** (segmented orange bar + %) and **"Amount to Wager"** (large currency figure) — live-updating.
- **Mobile launcher card:** game thumbnail + title + provider, a "Play in Fullscreen" switch, **REAL PLAY** + **DEMO** buttons (or a single **BONUS PLAY** in bonus mode), and a favorite footer. Launching opens a dedicated full-screen iframe route.
- **Restriction modals:** Country-Restriction and Freespin-Creation-Failed — a 360×480 card with close, decorative atom, title + description.

## 4.2 Bonus-Mode Play Layout

The page shown when wagering an active bonus on eligible games.

- **Top header bar:** gift icon + "Bonus Mode" title + description + an **"Exit Bonus Mode"** button (hidden when a bonus is ready to claim).
- **Active-bonus card** (centerpiece): header (orange diamond icon + "Bonus Balance" + description) + an inner money strip — large **bonus amount** (currency as superscript) + caption "to Wager"; **State A (not wagered)** = half-width + orange segmented **wager progress bar** with `(NX)` multiplier; **State B (wagered)** = full width + a **"Move to Balance"** button.
- **Eligible-games title** + the standard games search/grid below it.
- **Floating "Exit Bonus Mode" button:** appears with a bounce after scrolling >200px, hides near the page bottom.
- (Korea fork swaps in gold-bordered card wrappers.)

## 4.3 Sportsbook (embedded)

A thin wrapper mounting a **third-party Upgaming/Inplaynet sportsbook** into a container; the sportsbook supplies its own UI. **Loading** = pulsing brand logo; **error** = centered message; a one-time **confetti burst** on first-ever load. Reused for five surfaces: **prematch, live, virtual, esports, racing**. Mobile/desktop is detected and forwarded; the player's account/balance carry across.

## 4.4 Live Bets Feed

A constantly-updating bets table (socket-fed: seeds ~12 immediately, then drips the rest in at random 0.5–1.5s intervals for a live-ticker feel; subscribes only while scrolled into view).

- **v2 "Live Bets":** header = **live pulse indicator** (translucent-blue ring + pulsing accent dot) + title + **tabs** (Casino / Sports / High Rollers). Columns: **Game / Player / Bet Amount / Multiplier / Payout** (Bet & Multiplier hidden on mobile). Rows alternate fills; cells use icon/avatar/coin placeholders; **payout colored green for win, red for loss**. New rows slide in. Bottom fade gradient.
- **Legacy:** single feed (no tabs), columns Game / User / Bet / Payout, rank-badge avatars, **wins ≥25 turn green**.

## 4.5 Recent Wins

A horizontal rail of recent winners (socket-fed, newest first).

- **Card:** game thumbnail + player name (+ rank badge in legacy) + **win amount** (green legacy / accent v2).
- **v2 "Recent Big Wins":** tighter 88px cards with the pulse-ring header.

## 4.6 Big Wins

A carousel of larger, info-rich win cards: 227×81 card with a **2px gold inset stripe on the left edge**, a rounded thumbnail, player name + accent win amount; gold accent title + minimal chevron nav (advances 3 desktop / 1 mobile); cards lift on hover.

---

# 5. Bonuses, Promotions & Gamification

The promotional engine. Shared building blocks: **BonusCard** (icon + title + amount + optional **WagerProgressBar** + footer **ActionButton**), the **5-segment glowing wager bar** (orange for bonuses; Bronze/Silver/Gold/Diamond elsewhere), and the intent-colored ActionButton.

## 5.1 Bonus Hub

A tabbed page composing stacked **section modules** (most hidden when empty):

- **Hero header** — bonus icon + "Bonuses" + subtitle.
- **General** — rank-progress card.
- **Bonus Money** — 2 columns: **Active Bonus** card (orange diamond, "Active" badge, wager bar, footer button = _Move to Main Balance_ / _Claim Bonus to Wager_ / _Play to Wager_) + queued bonuses; and **Claimable Bonuses** list (or empty state).
- **Cash Unlock / Deposit Bonuses** — Active vs Available groups; rich card with a **milestone progress bar** (rail + colored fill + dot marker + numeric milestone ticks) + three stat boxes (Possible / Already Claimed / Ready to Claim) + a CTA that varies by state (Deposit / Claim / Locked / Expired / Fully Claimed).
- **Free Spins** — cards (slot icon, "N spins", green "Claim Freespin"); >1 eligible game opens a **game-select modal**.
- **Rakeback & Cashback** — shared cards.
- **Bonus Wheel** showcase + **"Explore more"** Telegram CTA bar.
- **Promo code** — ticket-illustration card with an input + "Activate" → a **PromoCodeModal** (reward illustration + big amount + continue button).
- **Tabs (v2):** capsule pills — General, Bonus Money, Cash Unlock, FreeSpins, Cashback & Rakeback; URL `?tab=` routed. **Korea fork** adds gold cards, a gold-underline sub-tab status strip (Active/Pending/Completed/Canceled/Unclaimed driven by counts), and a bespoke free-spins table.
- **Card status states:** active (green), pending (gold), completed (green outline), canceled (red), unclaimed (muted) — shown as full-width status pills.

## 5.2 Bonus Modals

A shared modal shell (340px card, slide-up entrance, 64px header with title + close, footer ActionButton). The set, each with intent-colored CTAs:

| Modal                         | CTA                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| **Claim ready bonus**         | orange "Claim Bonus" (3s countdown ring → ready)                                     |
| **Buy bonus money**           | green "Claim & Switch to Bonus Mode" (3 info cards: Bonus Money / Wager Req / Price) |
| **Wagered & claim new**       | orange "Transfer & Claim New Bonus"                                                  |
| **Move to main balance**      | orange "Claim & Transfer to Real Balance"                                            |
| **Promo code**                | purple "Claim"                                                                       |
| **Wagering incomplete**       | blue "Back to Real Money"                                                            |
| **Already have active bonus** | "OK"                                                                                 |
| **Cancel old & buy new**      | green "Buy Now"                                                                      |
| **Welcome bonus**             | orange "Activate & Start Playing" (4 cards: Amount / Bonus % / Total / Wager Req)    |
| **Marketplace item info**     | (close only)                                                                         |

Info cards are consistent 12px chips (muted label + primary value). Success = green snackbar + often a redirect. (No confetti/lottie in win states — celebration is gold amounts + green buttons + snackbars.)

## 5.3 Bonus Wheel

- **Wheel disc:** a square disc with nested **gold rings**, **12 rainbow segments** (each a clip-path wedge with gold spoke borders + a prize photo + prize name), a static **pointer** at 12 o'clock, and decorative gold diamonds + marquee light dots around the rim.
- **Center button:** **ready** = blue gradient circle with "SPIN!"; **locked** = "Next Spin In" + countdown.
- **Spin:** click → 5s CSS rotation landing the won segment under the pointer → **win modal** ("CONGRATULATION! / YOU'VE WON" + prize pill + deep-gold amount + lime-green "Continue Playing").
- **Cooldown:** an inline HH:MM:SS countdown; a sidebar **banner** entry (purple gradient, wheel thumbnail, status line) opens it.

## 5.4 Promotions

Status computed from dates (Upcoming / In Progress / Archived). Category pills are heuristic text-matches.

- **List/grid:** status tabs (sliding blue underline) **or** category pills (All Games / Sports / Deposit / Live Casino / Casino / Bonuses). **Promotion card:** banner image + status badge + date badge + title + clamped description + CTA ("View Promotion" / "More Info" / "Join Now"); v2 adds a soft blue glow border on hover, Korea adds the gold gradient border. Pagination + empty state + skeleton.
- **Detail:** hero/back link + banner + title + badges + a **4-cell countdown** (Days/Hours/Minutes/Seconds) + HTML body + a "View All Bonuses" / "+ Deposit" CTA. (Korea opens detail in a modal instead of a page.)
- **Lobby carousel:** arrow-only swiper of promo cards (no autoplay/dots) + "View All".

## 5.5 VIP Rank System

A single-column loyalty page:

- **Intro hero** — eyebrow + "Welcome to the Club" headline + 3 benefit cards (Ranks & Levels, Exclusive Promotions, Increase Your Cashback) + a "JOIN NOW" CTA (logged-out).
- **Rank cards carousel** — **12 tiers** (Newcomer → Myth), color ramp gray → bronze → silver → gold → purple → blue. **Card:** per-tier tint, starburst accent, medal image, rank name + level range, ordinal badge, and 3 perk rows (**Wager Required**, **Cashback %**, **Rakeback %**). Chevron + dot pagination. An "Exclusive Access at Rank 6 / VIP Host" banner.
- **How it works** — 4 illustrated steps (Begin Your Journey, Play & Progress, Climb the Ranks, Reap the Rewards).
- **FAQ** — 5 always-expanded Q&A (not an accordion).

## 5.6 Leaderboards

A competition page:

- **Hero** — title cluster with a big gold-gradient sub-name flanked by trophy art.
- **Countdown** — 4 boxes (Days/Hours/Minutes/Seconds), white when live, "00" otherwise.
- **Info bar** + an "INFO" pill (opens an info modal).
- **Your-position strip** (logged-in) — avatar + username, "My Position", "Wagered".
- **Players list** — columns Player / Wagered / Prize; **podium treatment** via row border color: 1st gold, 2nd silver, 3rd bronze, 4th+ grey, each with a metallic rank-badge disc. Skeleton + empty states.

## 5.7 Tournaments

A listing of competitions:

- **Header** — a centered "TOURNAMENTS" glow pill.
- **Tabs** — Ongoing / Upcoming / Ended.
- **Tournament card** — full-bleed image + dark gradient overlay; name plate; **status display** = live 4-block countdown (Ongoing/Upcoming) or muted "FINISHED" (Ended); a blue "View Details" CTA; card lifts on hover. Skeleton + per-tab empty messages.

## 5.8 Marketplace (points shop)

- **Header** — banner + "Marketplace" + subtitle. **Tabs** — Bonus Money / Free Spins (Soon) / Tickets (Soon).
- **Reward card** (flip card): **front** = amount-tinted gradient, tier diamond, title + amount, info tiles (**Price / You Get / Wager Requirement / Cap**), green **"BUY NOW"** (coming-soon = grey "COMING SOON"), and an info "i" button; **back** = "Item Info" + description. One card flipped at a time.
- **Buy flow** branches on the user's active bonus into the relevant bonus modal (Buy / Cancel-and-buy / Wagered-and-claim). (Korea reskins cards with gold borders + gold amounts + a gold BUY button, and drops the tabs.)

---

# 6. Account, Wallet & Authentication

Global pattern: desktop = bordered rounded cards + centered modals + horizontal rows; mobile = full-bleed cards + full-screen bottom sheets with a back-chevron + stacked rows + bottom-pinned full-width submits.

## 6.1 Authentication

- **Auth modal shell** — a single ~413px card with a **segmented toggle** (Register | Log In) + close X; renders Sign In or Sign Up. (Legacy variant = wider two-panel modal with a left marketing banner.)
- **Sign In** — **Username** + **Password** (eye toggle, right-aligned **"Forgot Password"** link) + **"Log In"** submit + **Google** login (gated by env flag, under a "Or Directly Join With" caption). _No remember-me; switching to register is via the top toggle._
- **Sign Up** — **Username**, **Currency selector** (multi-currency platforms only), **Email**, **Password**, a **pre-checked marketing consent** checkbox, and an **unchecked, required Terms** checkbox (with inline link). Submit **"Create Account"** + Google. **Single step** — _no confirm-password, surname, DOB, country, or promo field_ (affiliate codes pulled silently). Success → snackbar, closes, **auto-opens the Deposit modal**.
- **Forgot Password / Reset** — email-entry modal → a separate new-password page (New + Repeat, match-checked). The casino fork does it in one two-step modal (request → code + new password).
- **Field primitives:** labeled field with red required `*`, error text below, password eye toggle; consent checkbox (blue when checked); full-width pill submit (default / disabled 50% / loading spinner); Google button.

## 6.2 Wallet / Account Area

- **Shell:** desktop header ("Wallet") + a **272px sidebar** (icon+label rows, feature-gated: Wallet, Deposit Fiat, Deposit Crypto, Withdraw Crypto, Buy Crypto, Transactions) + body. Mobile wraps sections in a back-chevron header.
- **Wallet overview** — balance (currency symbol + 2 decimals) + action buttons (DEPOSIT / WITHDRAW CRYPTO / BUY CRYPTO).
- **Crypto deposit** — wallet selector → searchable **coin selector** (coin logo + name) → **amount** input + read-only **estimated receive** → minimum-amount info → **Confirm** → result: summary card + **QR code** (white-framed) + full address with **COPY** + optional memo + a pending mini-table + "See all transactions".
- **Fiat deposit** — card form (amount + currency + **quick-amount chips** 50/100/250/500 + **payment-method tiles** Mastercard/Visa/Apple Pay/Google Pay + "Proceed to Payment") **or** an embedded **Omno cashier iframe** (select-wallet → cashier).
- **Crypto withdraw** — currency/network (or wallet/coin) selectors + **address** + optional **memo/extra ID** + **amount** + a **calculation box** (Amount / Fee / Total) + **Validate → Confirm** (NowPayments variant). **AgentPay** withdraw = select wallet + Withdraw (opens redirect).
- **Buy crypto** — wallet → "You Send" currency → limits → amount → **Get Estimate** → **payment-offer cards** → Confirm (redirect).
- **Choose deposit method modal** — the central hub: cards for **Fiat / Crypto (Transfer + Buy) / AgentPay** + a **Deposit Bonus toggle** (with enable/disable confirm).
- **Wallet selector** — title + wallet cards (currency + balance), loading overlay.
- **Transactions** — filter pills (**All / Deposits / Withdrawals**), columns Type / Amount / Time, 6/page pagination, empty state ("No transactions yet"). (The richer dashboard variant adds Date/Name/Result status-pill columns + date filters + a "View Instructions" iframe.)

## 6.3 Settings

Routed page; sections **Account Info / Security / Preferences / Personal Verification** (sidebar nav).

- **Account Info** — profile card (avatar + username + user ID + Edit); **email row** (value + Verified/Requires-Verification status pill + Verify); **phone row** (add/edit/verify, with a country-code dropdown, an SMS **6-digit code** confirm with a resend timer).
- **Security** — **password change** modal (Current / New / Repeat, one eye toggle). _(2FA is fully built — password gate → QR + secret key → 6-digit confirm — but currently disabled. No sessions list.)_
- **Preferences** — **System Language** only (selectable language pills + Save). _(No odds-format or notification toggles.)_
- **Personal Verification (KYC)** — three leveled items: **Personal Information (L1)** (First/Last Name, DOB three inputs, Gender, Country dropdown w/ flags, Street/City/Post Code), **Proof of Identity (L2)** (ID Front + ID Back + Selfie uploads), **Proof of Address (L3)** (single doc upload). **Status states:** Requires Verification (grey) / Verification in Progress (accent) / Verified (green) / Rejected (red). Uploads accept jpg/png/pdf ≤5MB.

## 6.4 Dashboard

The logged-in account hub: a left section-nav + a right content panel.

- **v2 (blue):** 252px sidebar (flat icon list, no avatar/logout), sections: **Personal Information, Deposit, Withdraw, Bonuses, Notifications, Transactions, Verification**; panel header per section.
- **Korea (gold):** one gold-bordered card; sidebar grouped into **Settings / Payments / Activities** (adds Preferences); text-only nav with gold-outline active state.
- **Read-only field row:** floating label + value + lock icon (or a Change action). Sections reuse the deposit/withdraw/transactions/verification flows above.
- **Notifications section** (distinct from the header dropdown): expandable cards with **unread** (accent bottom border + dot) vs **read** (green border) treatments, "Mark all as read", relative timestamps. (Korea adds search + per-type emoji + absolute timestamps.)
- **Change-password modal** in-dashboard (Current / New / Repeat).

## 6.5 User Profile

A 3-stage modal:

1. **User Information** — identity header + **rank card** + "Learn about ranks" + statistics (Total Wins, Total Wager) + favourites (up to 4 game cards).
2. **My Profile** — 96px avatar + "Edit Avatar" + read-only username.
3. **Change Avatar** — preview + a **7-preset avatar picker** + Upload (file input) + Update. (No cropping.)

- **Rank card** — current rank (highlighted) + next rank (muted) + a progress bar + level info, with a rank-specific background.

## 6.6 Notifications Center (header dropdown)

A full-height panel: header ("NOTIFICATIONS" + close) + a scrollable list **or** an empty state (brand-helmet illustration + "Oops" + "No notifications"). **Item:** type icon (financial/account/info/success/warning) + title + HTML message (3-line clamp, green links) + relative timestamp. (Display-only — no unread dots here; mark-all lives in the dashboard section.)

---

# 7. Banners, Content, Support & System

## 7.1 Banners

- **Hero banner carousel** — full-width rounded image carousel, one slide visible, **dots-only** (no arrows), 5s autoplay + loop; each slide is a clickable promo image (URLs language-corrected). Skeleton while loading; hidden if empty. (v2 ≤360px tall, legacy ≤424px.)
- **Multi-card promo carousel** — shows multiple banner cards (responsive 1–3 per view, mobile shows a 1.15-card peek) with **left/right arrows** + dynamic dots; skeleton cards while loading.
- **Auth banner** (logged-out hero) — background image + "Get Started" headline + subhead + a primary "Join now" CTA (opens login) + a Google login button. Background swaps to Korean art for the Korean language.
- **Welcome bonus banner** — tall hero (600px), background image, left column: large headline + subtitle + a 210px "Claim Now" CTA (opens registration).
- **No-crypto banner** — slim strip: "No crypto? No problem!" + card logos (Mastercard, Visa, Apple Pay) + a "Buy now" CTA (login if logged-out, else Deposit).
- **Description banner** — text-only SEO card (title + two paragraphs).
- **Crash-game banner ("switcher")** — promotes the in-house Crash game: rocket graphic (desktop) + "Play Oribet Crash" title + subtitle + a green "Play now" button.

## 7.2 Community Chat

A full vertical panel (desktop sidebar / mobile bottom sheet), socket-powered.

- **Header** — "Chat" title + a room chip (Global/English/Sport — dropdown currently disabled) + close X.
- **Body** — scrollable message list + a floating "scroll to bottom" button (appears when scrolled up).
- **Message** — 40px avatar + header (username + 12-hour timestamp + hover-reveal **@mention** icon + admin **hide/restore** icons) + a **text bubble** (with green @mentions and emoji rendering) **or** an inline **GIF**. Hidden messages dim to 50%.
- **Footer (logged-in)** — auto-growing textarea + **emoji picker** + **GIF picker (Giphy)** + a "Rules" link + a live **N/200 char counter** + Send (Enter sends, Shift+Enter newlines). **Footer (logged-out)** — "Login to message" + Login / Join now buttons.
- **Emoji picker** — popover emoji grid; **GIF picker** — popover trending-GIF masonry (infinite scroll, "Powered by Giphy"); clicking a GIF sends it immediately.

## 7.3 Live Support Chat

The third-party LiveChat support bubble, wrapped to be **draggable** and **snap to the nearest of 8 drop zones** (corners + edge midpoints) on mobile; tap opens it full-screen.

## 7.4 Blog

- **Blog card** — cover image + a **category badge** (accent) + **date badge** + title (1-line clamp) + excerpt (3-line clamp) + a "Continue reading" button. **Featured (banner) card** = wide landscape variant (text left, image right).
- **Featured carousel** — one featured card at a time + dots (skeleton + hidden-if-empty).
- **Tabs module** — category tabs (All, Casino, Sports, Crypto, Gambling, Other) with a sliding accent underline + a paginated card grid (6/page) + empty state.
- **Article detail** — back button + badges + title + banner image + HTML body.
- **Related topics** — a "more in this category" card grid at the bottom.

## 7.5 Policies (legal)

- **Standard:** a desktop title header + a **272px sidebar** of policy items (active = filled) / a **mobile dropdown** + a **content card** (rendered HTML with typographic rules) + empty state.
- **Korea fork:** a single gold-stroked card combining sidebar + content (auto-selects the first policy).

## 7.6 System

- **Country restriction** — a **full-screen geo-block takeover**: background image + logo + a huge uppercase headline + a 3-line description (middle line accent-colored) + a support CTA (opens Telegram).
- **404 Not Found** — centered card: large accent error icon + error code (e.g. "404") + message + a "Return to homepage" button.
- **SEO head** — non-visual; sets the document `<title>` (defaults to "{Brand} - Crypto Casino").

---

# 8. Page / Site Map

The components above assemble into these player-facing pages. A complete prototype should cover this set:

| Page                   | Composed of                                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home / Lobby**       | Hero banner carousel → welcome bonus banner → category cards → game carousels (lobby blocks) → recent wins / big wins / live bets → promotions carousel → description banner |
| **Casino**             | Catalog search/filter card → category pills → game carousels & grid                                                                                                          |
| **All Games / Browse** | Global search → filterable game grid + load-more                                                                                                                             |
| **Providers**          | Provider grid page (search + cards)                                                                                                                                          |
| **Game Play**          | Game player/launcher (+ bonus-mode header/footer when wagering)                                                                                                              |
| **Sportsbook**         | Embedded Upgaming (prematch / live / virtual / esports / racing)                                                                                                             |
| **Promotions**         | Filter tabs/pills → promotion grid → promotion detail                                                                                                                        |
| **Bonuses**            | Bonus hub (tabs: General, Bonus Money, Cash Unlock, Free Spins, Cashback/Rakeback) + bonus wheel                                                                             |
| **Marketplace**        | Points-shop flip cards                                                                                                                                                       |
| **Tournaments**        | Tournament list (Ongoing/Upcoming/Ended)                                                                                                                                     |
| **Leaderboards**       | Competition standings + countdown                                                                                                                                            |
| **VIP / Rank System**  | Intro → rank tiers → how-it-works → FAQ                                                                                                                                      |
| **Account Dashboard**  | Section nav → personal info / deposit / withdraw / transactions / bonuses / notifications / verification                                                                     |
| **Settings**           | Account info / security / preferences / KYC                                                                                                                                  |
| **Profile**            | 3-stage profile + avatar modal                                                                                                                                               |
| **Blog**               | Featured carousel → category tabs → card grid → article detail                                                                                                               |
| **Legal / Policies**   | Sidebar + policy content                                                                                                                                                     |
| **404 / Not Found**    | Error card                                                                                                                                                                   |

Persistent on every page: **Header** (top), **Sidebar** (left), **Footer** (bottom), **Mobile bottom bar** (mobile), and the floating **Live Support Chat** bubble. Global overlays: **Auth modal**, **Deposit modal**, **Notifications**, **Community Chat**, **Country-restriction takeover**.

---

# 9. Notes for the prototype

- **Brand = a theme swap.** Reproduce the structure once; the difference between brands is the color theme — the **redesign** uses a light-blue primary accent and flat dark cards; **Korea** uses a gold-gradient treatment (gold borders via a masked 1px gradient, gold text, gold fills). Plan components to accept a brand theme rather than duplicating screens.
- **Dark UI throughout** — white primary text, gray secondary `#9CA3AF`, muted-slate placeholders `#8290a0`; blue brand accent; gold + lime-green as the standout colors. **8px** is the default radius; **uppercase** for labels/tabs/CTAs; **touch targets grow to 44px** on mobile.
- **Buttons are glossy/beveled** (layered inset + outer shadows), not flat. Disabled = 0.3 opacity; loading = centered spinner with content faded.
- **Real-time is core** — balance, live bets, recent wins, and notifications all update live; design for animating/streaming values and "(In Play)" states.
- **Consistent loading/empty patterns** — pulsing brand logo for embedded surfaces (games, sportsbook); shimmer card-skeletons for grids/rails; "No result"/"No transactions yet" empty states; placeholder spacer cards to left-align centered wrapping grids.
- **No win-celebration animation** anywhere (no confetti/lottie on bonus/wheel/marketplace wins) — celebration is gold amounts + green buttons + snackbars. _A clear opportunity if the new design wants more delight._
- **Current-state caveats** (designed but not all live, useful to know when scoping): registration is **single-step** with no confirm-password/DOB/country/promo and **no remember-me**; **2FA** and **email-edit** are built but disabled; Settings **Preferences** has language only; the chat **room selector** dropdown is disabled; some live-bets tabs (Sports) and the "Recent Big Wins" strip currently reuse the casino/recent feed pending backend segmentation.
