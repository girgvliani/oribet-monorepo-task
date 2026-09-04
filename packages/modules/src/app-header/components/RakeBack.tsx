import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { claimRakeBacks } from '@oribet/core/api/services/Bonus.api'
import { AtomRakeBack } from '@oribet/assets/atoms/AtomRakeBack'
import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { BonusCard } from '@oribet/modules/app-sidebar'
import { getRakebackNameBySlug } from '@oribet/core/util/BonusHelper'
import useBonusClaim from '@oribet/core/hooks/bonus/useBonusClaim'
import useBonusCountdown from '@oribet/core/hooks/bonus/useBonusCountdown'
import { formatAmount } from '@oribet/core/util/appUtil'
import { useTranslation } from 'react-i18next'
import { IRakeBackOrCashBack } from '@oribet/core/types/Bonus.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface IRakeback {
  rakeBackInfo: IRakeBackOrCashBack
  reloadData?: () => void
  backgroundColor?: string
  fullWidth?: boolean
  partialBorder?: boolean
}

const RakeBack = ({
  rakeBackInfo,
  reloadData,
  backgroundColor,
  fullWidth,
  partialBorder = false,
}: IRakeback) => {
  const { t } = useTranslation()
  const { countdown, isReady, formattedTime } = useBonusCountdown(rakeBackInfo)
  const canClaim = isReady && !!rakeBackInfo.available
  const handleClaim = useBonusClaim({
    claimFn: claimRakeBacks,
    payload: { player_rakeback_id: rakeBackInfo.id },
    isReady: canClaim,
    reloadData,
    responseAccessor: {
      getSuccess: r => r.data.success,
      getAmount: r => r.data.data.amount,
      getMessage: r => r.data.message,
    },
  })

  const getInfoText = () => {
    if (!isReady) return formattedTime
    if (rakeBackInfo.available)
      return `${t('leaderboard.available')} ${getActiveCurrencySymbol()}${formatAmount(rakeBackInfo.claimable_amount)}`
    return t('leaderboard.available')
  }

  return (
    <BonusCard
      testId={BONUSES_TEST_IDS.header.rakeback}
      icon={<AtomRakeBack />}
      title={t(getRakebackNameBySlug(rakeBackInfo.slug))}
      inactive={countdown > 0}
      infoText={getInfoText()}
      footerContent={
        isReady && !rakeBackInfo.available ? (
          <ActionButton
            color="green"
            disabled
            buttonType={BUTTON_TYPE.Expired}
            label={t('bonus.notEnoughToClaim')}
            data-testid={`${BONUSES_TEST_IDS.header.action}.rakeback.wager`}
          />
        ) : (
          <ActionButton
            color="green"
            onClick={handleClaim}
            buttonType={BUTTON_TYPE.Claim}
            disabled={!canClaim}
            data-testid={`${BONUSES_TEST_IDS.header.action}.rakeback.claim`}
          />
        )
      }
      fullWidth={fullWidth}
      backgroundColor={backgroundColor}
      partialBorder={partialBorder}
    />
  )
}

export default RakeBack
