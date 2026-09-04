import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { enqueueSnackbar } from 'notistack'
import { fetchAllBmBonus } from '../../api/services/BmBonus.api'
import { useAppSelector } from '../../redux/hooks'
import type { IBMBonusMoney, IBMBonusMoneyResolved } from '../../types/BonusMoney.type'

/**
 * Marketplace bonus-money list. Fetches all BM bonuses, filters down to active ones with
 * `take_on === 'marketplace'` and a non-zero buy amount in the current user's currency
 * (inactive bonuses are excluded so they never render as a card). Returns the resolved
 * (currency-flattened) list ordered by amount.
 */
export const useMarketplaceBonuses = () => {
  const userCurrency = useAppSelector(
    state => state.user?.playerInfo?.player?.currency,
  ) as string | undefined

  const { data: allBonuses = [], isLoading: loading } = useQuery<IBMBonusMoney[]>({
    queryKey: ['marketplace', 'bonuses'],
    queryFn: async () => {
      try {
        return await fetchAllBmBonus()
      } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.data?.message ?? 'Failed to load bonuses', {
          variant: 'error',
          autoHideDuration: 3000,
        })
        throw err
      }
    },
  })

  const bonuses = useMemo<IBMBonusMoneyResolved[]>(() => {
    if (!userCurrency) return []
    return allBonuses
      .filter(bonus => {
        if (!bonus.is_active) return false
        if (bonus.take_on !== 'marketplace') return false
        const currencyData = bonus.currency_config?.[userCurrency]
        if (!currencyData) return false
        if (Number(currencyData.buy_bonus_amount) === 0) return false
        return true
      })
      .map((bonus): IBMBonusMoneyResolved => {
        const cc = bonus.currency_config![userCurrency]
        return {
          ...bonus,
          amount: cc.amount,
          max_bet: cc.max_bet,
          min_bet: cc.min_bet,
          min_deposit: cc.min_deposit,
          buy_bonus_amount: cc.buy_bonus_amount,
        }
      })
      .sort((a, b) => Number(a.amount) - Number(b.amount))
  }, [allBonuses, userCurrency])

  return { bonuses, loading }
}
