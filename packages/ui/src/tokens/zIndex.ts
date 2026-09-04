/**
 * Centralized z-index scale.
 *
 * Layers stack in this order (lowest → highest):
 *   base → sticky → dropdown → overlay → modal → popover → tooltip → max
 *
 * Usage:
 *   import { zIndex } from '@oribet/ui'
 *   z-index: ${zIndex.dropdown};
 */
export const zIndex = {
  /** Default stacking context (0) */
  base: 0,
  /** Sticky headers, tab indicators (1) */
  sticky: 1,
  /** Elevated elements within a section (5) */
  raised: 5,
  /** Fixed headers, sidebars (10) */
  fixed: 10,
  /** Search results, settings dropdowns (100) */
  dropdown: 100,
  /** Mobile containers, overlays (500) */
  overlay: 500,
  /** Modals, full-screen dialogs (1000) */
  modal: 1000,
  /** Popovers, bonus containers (1300) */
  popover: 1300,
  /** Select dropdowns, portal menus (1400) */
  selectPortal: 1400,
  /** Tooltips — always on top of interactive UI (1500) */
  tooltip: 1500,
  /** App-level modal wrappers (auth, restrictions) (2000) */
  modalWrapper: 2000,
  /** Country restriction — blocks everything (9999) */
  max: 9999
} as const

export type ZIndexToken = keyof typeof zIndex
