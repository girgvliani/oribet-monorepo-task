import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGameBlocks, getGames } from '../../api/services/Game.api'
import { useIsMobile } from '../useIsMobile'
import { useAppSelector } from '../../redux/hooks'
import useDebouncedCallback from '../useDebounce'
import type { ICategory, IGameBlock, IGameSchema } from '../../types/Game.type'

export type CasinoActiveKind = 'all' | 'category' | 'block'

export interface UseCasinoFilteredGamesInput {
  activeKind: CasinoActiveKind
  activeSlug: string
  selectedProviderIds: string[]
  searchValue: string
}

export interface UseCasinoFilteredGamesResult {
  games: IGameSchema[]
  loading: boolean
  firstLoading: boolean
  totalResult: number
  /** Whether another page may exist (last page came back full). Drives the "View More" button. */
  hasMore: boolean
  loadMore: () => void
}

const PER_PAGE = 28

/**
 * Casino-page games fetch. In-memory only — does not read or write URL params.
 * Handles three filter kinds:
 *
 *   - `all`     → /game/list with category=0, server-side search/provider filter, pagination.
 *   - `category`→ /game/list with category resolved from `state.game.categories[slug].id`.
 *   - `block`   → /game-blocks, find by slug, client-side title + provider filter (blocks ship
 *                  pre-grouped game lists, so both are applied in memory).
 */
const useCasinoFilteredGames = ({
  activeKind,
  activeSlug,
  selectedProviderIds,
  searchValue,
}: UseCasinoFilteredGamesInput): UseCasinoFilteredGamesResult => {
  const isMobile = useIsMobile()
  const categories = useAppSelector(state => state.game.categories) as ICategory[]

  // Debounce the search input so the user gets a chance to finish typing.
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue)
  const applyDebounced = useDebouncedCallback((v: string) => setDebouncedSearch(v), 300)
  useEffect(() => {
    applyDebounced(searchValue)
  }, [searchValue, applyDebounced])

  const categoryId = useMemo(() => {
    if (activeKind !== 'category') return 0
    const match = categories.find(c => c.slug === activeSlug)
    return match?.id ?? 0
  }, [activeKind, activeSlug, categories])

  const providersParam = selectedProviderIds.join(',')

  // Server-driven path (kind = 'all' | 'category').
  const [page, setPage] = useState(1)
  // Highest page already merged into `accumulated` — guards against re-appending the same page
  // (placeholderData serves the previous page while the next loads).
  const appendedPageRef = useRef(0)
  // Reset pagination when filters change.
  useEffect(() => {
    setPage(1)
    appendedPageRef.current = 0
  }, [activeKind, activeSlug, providersParam, debouncedSearch])

  const serverEnabled = activeKind !== 'block'

  type GamesPayload = { games: IGameSchema[] }
  const serverQuery = useQuery<GamesPayload>({
    queryKey: [
      'casino-filtered-games',
      activeKind,
      activeSlug,
      categoryId,
      providersParam,
      debouncedSearch,
      isMobile ? 'mobile' : 'desktop',
      page,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        per_page: String(PER_PAGE),
        device: isMobile ? 'mobile' : 'desktop',
        sort: 'popular',
        category: categoryId,
        page,
      }
      if (providersParam) params.provider = providersParam
      if (debouncedSearch.trim()) params.search_name = debouncedSearch.trim()
      const resp: any = await getGames(params)
      const data = resp?.data?.data?.games
      return {
        games: Array.isArray(data?.data) ? data.data : [],
      }
    },
    enabled: serverEnabled,
    placeholderData: prev => prev,
    staleTime: 30_000,
  })

  // Block path (kind = 'block').
  const blockEnabled = activeKind === 'block'
  const blocksQuery = useQuery<IGameBlock[]>({
    queryKey: ['game-blocks'],
    queryFn: async () => {
      const resp: any = await getGameBlocks()
      return resp?.data?.data ?? []
    },
    enabled: blockEnabled,
    staleTime: 60_000,
  })

  const blockGames = useMemo(() => {
    if (!blockEnabled) return []
    const block = blocksQuery.data?.find(b => b.slug === activeSlug)
    let games = block?.games ?? []
    if (selectedProviderIds.length) {
      const wanted = new Set(selectedProviderIds.map(String))
      games = games.filter(g => wanted.has(String((g as { provider_id?: number }).provider_id)))
    }
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return games
    return games.filter(g => g.game_title.toLowerCase().includes(query))
  }, [blockEnabled, blocksQuery.data, activeSlug, debouncedSearch, providersParam])

  // Accumulate paginated server results. Only merge data that has freshly settled for a page we
  // haven't merged yet: placeholderData keeps the previous page in `data` while the next loads, so
  // merging on every `data`/`page` change would re-append the old page (page1 + page1 + page2).
  const [accumulated, setAccumulated] = useState<IGameSchema[]>([])
  useEffect(() => {
    if (!serverEnabled) return
    if (serverQuery.isPlaceholderData || serverQuery.isFetching) return
    const next = serverQuery.data?.games ?? []
    if (page === 1) {
      setAccumulated(next)
      appendedPageRef.current = 1
    } else if (page > appendedPageRef.current) {
      setAccumulated(prev => [...prev, ...next])
      appendedPageRef.current = page
    }
  }, [serverQuery.data, serverQuery.isPlaceholderData, serverQuery.isFetching, page, serverEnabled])

  if (blockEnabled) {
    return {
      games: blockGames,
      loading: blocksQuery.isFetching,
      firstLoading: blocksQuery.isLoading,
      totalResult: blockGames.length,
      hasMore: false,
      loadMore: () => {},
    }
  }

  // Endless-scroll: keep loading while the latest page came back full (>= PER_PAGE).
  const hasMore = (serverQuery.data?.games.length ?? 0) >= PER_PAGE

  return {
    games: accumulated,
    loading: serverQuery.isFetching,
    firstLoading: serverQuery.isLoading,
    totalResult: accumulated.length,
    hasMore,
    loadMore: () => {
      if (serverQuery.isFetching) return
      if (!hasMore) return
      setPage(p => p + 1)
    },
  }
}

export default useCasinoFilteredGames
