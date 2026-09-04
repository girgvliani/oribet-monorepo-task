/**
 * Centralized breakpoint scale.
 *
 * Based on common device widths. Use these instead of magic numbers.
 *
 * Usage:
 *   import { breakpoints, media } from '@oribet/ui'
 *
 *   // Raw values
 *   @media (max-width: ${breakpoints.sm}px) { ... }
 *
 *   // Helper strings
 *   ${media.sm} { ... }        // @media (max-width: 600px)
 *   ${media.up.md} { ... }     // @media (min-width: 769px)
 */
export const breakpoints = {
  /** Small phones (350px) */
  xs: 350,
  /** Mobile phones (600px) */
  sm: 600,
  /** Tablets (768px) */
  md: 768,
  /** Small laptops (1024px) */
  lg: 1024,
  /** Desktops (1200px) */
  xl: 1200,
  /** Wide desktops (1400px) */
  xxl: 1400
} as const

/** Media query helpers for styled-components */
export const media = {
  /** max-width: 350px */
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  /** max-width: 600px */
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  /** max-width: 768px */
  md: `@media (max-width: ${breakpoints.md}px)`,
  /** max-width: 1024px */
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  /** max-width: 1200px */
  xl: `@media (max-width: ${breakpoints.xl}px)`,
  /** max-width: 1400px */
  xxl: `@media (max-width: ${breakpoints.xxl}px)`,
  /** min-width helpers (mobile-first) */
  up: {
    xs: `@media (min-width: ${breakpoints.xs + 1}px)`,
    sm: `@media (min-width: ${breakpoints.sm + 1}px)`,
    md: `@media (min-width: ${breakpoints.md + 1}px)`,
    lg: `@media (min-width: ${breakpoints.lg + 1}px)`,
    xl: `@media (min-width: ${breakpoints.xl + 1}px)`,
    xxl: `@media (min-width: ${breakpoints.xxl + 1}px)`
  }
} as const

export type BreakpointToken = keyof typeof breakpoints
