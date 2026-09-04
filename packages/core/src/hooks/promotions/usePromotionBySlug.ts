import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPromotionBySlug } from '../../api/services/Promotion.api'
import { AppRoutePath } from '../../util/appRoutePath'
import useCountdownTimer from '../useCountdownTimer'
import type { IPromotionDataType } from '../../types/Promotion.type'

interface DateInfo {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Fetches one promotion by `:slug` and wires its countdown. React Query keeps a single cached
 * entry per slug, so sibling modules consuming this hook share one network call. Redirects to
 * the promotions list if the slug resolves to no data.
 */
export const usePromotionBySlug = () => {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const { data: promotion = null, isLoading } = useQuery<IPromotionDataType | null>({
    queryKey: ['promotion', slug],
    queryFn: async () => {
      const resp: any = await getPromotionBySlug(slug as string)
      const data = resp?.data?.data
      if (!data) {
        navigate(AppRoutePath.PROMOTION())
        return null
      }
      return data as IPromotionDataType
    },
    enabled: !!slug,
  })

  const targetDate = useMemo(() => {
    if (!promotion) return null
    if (new Date(promotion.start_date) > new Date()) return promotion.start_date
    if (new Date(promotion.end_date) > new Date()) return promotion.end_date
    return null
  }, [promotion])

  const { days, hours, minutes, seconds, isRunning } = useCountdownTimer(targetDate)
  const dateInfo: DateInfo | null = isRunning ? { days, hours, minutes, seconds } : null

  return { promotion, loading: isLoading, dateInfo }
}
