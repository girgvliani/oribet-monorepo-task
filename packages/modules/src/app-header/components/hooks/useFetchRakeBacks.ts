import { getRakeBacks } from '@oribet/core/api/services/Bonus.api'
import { CalculateBonusCountdownTime } from '@oribet/core/util/BonusHelper'
import { useQuery } from '@tanstack/react-query'
import { IRakeBackOrCashBack } from '@oribet/core/types/Bonus.type'

const SLUG_ORDER: Record<string, number> = { daily: 0, weekly: 1, monthly: 2 }

const useFetchRakeBacks = () => {
  return useQuery({
    queryKey: ['rakeback'],
    queryFn: getRakeBacks,
    gcTime: Infinity,
    staleTime: Infinity,
    select(data) {
      let activeRakeBacks = 0
      let inactiveRakeBacks = 0
      const totalRakeBacks = data.data.length
      const _data: IRakeBackOrCashBack[] = data.data
        .map((r: IRakeBackOrCashBack) => {
          if (CalculateBonusCountdownTime(r) == 0) {
            activeRakeBacks++
            r.isInActiveState = true
          } else {
            inactiveRakeBacks++
            r.isInActiveState = false
          }
          return r as IRakeBackOrCashBack
        })
        .sort((a: IRakeBackOrCashBack, b: IRakeBackOrCashBack) => (SLUG_ORDER[a.slug] ?? 99) - (SLUG_ORDER[b.slug] ?? 99))
      return { _data, activeRakeBacks, inactiveRakeBacks, totalRakeBacks }
    },
  })
}

export default useFetchRakeBacks
