import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { AtomDiamondOrange } from '@oribet/assets/atoms/AtomDiamondOrange'
import { BonusCard } from '@oribet/modules/app-sidebar'
import { formatAmount } from '@oribet/core/util/appUtil'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'
import { IPlayBonusMoney } from '@oribet/core/types/BonusMode.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface QueuedBonusCardProps {
  bonus: IPlayBonusMoney
}

const QueuedBonusCard: FC<QueuedBonusCardProps> = ({ bonus }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const currencySymbol = getActiveCurrencySymbol(bonus.currency)
  const amount = formatAmount(bonus.init_amount)
  const wagerMultiplier = bonus.wagering_coefficient
    ? bonus.wagering_coefficient
    : bonus.wager_amount && bonus.init_amount
      ? (Number(bonus.wager_amount) / Number(bonus.init_amount)).toFixed(0)
      : null

  const title = wagerMultiplier
    ? `${currencySymbol}${amount} Bonus (${wagerMultiplier}X)`
    : `${currencySymbol}${amount} Bonus`

  return (
    <BonusCard
      icon={<AtomDiamondOrange />}
      title={title}
      infoText={`${currencySymbol}${formatAmount(bonus.amount)}`}
      rightText={<QueuedBadge>{t('bonus.queued')}</QueuedBadge>}
      backgroundColor={theme.colors.bg.secondary}
      partialBorder
      fullWidth
      testId={`${BONUSES_TEST_IDS.list.card}.${bonus.id}`}
    />
  )
}

export default QueuedBonusCard

const QueuedBadge = styled.span`
  font-size: ${fontSize.xs};
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text.tertiary};
  background: ${({ theme }) => theme.colors.surface.hover};
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
`
