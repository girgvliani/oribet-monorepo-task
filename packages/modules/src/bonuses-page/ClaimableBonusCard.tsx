import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { AtomDiamondOrange } from '@oribet/assets/atoms/AtomDiamondOrange'
import { claimDepositBonuses } from '@oribet/core/api/services/Bonus.api'
import { BonusCard } from '@oribet/modules/app-sidebar'
import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { formatAmount } from '@oribet/core/util/appUtil'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import { IPlayBonusMoney } from '@oribet/core/types/BonusMode.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface ClaimableBonusCardProps {
  bonus: IPlayBonusMoney
  onClaimed: () => void
}

const ClaimableBonusCard: FC<ClaimableBonusCardProps> = ({ bonus, onClaimed }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [claiming, setClaiming] = useState(false)

  const handleClaim = () => {
    setClaiming(true)
    claimDepositBonuses({ player_bonus_id: bonus.id })
      .then(() => onClaimed())
      .catch(() => {})
      .finally(() => setClaiming(false))
  }

  return (
    <BonusCard
      icon={<AtomDiamondOrange />}
      title={t('bonus.readyToClaim')}
      infoText={`${getActiveCurrencySymbol(bonus.currency)}${formatAmount(bonus.amount)}`}
      backgroundColor={theme.colors.bg.secondary}
      partialBorder
      fullWidth
      testId={`${BONUSES_TEST_IDS.list.card}.${bonus.id}`}
      footerContent={
        <ActionButton
          buttonType={BUTTON_TYPE.Claim}
          label={t('bonus.claim')}
          color="orange"
          disabled={claiming}
          onClick={handleClaim}
          data-testid={`${BONUSES_TEST_IDS.list.action}.${bonus.id}.claim`}
          style={{ marginTop: '4px' }}
        />
      }
    />
  )
}

export default ClaimableBonusCard
