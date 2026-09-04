import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { useBonusesPageData } from '@oribet/core/hooks/bonus/useBonusesPageData'
import DepositBonusItem from './DepositBonusItem'

/**
 * Deposit-bonus section — splits player's existing bonuses (active first, with mid-wager
 * sorted to the top) from available offers. Hidden entirely when both lists are empty.
 */
const BonusesDepositBonusesModule = () => {
  const { t } = useTranslation()
  const { playerBonuses, availableDepositBonuses, refetchDepositBonuses } = useBonusesPageData()

  const activeBonuses = useMemo(
    () =>
      playerBonuses
        .filter((b: any) => b.is_active !== false && !b.is_transfered)
        .sort((a: any, b: any) => {
          const aWagering =
            Number(a.wagered_amount) > 0 && Number(a.wagered_amount) < Number(a.wager_amount)
          const bWagering =
            Number(b.wagered_amount) > 0 && Number(b.wagered_amount) < Number(b.wager_amount)
          return aWagering === bWagering ? 0 : aWagering ? -1 : 1
        }),
    [playerBonuses],
  )

  if (activeBonuses.length === 0 && availableDepositBonuses.length === 0) return null

  return (
    <Wrapper>
      <Heading>{t('bonus.cashUnlockBonuses')}</Heading>
      {activeBonuses.length > 0 && (
        <>
          <ColumnHeader>{t('bonus.activeBonuses')}</ColumnHeader>
          <Grid>
            {activeBonuses.map((bonus: any, index: number) => (
              <DepositBonusItem
                depositBonus={bonus}
                key={index}
                initGetAllDepositBonus={refetchDepositBonuses}
              />
            ))}
          </Grid>
        </>
      )}
      {availableDepositBonuses.length > 0 && (
        <>
          <ColumnHeader>{t('bonus.availableBonuses')}</ColumnHeader>
          <Grid>
            {availableDepositBonuses.map((bonus: any, index: number) => (
              <DepositBonusItem
                depositBonus={bonus}
                key={index}
                isAvailable
                initGetAllDepositBonus={refetchDepositBonuses}
              />
            ))}
          </Grid>
        </>
      )}
    </Wrapper>
  )
}

export default BonusesDepositBonusesModule

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Heading = styled.span`
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 16px;
`

const ColumnHeader = styled.span`
  margin-left: 16px;
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(385px, 1fr));
  gap: 16px;
`
