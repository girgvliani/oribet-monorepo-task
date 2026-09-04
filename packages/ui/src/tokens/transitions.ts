/**
 * Transition / animation timing tokens.
 *
 * Usage:
 *   import { duration, easing, transition } from '@oribet/ui'
 *   transition: background ${duration.normal} ${easing.default};
 *   // or shorthand:
 *   transition: ${transition.normal};  // 'all 0.2s ease-in-out'
 */
export const duration = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
  slower: '0.5s'
} as const

export const easing = {
  default: 'ease-in-out',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  linear: 'linear'
} as const

export const transition = {
  fast: `all ${duration.fast} ${easing.default}`,
  normal: `all ${duration.normal} ${easing.default}`,
  slow: `all ${duration.slow} ${easing.default}`
} as const
