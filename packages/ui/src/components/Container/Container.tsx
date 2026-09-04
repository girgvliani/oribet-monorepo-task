import { type ReactNode } from 'react'
import styled, { css } from 'styled-components'

type Spacing = string | number

export interface ContainerProps {
  children: ReactNode
  /** Padding on all sides. Overridden on an axis if px or py is provided. */
  p?: Spacing
  /** Horizontal padding (left + right). Overrides p on the x axis. */
  px?: Spacing
  /** Vertical padding (top + bottom). Overrides p on the y axis. */
  py?: Spacing
  flex?: boolean
  flexDirection?: 'row' | 'column'
  gap?: Spacing
  className?: string
}

const toCss = (v: Spacing | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v

const Container = ({
  children,
  p,
  px,
  py,
  flex,
  flexDirection,
  gap: flexGap,
  className,
}: ContainerProps) => {
  return (
    <StyledContainer
      className={className}
      $pt={toCss(py ?? p)}
      $pr={toCss(px ?? p)}
      $pb={toCss(py ?? p)}
      $pl={toCss(px ?? p)}
      $flex={flex}
      $flexDirection={flexDirection}
      $flexGap={toCss(flexGap)}
    >
      {children}
    </StyledContainer>
  )
}

export default Container

interface PaddingProps {
  $pt?: string
  $pr?: string
  $pb?: string
  $pl?: string
}

const paddingCss = css<PaddingProps>`
  ${({ $pt }) => ($pt ? `padding-top: ${$pt};` : '')}
  ${({ $pr }) => ($pr ? `padding-right: ${$pr};` : '')}
  ${({ $pb }) => ($pb ? `padding-bottom: ${$pb};` : '')}
  ${({ $pl }) => ($pl ? `padding-left: ${$pl};` : '')}
`

/**
 * Responsive max-width scale (Tailwind breakpoints):
 * sm=640px, md=768px, lg=1024px, xl=1280px, 2xl=1536px.
 *
 * Below sm, width is 100% (no max). Above 2xl, max-width caps at 1536px.
 */
const StyledContainer = styled.div<
  PaddingProps & { $flex?: boolean; $flexDirection?: 'row' | 'column'; $flexGap?: string }
>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;

  ${paddingCss}

  ${({ $flex, $flexDirection, $flexGap }) =>
    $flex
      ? `
    display: flex;
    flex-direction: ${$flexDirection || 'row'};
    gap: ${$flexGap || '0'};
  `
      : ''}

  @media (min-width: 640px) {
    max-width: 640px;
  }
  @media (min-width: 768px) {
    max-width: 768px;
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
`
