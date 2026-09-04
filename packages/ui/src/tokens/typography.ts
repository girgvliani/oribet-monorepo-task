/**
 * Typography scale.
 *
 * rem-based so users can zoom. 1rem = 16px at default browser settings.
 * On mobile (<600px) the html font-size steps down to 15px,
 * scaling the entire UI ~6% smaller without per-component overrides.
 *
 * Usage:
 *   import { fontSize, fontWeight, lineHeight, textStyle } from '@oribet/ui'
 *   font-size: ${fontSize.sm};          // '0.75rem' (12px)
 *   font-weight: ${fontWeight.bold};    // 700
 *   ${textStyle.body}                   // size + weight + line-height
 */
export const fontSize = {
  /** 10px */
  xs: '0.625rem',
  /** 12px */
  sm: '0.75rem',
  /** 14px — default body */
  base: '0.875rem',
  /** 16px */
  lg: '1rem',
  /** 18px */
  xl: '1.125rem',
  /** 24px */
  '2xl': '1.5rem',
  /** 32px */
  '3xl': '2rem'
} as const

export const fontWeight = {
  normal: 400,
  medium: 600,
  bold: 700
} as const

export const lineHeight = {
  /** 16px — captions, labels */
  tight: '1rem',
  /** 24px — body, buttons */
  normal: '1.5rem',
  /** 32px — headings */
  relaxed: '2rem'
} as const

/**
 * Composite text styles for common roles.
 * Use in styled-components: ${textStyle.body}
 */
export const textStyle = {
  /** 10px / 16px / 600 — tiny labels, badges */
  caption: `
    font-size: ${fontSize.xs};
    line-height: ${lineHeight.tight};
    font-weight: ${fontWeight.medium};
  `,
  /** 12px / 16px / 600 — secondary text, metadata */
  secondary: `
    font-size: ${fontSize.sm};
    line-height: ${lineHeight.tight};
    font-weight: ${fontWeight.medium};
  `,
  /** 14px / 24px / 600 — default body */
  body: `
    font-size: ${fontSize.base};
    line-height: ${lineHeight.normal};
    font-weight: ${fontWeight.medium};
  `,
  /** 16px / 24px / 600 — section titles, prominent labels */
  subheading: `
    font-size: ${fontSize.lg};
    line-height: ${lineHeight.normal};
    font-weight: ${fontWeight.medium};
    text-transform: uppercase;
  `,
  /** 18px / 32px / 700 — page headings */
  heading: `
    font-size: ${fontSize.xl};
    line-height: ${lineHeight.relaxed};
    font-weight: ${fontWeight.bold};
  `,
  /** 24px / 32px / 700 — display, hero elements */
  display: `
    font-size: ${fontSize['2xl']};
    line-height: ${lineHeight.relaxed};
    font-weight: ${fontWeight.bold};
  `
} as const
