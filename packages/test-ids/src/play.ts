/**
 * Game-play test-id registry: the in-game surface — frame footer controls, the
 * demo/sign-up upsell, restricted/free-spin modals, and bonus-mode exit actions.
 * Shared modules; most elements are runtime-conditional (desktop-only footer,
 * route/flag-driven modals, bonus-mode actions).
 */
import type { IdNode, TestIdRegistry } from './types'

export const PLAY_TEST_IDS = {
  /** Footer beneath the game iframe (desktop, authed). */
  footer: {
    providerLink: 'play.footer.provider-link',
    favorite: 'play.footer.favorite',
    fullscreen: 'play.footer.fullscreen',
    modeToggle: 'play.footer.mode-toggle',
  },
  /** Mobile game-launcher card (shown before navigating into the iframe). */
  mobile: {
    providerLink: 'play.mobile.provider-link',
    modeToggle: 'play.mobile.mode-toggle',
    bonusPlay: 'play.mobile.bonus-play',
    realPlay: 'play.mobile.real-play',
    demoPlay: 'play.mobile.demo-play',
    favorite: 'play.mobile.favorite',
  },
  /** Logged-out / restricted demo upsell. */
  demo: {
    signup: 'play.demo.signup',
    playDemo: 'play.demo.play',
  },
  /** Game-restricted-for-region modal. */
  restricted: {
    root: 'play.restricted.root',
    close: 'play.restricted.close',
  },
  /** Free-spin creation failed modal. */
  freespinFail: {
    root: 'play.freespin-fail.root',
    close: 'play.freespin-fail.close',
  },
  /** Bonus-mode exit/cancel actions. */
  bonus: {
    /** Floating exit button (scroll-driven). */
    exit: 'play.bonus.exit',
    /** "Exit bonus mode" in the bonus-page top header. */
    topExit: 'play.bonus.top-exit',
    /** Cancel-bonus confirm (cancel-bonus modal). */
    cancel: 'play.bonus.cancel',
    /** "Continue wagering" (cancel-bonus modal dismiss). */
    continueWagering: 'play.bonus.continue-wagering',
    /** Claim & exit (ready-to-claim modal). */
    claimExit: 'play.bonus.claim-exit',
    /** Move wagered bonus winnings to balance (bonus info card). */
    moveToBalance: 'play.bonus.move-to-balance',
    /** Info on the total-balance card → "How Bonus Play Works" modal. */
    howItWorks: 'play.bonus.how-it-works',
    /** "How Bonus Play Works" modal close. */
    howItWorksClose: 'play.bonus.how-it-works-close',
    /** Cancel-bonus trigger on the active-bonus card (opens the cancel modal). */
    cancelOpen: 'play.bonus.cancel-open',
    /** Per-bonus info button (active/queue rows) → description modal. Collection — `<id>.<bonusId>`. */
    info: 'play.bonus.info',
    /** Bonus-description modal close. */
    descriptionClose: 'play.bonus.description-close',
  },
} as const

const T = PLAY_TEST_IDS

export const PLAY_STRUCTURE: IdNode[] = [
  {
    id: T.footer.providerLink,
    role: 'link',
    label: 'Game footer: provider link',
    runtimeConditional: true,
  },
  { id: T.footer.favorite, role: 'button', label: 'Game footer: favorite', runtimeConditional: true },
  {
    id: T.footer.fullscreen,
    role: 'button',
    label: 'Game footer: fullscreen',
    runtimeConditional: true,
  },
  {
    id: T.footer.modeToggle,
    role: 'button',
    label: 'Game footer: demo/real toggle',
    runtimeConditional: true,
  },
  // Mobile launcher card (mobile-only).
  {
    id: T.mobile.providerLink,
    role: 'link',
    label: 'Mobile launcher: provider link',
    runtimeConditional: true,
  },
  {
    id: T.mobile.modeToggle,
    role: 'button',
    label: 'Mobile launcher: mode toggle',
    runtimeConditional: true,
  },
  {
    id: T.mobile.bonusPlay,
    role: 'button',
    label: 'Mobile launcher: bonus play',
    runtimeConditional: true,
  },
  {
    id: T.mobile.realPlay,
    role: 'button',
    label: 'Mobile launcher: real play',
    runtimeConditional: true,
  },
  {
    id: T.mobile.demoPlay,
    role: 'button',
    label: 'Mobile launcher: demo play',
    runtimeConditional: true,
  },
  {
    id: T.mobile.favorite,
    role: 'button',
    label: 'Mobile launcher: favorite',
    runtimeConditional: true,
  },
  { id: T.demo.signup, role: 'button', label: 'Demo upsell: sign up', runtimeConditional: true },
  { id: T.demo.playDemo, role: 'button', label: 'Demo upsell: play demo', runtimeConditional: true },
  {
    id: T.restricted.root,
    role: 'dialog',
    label: 'Game-restricted modal',
    runtimeConditional: true,
    children: [{ id: T.restricted.close, role: 'button', label: 'Close' }],
  },
  {
    id: T.freespinFail.root,
    role: 'dialog',
    label: 'Free-spin-failed modal',
    runtimeConditional: true,
    children: [{ id: T.freespinFail.close, role: 'button', label: 'Close' }],
  },
  { id: T.bonus.exit, role: 'button', label: 'Bonus mode: exit (floating)', runtimeConditional: true },
  {
    id: T.bonus.topExit,
    role: 'button',
    label: 'Bonus mode: exit (top header)',
    runtimeConditional: true,
  },
  { id: T.bonus.cancel, role: 'button', label: 'Bonus mode: cancel', runtimeConditional: true },
  {
    id: T.bonus.continueWagering,
    role: 'button',
    label: 'Bonus mode: continue wagering',
    runtimeConditional: true,
  },
  {
    id: T.bonus.claimExit,
    role: 'button',
    label: 'Bonus mode: claim & exit',
    runtimeConditional: true,
  },
  {
    id: T.bonus.moveToBalance,
    role: 'button',
    label: 'Bonus mode: move to balance',
    runtimeConditional: true,
  },
  {
    id: T.bonus.howItWorks,
    role: 'button',
    label: 'Bonus mode: how it works',
    runtimeConditional: true,
  },
  {
    id: T.bonus.howItWorksClose,
    role: 'button',
    label: 'Bonus mode: how it works close',
    runtimeConditional: true,
  },
  {
    id: T.bonus.cancelOpen,
    role: 'button',
    label: 'Bonus mode: cancel (open)',
    runtimeConditional: true,
  },
  {
    id: T.bonus.info,
    role: 'button',
    label: 'Bonus mode: bonus info',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.bonus.descriptionClose,
    role: 'button',
    label: 'Bonus mode: description close',
    runtimeConditional: true,
  },
]

export const PLAY_REGISTRY: TestIdRegistry = {
  feature: 'play',
  structure: PLAY_STRUCTURE,
}
