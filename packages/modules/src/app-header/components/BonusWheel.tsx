import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { BonusCard } from '@oribet/modules/app-sidebar'
import useCountdownTimer from '@oribet/core/hooks/useCountdownTimer'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import {
  changeGlobalUserRegistrationModalOpen,
  globalBonusWheelModalOpen,
} from '@oribet/core/redux/slices/userSlice'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface BonusWheelBannerProps {
  isUserAuthenticated: boolean
  callBack?: (value: boolean) => void
  fullWidth?: boolean
  backgroundColor?: string
  partialBorder?: boolean
  ctaTestId?: string
}

const BonusWheel: FC<BonusWheelBannerProps> = ({
  isUserAuthenticated,
  callBack = () => {},
  fullWidth = false,
  backgroundColor,
  partialBorder = false,
  ctaTestId,
}) => {
  const dispatch = useAppDispatch()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const { t } = useTranslation()

  const needsTimer = isUserAuthenticated && playerInfo?.player?.wheel_spins === 1
  const { hours, minutes, seconds, isExpired } = useCountdownTimer(
    needsTimer ? playerInfo?.player?.can_spin_after : null
  )
  const isAvailable = !needsTimer || isExpired

  useEffect(() => {
    callBack(isAvailable)
  }, [isAvailable])

  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`
  }

  return (
    <BonusCard
      testId={BONUSES_TEST_IDS.header.wheel}
      partialBorder={partialBorder}
      backgroundColor={backgroundColor}
      fullWidth={fullWidth}
      icon={<img src="/imgs/bonus/wheel-bg.png" width={24} height={18} alt="bonus wheel" />}
      title={t('oribetMenu.bonusWheel')}
      infoText={
        isAvailable
          ? t('leaderboard.available')
          : `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
      }
      footerContent={
        <ActionButton
          color="pink"
          buttonType={BUTTON_TYPE.Spin}
          label="Spin"
          data-testid={ctaTestId}
          disabled={!isAvailable}
          onClick={() =>
            dispatch(
              isUserAuthenticated
                ? globalBonusWheelModalOpen(true)
                : changeGlobalUserRegistrationModalOpen(true)
            )
          }
        />
      }
    />
  )
}

export default BonusWheel
