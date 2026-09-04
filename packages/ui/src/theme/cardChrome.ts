import { css } from 'styled-components'

/**
 * Theme-driven card chrome: a 1px masked border painted from `gradient.cardBorder`
 * over a `surface.card` background. Each brand's theme drives the appearance with no
 * brand-specific code — oribet stays subtle, Korea renders its gold gradient border,
 * and future brands only need to set the two tokens (both optional; sensible fallbacks
 * keep existing themes unchanged).
 *
 * Apply to a styled card that sets its own `border-radius`.
 */
export const cardChrome = css`
  position: relative;
  background: ${({ theme }) => theme.colors.surface.card ?? theme.colors.bg.secondary};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: ${({ theme }) => theme.colors.gradient.cardBorder ?? theme.colors.surface.border};
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`
