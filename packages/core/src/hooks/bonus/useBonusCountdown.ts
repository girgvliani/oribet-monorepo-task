import { CalculateBonusCountdownTime, GetBonusConvertedTime } from '../../util/BonusHelper'
import { useEffect, useState } from 'react'
import { IRakeBackOrCashBack } from '../../types/Bonus.type'

const useBonusCountdown = (bonusInfo: IRakeBackOrCashBack) => {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    setCountdown(CalculateBonusCountdownTime(bonusInfo))
  }, [bonusInfo])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1000)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return {
    countdown,
    isReady: countdown <= 0,
    formattedTime: GetBonusConvertedTime(countdown),
  }
}

export default useBonusCountdown
