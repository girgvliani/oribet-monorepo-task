import { getCashBacks } from '@oribet/core/api/services/Bonus.api'
import { CalculateBonusCountdownTime } from '@oribet/core/util/BonusHelper'
import { useQuery } from '@tanstack/react-query'
import { IRakeBackOrCashBack } from '@oribet/core/types/Bonus.type'

const SLUG_ORDER: Record<string, number> = { daily: 0, weekly: 1, monthly: 2 }

const useFetchCashBacks = () => {
  return useQuery({
    queryKey: ['cashback'],
    queryFn: getCashBacks,
    select(data) {
      let activeCashBacks = 0
      let inactiveCashBacks = 0
      const totalCashBacks = data.data.length
      const _data: IRakeBackOrCashBack[] = data.data
        .map((c: IRakeBackOrCashBack) => {
          if (CalculateBonusCountdownTime(c) == 0) {
            c.isInActiveState = true
            activeCashBacks++
          } else {
            c.isInActiveState = false
            inactiveCashBacks++
          }
          return c
        })
        .sort((a: IRakeBackOrCashBack, b: IRakeBackOrCashBack) => (SLUG_ORDER[a.slug] ?? 99) - (SLUG_ORDER[b.slug] ?? 99))

      return { _data, activeCashBacks, inactiveCashBacks, totalCashBacks }
    },
  })
}

export default useFetchCashBacks
