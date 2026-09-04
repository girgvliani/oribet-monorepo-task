import styled, { css, keyframes } from 'styled-components'
import { duration } from '../../tokens'

type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  className?: string
}

const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  style,
  className
}: SkeletonProps) => {
  return (
    <StyledSkeleton
      $variant={variant}
      $width={width}
      $height={height}
      style={style}
      className={className}
    />
  )
}

export default Skeleton

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const StyledSkeleton = styled.div<{
  $variant: SkeletonVariant
  $width?: string | number
  $height?: string | number
}>`
  display: block;
  background: ${({ theme }) => theme.colors.gradient.skeleton};
  background-size: 200px 100%;
  animation: ${shimmer} 2s ease-in-out infinite;

  ${({ $width }) =>
    $width !== undefined &&
    css`
      width: ${typeof $width === 'number' ? `${$width}px` : $width};
    `}

  ${({ $height }) =>
    $height !== undefined &&
    css`
      height: ${typeof $height === 'number' ? `${$height}px` : $height};
    `}

  ${({ $variant }) => {
    switch ($variant) {
      case 'text':
        return css`
          height: 1em;
          border-radius: 4px;
          transform-origin: 0 55%;
          transform: scale(1, 0.6);
        `
      case 'circular':
        return css`
          border-radius: 50%;
        `
      case 'rounded':
        return css`
          border-radius: 8px;
        `
      case 'rectangular':
      default:
        return css`
          border-radius: 0;
        `
    }
  }}
`
