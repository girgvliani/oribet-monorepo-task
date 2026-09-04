import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { claimCashBacks } from '@oribet/core/api/services/Bonus.api'
import { AtomCashback } from '@oribet/assets/atoms/AtomCashback'
import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { BonusCard } from '@oribet/modules/app-sidebar'
import { getCashbackNameBySlug } from '@oribet/core/util/BonusHelper'
import useBonusClaim from '@oribet/core/hooks/bonus/useBonusClaim'
import useBonusCountdown from '@oribet/core/hooks/bonus/useBonusCountdown'
import { formatAmount } from '@oribet/core/util/appUtil'
import { useTranslation } from 'react-i18next'
import { IRakeBackOrCashBack } from '@oribet/core/types/Bonus.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface ICashback {
  cashBackInfo: IRakeBackOrCashBack
  reloadData?: () => void
  backgroundColor?: string
  fullWidth?: boolean
  partialBorder?: boolean
}

const CashBack = ({
  cashBackInfo,
  reloadData,
  backgroundColor,
  fullWidth,
  partialBorder = false,
}: ICashback) => {
  const { t } = useTranslation()
  const { countdown, isReady, formattedTime } = useBonusCountdown(cashBackInfo)
  const canClaim = isReady && !!cashBackInfo.available
  const handleClaim = useBonusClaim({
    claimFn: claimCashBacks,
    payload: { player_cashback_id: cashBackInfo.id },
    isReady: canClaim,
    reloadData,
    responseAccessor: {
      getSuccess: r => r.data.success,
      getAmount: r => r.data.amount,
      getMessage: r => r.data.message,
    },
    bonusType: 'cashback',
  })

  const getInfoText = () => {
    if (!isReady) return formattedTime
    if (cashBackInfo.available)
      return `${t('leaderboard.available')} ${getActiveCurrencySymbol()}${formatAmount(cashBackInfo.claimable_amount)}`
    return t('leaderboard.available')
  }

  return (
    <BonusCard
      testId={BONUSES_TEST_IDS.header.cashback}
      icon={<AtomCashback />}
      inactive={countdown > 0}
      title={t(getCashbackNameBySlug(cashBackInfo.slug))}
      infoText={getInfoText()}
      footerContent={
        isReady && !cashBackInfo.available ? (
          <ActionButton
            color="purple"
            disabled
            buttonType={BUTTON_TYPE.Expired}
            label={t('bonus.notEnoughToClaim')}
            data-testid={`${BONUSES_TEST_IDS.header.action}.cashback.wager`}
          />
        ) : (
          <ActionButton
            color="purple"
            onClick={handleClaim}
            buttonType={BUTTON_TYPE.Claim}
            disabled={!canClaim}
            data-testid={`${BONUSES_TEST_IDS.header.action}.cashback.claim`}
          />
        )
      }
      backgroundColor={backgroundColor}
      fullWidth={fullWidth}
      partialBorder={partialBorder}
    />
  )
}

export default CashBack
