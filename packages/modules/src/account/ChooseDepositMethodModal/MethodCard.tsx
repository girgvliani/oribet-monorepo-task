import { IconChevronRight, Spinner } from '@oribet/ui'
import { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface MethodCardProps {
  /** Icon/glyph shown inside the 46px tile. */
  icon: ReactNode
  /** Large, low-opacity decorative glyph in the card's corner. Defaults to `icon`. */
  watermark?: ReactNode
  /** Border + overlay-gradient + watermark tint (e.g. `#26a17b`). */
  accent: string
  /** Tile background — solid accent or a gradient, per the design. */
  tileBackground: string
  /** Tile box-shadow tint (some methods shadow a different hex than `accent`). */
  tileShadowColor: string
  /** Icon/glyph color inside the tile (crypto = white, bank = near-black on gold). */
  tileIconColor: string
  title: string
  subtitle?: string
  disabled?: boolean
  loading?: boolean
  onClick: () => void
  testId: string
}

/**
 * A single deposit-method row: icon tile + title/subtitle + chevron, tinted by `accent`.
 * Shared shell for every method (crypto, bank, card, buy-crypto) — only the icon/accent/
 * copy differ per provider.
 */
const MethodCard: FC<MethodCardProps> = ({
  icon,
  watermark,
  accent,
  tileBackground,
  tileShadowColor,
  tileIconColor,
  title,
  subtitle,
  disabled,
  loading,
  onClick,
  testId,
}) => {
  const busy = disabled || loading
  return (
    <Root
      $accent={accent}
      $disabled={!!busy}
      onClick={() => !busy && onClick()}
      data-testid={testId}
    >
      <Watermark $accent={accent}>{watermark ?? icon}</Watermark>
      <IconTile
        $background={tileBackground}
        $shadowColor={tileShadowColor}
        $iconColor={tileIconColor}
      >
        {icon}
      </IconTile>
      <Texts>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Texts>
      {loading ? <Spinner size={16} color={accent} /> : <Chevron />}
    </Root>
  )
}

export default MethodCard

const Root = styled.div<{ $accent: string; $disabled: boolean }>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 15px 16px;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(
      92.714deg,
      ${({ $accent }) => $accent}1c -9.971%,
      ${({ $accent }) => $accent}00 41.567%,
      ${({ $accent }) => $accent}00 83.734%
    ),
    #0c141f;
  border: 1px solid ${({ $accent }) => $accent}52;
  border-radius: 15px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition:
    border-color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    transform 0.1s ease-in-out;

  ${({ $disabled, $accent }) =>
    !$disabled &&
    css`
      &:hover {
        border-color: ${$accent};
        background-color: #ffffff08;
      }
      &:active {
        transform: scale(0.99);
      }
    `}
`

const Watermark = styled.div<{ $accent: string }>`
  box-sizing: border-box;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.16;
  color: ${({ $accent }) => $accent};
  pointer-events: none;
  overflow: hidden;
  font-size: 110px;
  font-weight: 800;
  line-height: 1;

  svg {
    width: 100%;
    height: 100%;
  }
`

const IconTile = styled.div<{ $background: string; $shadowColor: string; $iconColor: string }>`
  box-sizing: border-box;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ $background }) => $background};
  box-shadow: 0px 8px 21px 0px ${({ $shadowColor }) => $shadowColor}4d;
  color: ${({ $iconColor }) => $iconColor};
  font-size: 19px;
  font-weight: 800;
  position: relative;
  z-index: 1;
`

const Texts = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  z-index: 1;
`

const Title = styled.span`
  font-size: 15.5px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Subtitle = styled.span`
  font-size: 12.5px;
  font-weight: 400;
  color: #8b93a0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Chevron = styled(IconChevronRight).attrs({ size: 16 })`
  flex-shrink: 0;
  color: #6f767e;
  position: relative;
  z-index: 1;
`
