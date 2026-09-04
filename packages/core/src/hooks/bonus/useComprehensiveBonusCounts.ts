import { getAllDepositBonuses } from '../../api/services/Bonus.api'
import useFetchActiveBmBonus from './useFetchActiveBmBonus'
import useFetchFreespinBonuses from './useFetchFreespinBonuses'
import useCountdownTimer from '../useCountdownTimer'
import { useAppSelector } from '../../redux/hooks'
import { useEffect, useMemo, useState } from 'react'

interface UseComprehensiveBonusCountsOptions {
  activeCashBacks?: number
  inactiveCashBacks?: number
  activeRakeBacks?: number
  inactiveRakeBacks?: number
}

const useComprehensiveBonusCounts = ({
  activeCashBacks = 0,
  inactiveCashBacks = 0,
  activeRakeBacks = 0,
  inactiveRakeBacks = 0,
}: UseComprehensiveBonusCountsOptions) => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const { data: activeBonus } = useFetchActiveBmBonus()
  const { data: freespinBonuses } = useFetchFreespinBonuses()
  const freespinCount = freespinBonuses?.length || 0
  const [depositBonuses, setDepositBonuses] = useState<any[]>([])

  useEffect(() => {
    getAllDepositBonuses()
      .then((resp: any) => {
        if (resp.data.data) {
          const player_bonuses = resp.data.data['player_bonuses'] || []
          const available_bonuses = resp.data.data['available_bonuses'] || []
          setDepositBonuses([
            ...player_bonuses.map((item: any) => ({
              ...item,
              unusedBonuses: false,
            })),
            ...available_bonuses.map((item: any) => ({
              ...item,
              unusedBonuses: true,
            })),
          ])
        }
      })
      .catch(() => {})
  }, [])

  const needsTimer = playerInfo?.player?.wheel_spins === 1
  const { isExpired } = useCountdownTimer(needsTimer ? playerInfo?.player?.can_spin_after : null)
  const isBonusWheelActive = !needsTimer || isExpired

  const activeDepositBonusesCount = useMemo(
    () =>
      depositBonuses.filter((bonus: any) => {
        return (
          bonus.is_active !== false && (!bonus.expire_at || new Date(bonus.expire_at) > new Date())
        )
      }).length,
    [depositBonuses]
  )

  const isDataLoaded = Boolean(activeBonus !== undefined && playerInfo)

  const activeWheelCount = isBonusWheelActive ? 1 : 0
  const inactiveWheelCount = !isBonusWheelActive ? 1 : 0

  const activeBonusesCount = isDataLoaded
    ? activeCashBacks +
      activeRakeBacks +
      activeWheelCount +
      (activeBonus?.data ? 1 : 0) +
      (activeDepositBonusesCount > 0 ? 1 : 0) +
      (freespinCount > 0 ? 1 : 0)
    : 0

  const inactiveBonusesCount = isDataLoaded
    ? inactiveCashBacks + inactiveRakeBacks + inactiveWheelCount + (!activeBonus?.data ? 1 : 0)
    : 0

  const totalBonusesCount = activeBonusesCount + inactiveBonusesCount

  return {
    activeBonusesCount,
    inactiveBonusesCount,
    totalBonusesCount,
    isDataLoaded,
    isBonusWheelActive,
    depositBonuses,
    activeDepositBonusesCount,
    activeBonus,
  }
}

export default useComprehensiveBonusCounts
