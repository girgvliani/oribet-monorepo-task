/**
 * Shared types for the test-id registry + structure trees.
 *
 * A registry is the SINGLE SOURCE OF TRUTH for one feature surface: a flat map of
 * stable id strings (consumed by components as `data-testid`) plus a hand-authored
 * `IdNode` tree describing how those ids nest in the DOM and when they are present.
 *
 * The id-map generator (`tools/idmap`) walks the tree, prunes nodes whose build-time
 * `presentWhen` rule is false for a given app, and emits the per-app id map.
 */

/** Semantic kind of an interactable / landmark element — drives how the framework targets it. */
export type IdRole =
  | 'button'
  | 'textbox'
  | 'password'
  | 'checkbox'
  | 'combobox'
  | 'link'
  | 'dialog'
  | 'tab'
  | 'group'
  | 'alert'
  // Non-interactive display elements (values, labels, images, regions) — let the
  // framework target read-only content for assertions, not just interactions.
  | 'text'
  | 'image'
  | 'region'

/**
 * Build-time presence rule. Statically evaluable against an app's `.env`, so the
 * generator never has to render anything. `undefined` on a node = always present.
 */
export type PresenceRule = {
  /** Env var name, e.g. `VITE_SOME_FEATURE_FLAG`. */
  env: string
  /** The string value the env var must equal for the node to be present. */
  equals: string
}

/** One node in a feature's structure tree. */
export interface IdNode {
  /** The test-id string. Also the rendered `data-testid` value. */
  id: string
  /** Semantic role of the element. */
  role: IdRole
  /** Human-readable description (docs / QA contract only). */
  label?: string
  /** Build-time gate. Omit for "always present". */
  presentWhen?: PresenceRule
  /**
   * Presence depends on runtime/API state (e.g. an API feature flag, an error
   * being shown). The element is part of the union but the framework must not
   * hard-fail when it is absent.
   */
  runtimeConditional?: boolean
  /**
   * This id is a PREFIX for a repeated component (game cards, tx rows, nav links,
   * select options, …). Every rendered instance gets its OWN unique id of the form
   * `<id>.<key>` (e.g. `discovery.game-card.sweet-bonanza`, `nav.header.nav-item.sports`)
   * — never the bare prefix, and never two elements with the same id. The framework
   * targets instances by the `<id>.` prefix; no `data-key`/extra attributes are used.
   */
  collection?: boolean
  /** Nested elements. */
  children?: IdNode[]
}

/** A self-describing registry for one feature. */
export interface TestIdRegistry {
  /** Feature key, e.g. `authentication`. */
  feature: string
  /**
   * Hand-authored union structure. A feature can expose several independent
   * surfaces (e.g. a modal, a separate reset-password page) — each is a root.
   */
  structure: IdNode[]
}
