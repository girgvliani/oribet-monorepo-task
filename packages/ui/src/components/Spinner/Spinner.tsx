import styled, { keyframes, useTheme } from 'styled-components'

interface SpinnerProps {
  size?: number
  color?: string
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const StyledSpinner = styled.div<{ $size: number; $color: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid transparent;
  border-top-color: ${({ $color }) => $color};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`

/**
 * `role="progressbar"` so a loading state is announced rather than being a silent spinning
 * div — screen readers had nothing to report, and the button tests that assert a loader is
 * present had no accessible handle to query.
 */
export const Spinner = ({ size = 24, color }: SpinnerProps) => {
  const theme = useTheme()
  return (
    <StyledSpinner
      role="progressbar"
      aria-busy="true"
      $size={size}
      $color={color ?? theme.colors.accent.brand}
    />
  )
}

export default Spinner
