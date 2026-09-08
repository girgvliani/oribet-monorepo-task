import { CashierBonus } from '@oribet/core/types/Cashier.type'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { WALLET_TEST_IDS } from '@oribet/test-ids'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import xss from 'xss'
import { WALLET_PALETTE as wp } from './palette'

interface BonusListProps {
  walletCurrency: string
  bonuses: CashierBonus[]
  /** `null` means "No bonus" is selected. */
  selectedBonusId: number | null
  onSelect: (bonusId: number | null) => void
  disabled?: boolean
}

/** Strip all HTML from a (possibly localized) desc so it renders as plain text. */
const plainText = (value: CashierBonus['desc']): string => {
  const localized = getLocalizedString(value)
  return xss(localized, { whiteList: {}, stripIgnoreTag: true }).trim()
}

/** `+5%` for percent bonuses, `+10 USDT` for fixed-amount ones. Empty if no amount is set. */
export const formatBonusBadge = (bonus: CashierBonus, walletCurrency: string): string => {
  const config = bonus.currency_config?.[walletCurrency]
  if (!config) return ''
  const amount = Number(config.amount)
  if (!amount) return ''
  return bonus.is_percent ? `+${amount}%` : `+${amount} ${walletCurrency}`
}

const BonusList: FC<BonusListProps> = ({
  walletCurrency,
  bonuses,
  selectedBonusId,
  onSelect,
  disabled,
}) => {
  const { t } = useTranslation()

  const selectedBonus = bonuses.find(b => b.id === selectedBonusId)
  const selectedMinDeposit = selectedBonus
    ? Number(selectedBonus.currency_config?.[walletCurrency]?.min_deposit ?? 0)
    : 0

  const subtitleFor = (bonus: CashierBonus): string => {
    const desc = plainText(bonus.desc)
    if (desc) return desc

    const minDeposit = Number(bonus.currency_config?.[walletCurrency]?.min_deposit ?? 0)
    if (minDeposit > 0) {
      return `${t('wallet.minimumDeposit')}: ${minDeposit} ${walletCurrency}`
    }
    if (bonus.wagering_coefficient) {
      return `${t('wallet.wagering')} ×${bonus.wagering_coefficient}`
    }
    return ''
  }

  return (
    <Root>
      <Option
        $selected={selectedBonusId === null}
        $disabled={!!disabled}
        onClick={() => !disabled && onSelect(null)}
        data-testid={`${WALLET_TEST_IDS.bonus.option}.none`}
      >
        <Radio $selected={selectedBonusId === null} />
        <Title $selected={selectedBonusId === null}>{t('wallet.noBonusTitle')}</Title>
        <Subtitle $selected={selectedBonusId === null}>{t('wallet.noBonusDesc')}</Subtitle>
      </Option>

      {bonuses.map(bonus => {
        const selected = bonus.id === selectedBonusId
        const badge = formatBonusBadge(bonus, walletCurrency)
        return (
          <Option
            key={bonus.id}
            $selected={selected}
            $disabled={!!disabled}
            onClick={() => !disabled && onSelect(bonus.id)}
            data-testid={`${WALLET_TEST_IDS.bonus.option}.${bonus.id}`}
          >
            <Radio $selected={selected} />
            <Texts>
              <Title $selected={selected}>{getLocalizedString(bonus.name)}</Title>
              <Subtitle $selected={selected}>{subtitleFor(bonus)}</Subtitle>
            </Texts>
            {selected && badge && <Badge>{badge}</Badge>}
          </Option>
        )
      })}

      {selectedBonus && selectedMinDeposit > 0 && (
        <MinDepositHint>
          {t('wallet.bonusMinDepositInfo', {
            amount: selectedMinDeposit,
            currency: walletCurrency,
            bonus: getLocalizedString(selectedBonus.name),
          })}
        </MinDepositHint>
      )}
    </Root>
  )
}

export default BonusList

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Option = styled.div<{ $selected: boolean; $disabled: boolean }>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ $selected }) => ($selected ? '11px' : '12px')};
  padding: ${({ $selected }) => ($selected ? '12px 14px' : '14px')};
  border-radius: 14px;
  cursor: ${({ $disabled }) => ($disabled ? 'wait' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  background: ${({ $selected }) => ($selected ? wp.bgElevated : 'none')};
  background-image: ${({ $selected }) =>
    $selected
      ? 'none'
      : `linear-gradient(90deg, #090e17f2 0%, #090e17f2 42%, #090e1766 100%),
         linear-gradient(45deg, #ffffff1f 25%, transparent 25%, transparent 75%, #ffffff1f 75%),
         linear-gradient(45deg, #ffffff1f 25%, transparent 25%, transparent 75%, #ffffff1f 75%)`};
  background-size: ${({ $selected }) => ($selected ? 'auto' : 'auto, 8px 8px, 8px 8px')};
  background-position: ${({ $selected }) => ($selected ? '0 0' : '0 0, 0 0, 4px 4px')};
  border: ${({ $selected }) =>
    $selected ? `1.5px solid ${wp.gold}a6` : `1px solid ${wp.textPrimary}17`};
  transition:
    border-color 0.15s ease-in-out,
    background 0.15s ease-in-out;

  ${({ $disabled, $selected }) =>
    !$disabled &&
    css`
      &:hover {
        border-color: ${$selected ? wp.gold : `${wp.textPrimary}4d`};
        ${!$selected && `background-color: ${wp.textPrimary}0d;`}
      }
      &:active {
        transform: scale(0.99);
      }
    `}
`

const Radio = styled.div<{ $selected: boolean }>`
  box-sizing: border-box;
  width: ${({ $selected }) => ($selected ? '18px' : '16px')};
  height: ${({ $selected }) => ($selected ? '18px' : '16px')};
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? wp.gold : `${wp.textPrimary}66`)};
  position: relative;

  &::after {
    content: '';
    display: ${({ $selected }) => ($selected ? 'block' : 'none')};
    position: absolute;
    width: 8px;
    height: 8px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: ${wp.gold};
  }
`

const Texts = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const Title = styled.span<{ $selected: boolean }>`
  font-size: ${({ $selected }) => ($selected ? '13.5px' : '13px')};
  font-weight: 700;
  color: ${wp.textPrimary};
  line-height: 1.3;
`

const Subtitle = styled.span<{ $selected: boolean }>`
  font-size: ${({ $selected }) => ($selected ? '11.5px' : '10.5px')};
  font-weight: 400;
  color: ${({ $selected }) => ($selected ? wp.textSecondary : `${wp.textPrimary}bf`)};
  line-height: 1.3;
`

const Badge = styled.span`
  flex-shrink: 0;
  padding: 3px 8px;
  background: ${wp.gold};
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${wp.onGold};
  white-space: nowrap;
`

const MinDepositHint = styled.div`
  font-size: 11.5px;
  font-weight: 400;
  color: ${wp.textSecondary};
  line-height: 16px;
`
