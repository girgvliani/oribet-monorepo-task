import useCountdownTimer from '@oribet/core/hooks/useCountdownTimer'
import { useAppSelector } from '@oribet/core/redux/hooks'
import React from 'react'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'

interface BonusWheelCountDownTimerProps {
  showSpin: () => void
}

const BonusWheelCountDownTimer: React.FC<BonusWheelCountDownTimerProps> = ({ showSpin }) => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const { hours, minutes, seconds } = useCountdownTimer(playerInfo?.player?.can_spin_after, {
    onComplete: showSpin,
  })

  const formatTime = (value: number): string => (value < 10 ? `0${value}` : `${value}`)

  return (
    <TimerWrapper>
      <TimeText>{formatTime(hours)}</TimeText>
      <TimeText> : </TimeText>
      <TimeText>{formatTime(minutes)}</TimeText>
      <TimeText> : </TimeText>
      <TimeText>{formatTime(seconds)}</TimeText>
    </TimerWrapper>
  )
}

export default BonusWheelCountDownTimer

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TimeText = styled.span`
  font-size: ${fontSize['3xl']};
  font-weight: 700;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
`
