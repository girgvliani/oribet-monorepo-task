import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { claimBmBonusById } from '@oribet/core/api/services/BmBonus.api'
import { ActionButton } from '@oribet/modules/app-sidebar'
import { PLAY_TEST_IDS } from '@oribet/test-ids'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { clearBmBonusReadyToClaim } from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { formatAmount } from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fontSize, media } from '@oribet/ui'
import styled, { keyframes } from 'styled-components'

const COUNTDOWN_DURATION = 3000

interface BonusReadyToClaimModalProps {
  returnMode?: boolean
  claimAmount?: string
  claimBonusId?: number
}

function BonusReadyToClaimModal({ returnMode, claimAmount, claimBonusId }: BonusReadyToClaimModalProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [buttonsEnabled, setButtonsEnabled] = useState(!!returnMode)
  const [loading, setLoading] = useState(false)
  const bmBonusReadyToClaim = useAppSelector(state => state.user.bmBonusReadyToClaim)
  const bonusBalance = useAppSelector(state => state.user.playerInfo?.player?.bonus_balance)

  const bonusId = returnMode ? claimBonusId : bmBonusReadyToClaim?.bonus_id
  const displayAmount = returnMode ? claimAmount : bonusBalance

  useEffect(() => {
    if (returnMode) return
    const timer = setTimeout(() => setButtonsEnabled(true), COUNTDOWN_DURATION)
    return () => clearTimeout(timer)
  }, [returnMode])

  const handleClaim = () => {
    if (!bonusId) return
    setLoading(true)

    claimBmBonusById(bonusId)
      .then(res => {
        if (res.success) {
          dispatch(clearBmBonusReadyToClaim())
          Defaults.modals.bonusReadyToClaimModal?.hide()
          setTimeout(() => {
            window.location.href = AppRoutePath.HOME()
          }, 500)
        }
      })
      .catch(err => {
        enqueueSnackbar(err.response?.data?.data?.message || 'Failed to claim bonus', {
          variant: 'error',
          autoHideDuration: 40000,
        })
        setLoading(false)
      })
  }

  return (
    <div>
      {!buttonsEnabled ? (
        <>
          <RadialContainer>
            <svg viewBox="0 0 100 100" width="120" height="120">
              <CircleBg cx="50" cy="50" r="45" />
              <CircleProgress cx="50" cy="50" r="45" $duration={COUNTDOWN_DURATION} />
            </svg>
          </RadialContainer>
          <LoadingText>{t('bonusMoney.bonusGettingReady')}</LoadingText>
        </>
      ) : (
        <>
          <BgImageContainerStyle>
            <BgImageStyle src="/imgs/bonus/layer.svg" alt="bonus-bg" />
            <ImgStyle src="/imgs/bonus/modal-img-2.png" alt="bonus-icon" />
          </BgImageContainerStyle>

          <Paragraph>
            {returnMode
              ? t('bonusMoney.claimPreviousBonus')
              : t('bonusMoney.bonusReadyToClaim')}
          </Paragraph>

          <ButtonsWrapper>
            <BalanceCard>
              <Label>{t('bonusMoney.currentBonusBalance')}</Label>
              <Price>
                {getActiveCurrencySymbol()}
                {formatAmount(displayAmount)}
              </Price>
            </BalanceCard>
          </ButtonsWrapper>
        </>
      )}

      <ButtonContainer>
        <ActionButton
          color="orange"
          buttonType=""
          withIcon={false}
          disabled={!buttonsEnabled || loading}
          onClick={handleClaim}
          label={t('bonusMoney.claimBonus')}
          data-testid={PLAY_TEST_IDS.bonus.claimExit}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default BonusReadyToClaimModal

const CIRCUMFERENCE = 2 * Math.PI * 45

const fillAnimation = keyframes`
  from {
    stroke-dashoffset: ${CIRCUMFERENCE};
  }
  to {
    stroke-dashoffset: 0;
  }
`

const RadialContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0 8px;
`

const CircleBg = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.surface.hover};
  stroke-width: 6;
`

const CircleProgress = styled.circle<{ $duration: number }>`
  fill: none;
  stroke: ${({ theme }) => theme.colors.accent.primary};
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCUMFERENCE};
  stroke-dashoffset: ${CIRCUMFERENCE};
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  animation: ${fillAnimation} ${({ $duration }) => $duration}ms linear forwards;
`

const LoadingText = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
  padding: 8px 16px 16px;
`

const Paragraph = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px 16px;
`

const BalanceCard = styled.div`
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.5),
    0 1px 0px 0px ${({ theme }) => theme.colors.surface.hover} inset;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  padding: 8px 12px;
  box-sizing: border-box;
  width: 100%;
`

const Label = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 16px;
  display: block;
  opacity: 0.92;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const Price = styled.h5`
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ButtonContainer = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .button__label {
    font-size: 12px !important;
  }
`

const ImgStyle = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  bottom: 16px;
  left: 50%;
  transform: translate(-50%, -50%);
`

const BgImageStyle = styled.img`
  mix-blend-mode: overlay;

  ${media.sm} {
    width: 100%;
  }
`

const BgImageContainerStyle = styled.div`
  position: relative;
  height: 112px;

  ${media.sm} {
    height: 136px;
  }
`
