import {
  changeGlobalUserRegistrationModalOpen,
  globalBonusWheelModalOpen,
} from '@oribet/core/redux/slices/userSlice'
import useCountdownTimer from '@oribet/core/hooks/useCountdownTimer'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { fontSize } from '@oribet/ui'
import styled, { keyframes } from 'styled-components'

interface BonusWheelBannerProps {
  isUserAuthenticated: boolean
  isSidebarOpen: boolean
}

const BonusWheelBanner: FC<BonusWheelBannerProps> = ({ isUserAuthenticated, isSidebarOpen }) => {
  const dispatch = useAppDispatch()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const { t } = useTranslation()

  const needsTimer = isUserAuthenticated && playerInfo?.player?.wheel_spins === 1
  const { hours, minutes, seconds, isExpired } = useCountdownTimer(
    needsTimer ? playerInfo?.player?.can_spin_after : null
  )
  const isAvailable = !needsTimer || isExpired

  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`
  }

  return (
    <BonusWheelRoot
      data-testid={BONUSES_TEST_IDS.wheel.banner}
      onClick={() =>
        dispatch(
          isUserAuthenticated
            ? globalBonusWheelModalOpen(true)
            : changeGlobalUserRegistrationModalOpen(true)
        )
      }
    >
      <img
        src={'/imgs/bonus/wheel.png'}
        alt={'Bonus Wheel'}
        style={{
          marginLeft: '3px',
        }}
      />
      {isSidebarOpen && (
        <DescriptionContainer>
          <DescriptionLeft>{t('oribetMenu.bonusWheel')}</DescriptionLeft>
          <DescriptionRight>
            {isUserAuthenticated && (
              <>
                {isAvailable && t('leaderboard.available')}
                {!isAvailable &&
                  `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
              </>
            )}
          </DescriptionRight>
        </DescriptionContainer>
      )}
    </BonusWheelRoot>
  )
}

export default BonusWheelBanner

const bonusWheelAnimation = keyframes`
  0% {
    opacity: 0;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const BonusWheelRoot = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.gradient.bonusWheelBanner};
  cursor: pointer;
  width: 100%;
  height: 48px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  min-width: 0px;
  min-height: 48px;
  box-sizing: border-box;
`

const DescriptionContainer = styled.div`
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  width: 100%;
  margin-right: 8px;
  opacity: 1;
  animation: ${bonusWheelAnimation} 0.2s ease;
`

const DescriptionLeft = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 20px;
  margin: 0;
`

const DescriptionRight = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`
