import { getGames } from '../../api/services/Game.api'
import { useRef, useState } from 'react'
import { IGameFilterParams, IGameSchema } from '../../types/Game.type'

interface UseGameSearchOptions {
  initialFilterParams: IGameFilterParams
  comesFromBonusMode?: boolean
}

const useGameSearch = (options: UseGameSearchOptions) => {
  const { initialFilterParams, comesFromBonusMode = false } = options

  const currentPageRef = useRef<number>(1)
  const [filterParams, setFilterParams] = useState<IGameFilterParams>(initialFilterParams)
  const [games, setGames] = useState<IGameSchema[]>([])
  const [totalResult, setTotalResult] = useState<number>(0)
  // Endless-scroll: the list endpoint no longer returns pagination totals, so we keep loading
  // while a page comes back full (>= per_page) and stop once a page returns fewer.
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [firstLoading, setFirstLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [blockedGames, setBlockedGames] = useState<string>('games.show')
  const [selectedProviders, setProviders] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('popular')

  // The two game endpoints wrap the list differently:
  //   /game/list      → { data: { games: { data: [...] } } }
  //   /game/bm_games  → Laravel paginator { data: [...] }
  // Return the list, or null when the expected container is absent (keeps the original
  // "only update on a valid payload" behaviour). Neither returns a reliable total anymore.
  const extractGames = (resp: any): IGameSchema[] | null => {
    const payload = resp?.data
    if (comesFromBonusMode) {
      return Array.isArray(payload?.data) ? payload.data : null
    }
    const gamesData = payload?.data?.games
    if (!gamesData) return null
    return Array.isArray(gamesData.data) ? gamesData.data : []
  }

  const perPageOf = (params: IGameFilterParams): number =>
    Number((params as { per_page?: string | number }).per_page) || 28

  const fetchGames = (params: IGameFilterParams, extraParams?: Record<string, string | null>) => {
    setLoading(true)
    const mergedParams = extraParams ? { ...params, ...filterNullValues(extraParams) } : params

    getGames(mergedParams, comesFromBonusMode)
      .then((resp: any) => {
        const list = extractGames(resp)
        if (list) {
          setGames(list)
          setTotalResult(list.length)
          setHasMore(list.length >= perPageOf(mergedParams))
        }
        currentPageRef.current = 1
      })
      .finally(() => {
        setLoading(false)
        if (firstLoading) {
          setFirstLoading(false)
        }
      })
  }

  const loadMoreGames = (extraParams?: Record<string, string | null>) => {
    currentPageRef.current = currentPageRef.current + 1
    setLoadMoreLoading(true)

    const mergedParams = extraParams
      ? {
          ...filterParams,
          ...filterNullValues(extraParams),
          page: currentPageRef.current,
        }
      : { ...filterParams, page: currentPageRef.current }

    getGames(mergedParams, comesFromBonusMode)
      .then((resp: any) => {
        const list = extractGames(resp)
        if (list) {
          setGames(prev => [...prev, ...list])
          setTotalResult(prev => prev + list.length)
          setHasMore(list.length >= perPageOf(mergedParams))
        }
      })
      .finally(() => {
        setLoadMoreLoading(false)
      })
  }

  const onChangeProviders = (providerId: number) => {
    if (providerId === -1) {
      setProviders([])
      setFilterParams({
        ...filterParams,
        provider: '',
      })
    } else {
      const isAlreadyInArray = selectedProviders.includes(String(providerId))
      const result = isAlreadyInArray
        ? [...selectedProviders.filter((item: string) => item !== String(providerId))]
        : [...selectedProviders, String(providerId)]

      setProviders(result)
      setFilterParams({
        ...filterParams,
        provider: result.join(','),
      })
    }
  }

  const onChangeSort = (value: string) => {
    setSortBy(value)
    setFilterParams({
      ...filterParams,
      sort: value,
    })
  }

  const onChangeBlockedGames = (value: string) => {
    setBlockedGames(value)
    const currentParams: IGameFilterParams = {
      ...filterParams,
      show_available_only: 1,
    }
    if (value === 'games.show') {
      delete currentParams.show_available_only
      setFilterParams(currentParams)
    } else {
      setFilterParams(currentParams)
    }
  }

  const onClearParams = (preserveKey?: 'category' | 'provider') => {
    if (preserveKey) {
      setFilterParams({
        ...initialFilterParams,
        [preserveKey]: filterParams[preserveKey],
      })
    } else {
      setFilterParams(initialFilterParams)
    }
    setSearchValue('')
    setBlockedGames('games.show')
    setProviders([])
    setSortBy('popular')
  }

  return {
    games,
    totalResult,
    hasMore,
    loading,
    firstLoading,
    loadMoreLoading,
    searchValue,
    setSearchValue,
    blockedGames,
    selectedProviders,
    setProviders,
    sortBy,
    filterParams,
    setFilterParams,
    fetchGames,
    loadMoreGames,
    onChangeProviders,
    onChangeSort,
    onChangeBlockedGames,
    onClearParams,
  }
}

const filterNullValues = (obj: Record<string, string | null>): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key] as string
    }
  }
  return result
}

export default useGameSearch
