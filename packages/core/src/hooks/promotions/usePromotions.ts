import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPromotionList } from '../../api/services/Promotion.api'
import type { IPromotionDataType } from '../../types/Promotion.type'

export type PromotionType = 'all' | 'inprogress' | 'upcoming' | 'archived'

export const PROMOTIONS_ROWS_PER_PAGE = 10

export interface PromotionsContextValue {
  selectedType: PromotionType
  setSelectedType: (type: PromotionType) => void
  activePage: number
  setActivePage: (page: number) => void
}

export const PromotionsContext = createContext<PromotionsContextValue | null>(null)

const filterByType = (list: IPromotionDataType[], type: PromotionType) => {
  switch (type) {
    case 'inprogress':
      return list.filter(
        p => new Date() > new Date(p.start_date) && new Date() < new Date(p.end_date),
      )
    case 'upcoming':
      return list.filter(p => new Date() < new Date(p.start_date))
    case 'archived':
      return list.filter(p => new Date() > new Date(p.end_date))
    default:
      return list
  }
}

/**
 * Shared hook for every promotions-page module. React Query caches the list fetch; the
 * filter/pagination state lives in `PromotionsContext` (provided by `PromotionsProvider`),
 * so all consumers see the same view.
 */
export const usePromotions = () => {
  const ctx = useContext(PromotionsContext)
  if (!ctx) throw new Error('usePromotions must be used inside PromotionsProvider')
  const { selectedType, setSelectedType, activePage, setActivePage } = ctx

  const { data: originalPromotions = [], isLoading: loading } = useQuery<IPromotionDataType[]>({
    queryKey: ['promotions', 'list'],
    queryFn: async () => {
      const resp: any = await getPromotionList()
      const data: IPromotionDataType[] = resp?.data?.data ?? []
      return [...data].sort((a, b) => b.id - a.id)
    },
  })

  const promotions = useMemo(
    () => filterByType(originalPromotions, selectedType),
    [originalPromotions, selectedType],
  )

  return { promotions, loading, selectedType, setSelectedType, activePage, setActivePage }
}
