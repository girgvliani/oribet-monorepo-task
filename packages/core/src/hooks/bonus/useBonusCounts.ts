import { useMemo } from 'react'

interface UseBonusCountsOptions {
  activeCashBacks?: number
  inactiveCashBacks?: number
  totalCashBacks?: number
  activeRakeBacks?: number
  inactiveRakeBacks?: number
  totalRakeBacks?: number
}

const useBonusCounts = ({
  activeCashBacks = 0,
  inactiveCashBacks = 0,
  totalCashBacks = 0,
  activeRakeBacks = 0,
  inactiveRakeBacks = 0,
  totalRakeBacks = 0,
}: UseBonusCountsOptions) => {
  return useMemo(() => {
    const activeBonusesCount = activeCashBacks + activeRakeBacks

    const inactiveBonusesCount = inactiveCashBacks + inactiveRakeBacks

    const totalBonusesCount = totalCashBacks + totalRakeBacks

    return {
      activeBonusesCount,
      inactiveBonusesCount,
      totalBonusesCount,
    }
  }, [
    activeCashBacks,
    inactiveCashBacks,
    totalCashBacks,
    activeRakeBacks,
    inactiveRakeBacks,
    totalRakeBacks,
  ])
}

export default useBonusCounts
