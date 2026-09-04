import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import styled, { keyframes } from 'styled-components'
import { GAME_CARD_ASPECT_RATIOS, type GameCardAspectRatio } from './aspectRatio'
import { useGameCardAspectRatio } from './GameCardConfig'

interface GameCardSkeletonProps {
  aspectRatio?: GameCardAspectRatio
  fillWidth?: boolean
}

const GameCardSkeleton = ({ aspectRatio, fillWidth = false }: GameCardSkeletonProps = {}) => {
  const isMobile = useIsMobile()
  const configAspectRatio = useGameCardAspectRatio()
  const resolvedAspectRatio = aspectRatio ?? configAspectRatio
  return (
    <SkeletonBox
      $isMobile={isMobile}
      $aspectRatio={resolvedAspectRatio}
      $fillWidth={fillWidth}
    />
  )
}

export default GameCardSkeleton

const skeletonPulse = keyframes`
  0%, 100% {
    background-color: var(--skeleton-base);
  }
  50% {
    background-color: var(--skeleton-pulse);
  }
`

const SkeletonBox = styled.div<{
  $isMobile: boolean
  $aspectRatio: GameCardAspectRatio
  $fillWidth: boolean
}>`
  --skeleton-base: ${({ theme }) => theme.colors.bg.secondary};
  --skeleton-pulse: ${({ theme }) => theme.colors.surface.hover};
  min-width: ${({ $isMobile, $fillWidth }) =>
    $fillWidth ? '0' : $isMobile ? '104px' : '152px'};
  width: ${({ $isMobile, $fillWidth }) =>
    $fillWidth ? '100%' : $isMobile ? '104px' : '152px'};
  aspect-ratio: ${({ $aspectRatio }) => GAME_CARD_ASPECT_RATIOS[$aspectRatio]};
  border-radius: 8px;
  animation: ${skeletonPulse} 1.5s ease-in-out infinite;
`
