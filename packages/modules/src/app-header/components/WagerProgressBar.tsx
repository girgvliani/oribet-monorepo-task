import React from 'react'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'

interface WagerProgressBarProps {
  wager?: number
  progress: number
  label?: string
  label2?: string
  totalSegments?: number
  differentStyle?: boolean
  withoutParcent?: boolean
  shouldBeThin?: boolean
  color: 'orange' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  backgroundColor?: string
  className?: string
}

const WagerProgressBar: React.FC<WagerProgressBarProps> = ({
  wager,
  color,
  progress,
  label = 'Wager Progress',
  label2 = '',
  shouldBeThin = false,
  withoutParcent = false,
  totalSegments = 5,
  backgroundColor,
  className,
}) => {
  const theme = useTheme()
  const resolvedBackgroundColor = backgroundColor ?? theme.colors.bg.secondary
  const activeSegments = Math.floor((progress / 100) * totalSegments)

  return (
    <Container $backgroundColor={resolvedBackgroundColor} className={className}>
      <ProgressHeader>
        {label2 ? (
          <ProgressValue>{label2} </ProgressValue>
        ) : (
          <ProgressValue>
            {withoutParcent ? (
              ''
            ) : (
              <>
                {`${progress > 100 ? 100 : progress}%`}{' '}
                {wager && wager > 0 ? <WagerSpan>({wager}X)</WagerSpan> : ''}
              </>
            )}
          </ProgressValue>
        )}
        <ProgressLabel>{label}</ProgressLabel>
      </ProgressHeader>

      <ProgressBarContainer>
        {Array.from({ length: totalSegments }).map((_, index) => (
          <ProgressSegment
            key={index}
            className="progress__column"
            $active={index < activeSegments}
            $color={color}
            $shouldBeThin={shouldBeThin}
          />
        ))}
      </ProgressBarContainer>
    </Container>
  )
}

export default WagerProgressBar

const WagerSpan = styled.span`
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 16px;
  letter-spacing: 0px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const Container = styled.div<{ $backgroundColor: string }>`
  width: 100%;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 8px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`

const ProgressHeader = styled.div`
  width: 100%;
`

const ProgressValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.lg};
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-bottom: 4px;
  height: 16px;
`

const ProgressLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${fontSize.xs};
  line-height: 12px;
  font-weight: 600;
  letter-spacing: 0px;
  opacity: 0.92;
`

const ProgressBarContainer = styled.div`
  display: flex;
  gap: 2px;
`

const ProgressSegment = styled.div<{
  $active: boolean
  $color?: string
  $shouldBeThin?: boolean
}>`
  width: 20px;
  height: 32px;
  border-radius: 2px;
  background: ${({ $active, $color, theme }) =>
    $active && $color === 'orange'
      ? 'linear-gradient(to bottom, #ff7c48, #ff4c1c)'
      : $active && $color === 'Bronze'
        ? 'linear-gradient(200.95deg, #CE8946 -0.56%, #955F2B 100%)'
        : $active && $color === 'Silver'
          ? 'linear-gradient(200.95deg, #F0F0F1 -0.56%, #909199 100%)'
          : $active && $color === 'Gold'
            ? 'linear-gradient(200.95deg, #FEE98F -0.56%, #EA972F 100%)'
            : $active && $color === 'Diamond'
              ? 'linear-gradient(200.95deg, #6CCFF6 -0.56%, #14C0F3 100%)'
              : theme.colors.surface.hover};

  ${({ $active, $color }) =>
    $active &&
    $color === 'orange' &&
    `
    box-shadow: 0px 1px 2px 0px #00000040,
              0px 0px 10px 2px #D83C1D80,
              0px 4px 16px 0px #FFFFFF33 inset;
    background: linear-gradient(to bottom, #ff7c48, #ff4c1c);
    box-shadow: 0px 0px 10px 2px rgba(255, 76, 28, 0.5), rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
  `}

  ${({ $active, $color }) =>
    $active &&
    $color === 'Bronze' &&
    `
    box-shadow: 0px 0px 10px 2px rgba(149, 95, 43, 0.5), 0px 4px 16px 0px rgba(255, 255, 255, 0.2) inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
  `}



  ${({ $active, $color }) =>
    $active &&
    $color === 'Silver' &&
    `
    box-shadow: 0px 0px 10px 2px rgba(144, 145, 153, 0.5), 0px 4px 16px 0px rgba(255, 255, 255, 0.2) inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
  `}


  ${({ $active, $color }) =>
    $active &&
    $color === 'Gold' &&
    `
    box-shadow: 0px 0px 10px 2px rgba(149, 95, 43, 0.5), 0px 4px 16px 0px rgba(255, 255, 255, 0.2) inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;

  `}

  ${({ $active, $color }) =>
    $active &&
    $color === 'Diamond' &&
    `
    box-shadow: 0px 0px 10px 2px rgba(20, 192, 243, 0.5), 0px 4px 16px 0px rgba(255, 255, 255, 0.2) inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;

  `}


  @media (max-width: 650px) {
    width: ${({ $shouldBeThin }) => ($shouldBeThin ? '4px' : '20px')};
  }
`
