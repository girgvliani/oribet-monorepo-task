import moment from 'moment'
import { IRakeBackOrCashBack } from '@oribet/core/types/Bonus.type'

export const CalculateBonusCountdownTime = (data: IRakeBackOrCashBack) => {
  const finishAtDate = moment(data.finish_at, 'YYYY-MM-DD HH:mm:ssZ')

  if (!finishAtDate.isValid()) {
    return 0
  }

  const now = moment()

  const difference = finishAtDate.diff(now)

  return difference > 0 ? difference : 0
}

export const GetBonusConvertedTime = (countdown: number) => {
  const totalSeconds = Math.floor(countdown / 1000)
  const days = Math.floor(totalSeconds / (24 * 3600))
  const remainingSecondsAfterDays = totalSeconds % (24 * 3600)
  const hours = Math.floor(remainingSecondsAfterDays / 3600)
  const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
  const seconds = remainingSecondsAfterHours % 60

  return `${days.toString().padStart(2, '0')}:${hours
    .toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export const getCashbackNameBySlug = (slug: string) => {
  if (slug === 'daily') {
    return 'bonus.dailyCashback'
  }

  if (slug === 'weekly') {
    return 'bonus.weeklyCashback'
  }

  if (slug === 'monthly') {
    return 'bonus.monthlyCashback'
  }

  return ''
}

export const getRakebackNameBySlug = (slug: string) => {
  if (slug === 'daily') {
    return 'bonus.dailyRakeback'
  }

  if (slug === 'weekly') {
    return 'bonus.weeklyRakeback'
  }

  if (slug === 'monthly') {
    return 'bonus.monthlyRakeback'
  }

  return ''
}
