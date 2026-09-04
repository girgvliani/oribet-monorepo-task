import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getGameBlocks, getRecentGame } from '../../api/services/Game.api'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addGameToFavourite, removeGameFromFavourite } from '../../redux/slices/gameSlice'
import { useIsMobile } from '../useIsMobile'
import useDebouncedCallback from '../useDebounce'
import useGameSearch from '../game/useGameSearch'
import type { ICategory, IGameBlock, IGameSchema, IProvider } from '../../types/Game.type'

export type GamesCategoryKind = 'regular' | 'favourites' | 'recent' | 'block'

export interface GamesCategoryConfig {
  kind: GamesCategoryKind
  /** Category slug for `kind === 'regular'` (e.g. 'slots', 'live', 'game-show'). */
  categorySlugName?: string
  /** Block slug for `kind === 'block'`. */
  blockSlug?: string
  /** Optional logo url shown next to the page title (used by block pages). */
  headerLogoUrl?: string
  /** i18n key for the page title. */
  pageName: string
  /** When true, `pageName` is rendered as-is (skips i18n). */
  rawPageName?: boolean
  showSwitcher?: boolean
  showSearch?: boolean
  hideBlockedGameFilter?: boolean
  hideGameProviderFilter?: boolean
  hideGameSortByFilter?: boolean
  hideFooter?: boolean
  isOriginalGame?: boolean
  comesFromBonusMode?: boolean
}

export interface GamesCategoryContextValue extends GamesListData {
  config: GamesCategoryConfig
}

export const GamesCategoryContext = createContext<GamesCategoryContextValue | null>(null)

/** Reads the games-page state + config from `GamesCategoryContext`. */
export const useGamesCategory = (): GamesCategoryContextValue => {
  const ctx = useContext(GamesCategoryContext)
  if (!ctx) throw new Error('useGamesCategory must be used inside GamesCategoryContext.Provider')
  return ctx
}

export interface GamesListData {
  games: IGameSchema[]
  totalResult: number
  /** Whether another page may exist (last page came back full). Drives the "View More" button. */
  hasMore: boolean
  loading: boolean
  firstLoading: boolean
  loadMoreLoading: boolean
  searchValue: string
  selectedBlockGame: string
  selectedProviders: string[]
  selectedSortBy: string
  categorySlug: string | null
  favourite: IGameSchema[]
  onChangeSearchValue: (value: string) => void
  onChangeBlockedGames: (value: string) => void
  onChangeProviders: (providerId: number) => void
  onChangeSort: (value: string) => void
  loadMoreGames: () => void
  onClearParams: () => void
  addToFavoriteGameList: (gameId: string) => void
  removeFromFavoriteGameList: (gameId: string) => void
}

const useFavoriteActions = () => {
  const dispatch = useAppDispatch()
  return {
    addToFavoriteGameList: (gameId: string) => dispatch(addGameToFavourite(gameId)),
    removeFromFavoriteGameList: (gameId: string) => dispatch(removeGameFromFavourite(gameId)),
  }
}

/** Favourites: games come from Redux; search filters them locally. */
export const useFavouriteGamesData = (): GamesListData => {
  const favourite = useAppSelector(state => state.game.favourite)
  const { addToFavoriteGameList, removeFromFavoriteGameList } = useFavoriteActions()
  const [searchValue, setSearchValue] = useState<string>('')

  const games = useMemo(() => {
    if (searchValue.trim().length > 2) {
      return favourite.filter(g => g.game_title.toLowerCase().includes(searchValue.toLowerCase()))
    }
    return favourite
  }, [favourite, searchValue])

  return {
    games,
    totalResult: games.length,
    hasMore: false,
    loading: false,
    firstLoading: false,
    loadMoreLoading: false,
    searchValue,
    selectedBlockGame: '',
    selectedProviders: [],
    selectedSortBy: '',
    categorySlug: null,
    favourite,
    onChangeSearchValue: setSearchValue,
    onChangeBlockedGames: () => {},
    onChangeProviders: () => {},
    onChangeSort: () => {},
    loadMoreGames: () => {},
    onClearParams: () => setSearchValue(''),
    addToFavoriteGameList,
    removeFromFavoriteGameList,
  }
}

/** Recent: React Query for fetch; search filters locally. */
export const useRecentGamesData = (): GamesListData => {
  const favourite = useAppSelector(state => state.game.favourite)
  const { addToFavoriteGameList, removeFromFavoriteGameList } = useFavoriteActions()
  const [searchValue, setSearchValue] = useState<string>('')

  const {
    data: originalGames = [],
    isLoading: loading,
    isFetched,
  } = useQuery<IGameSchema[]>({
    queryKey: ['recent-games'],
    queryFn: async () => {
      const resp = await getRecentGame()
      return resp.data ?? []
    },
    staleTime: 60_000,
  })

  const games = useMemo(() => {
    if (searchValue.trim().length > 2) {
      return originalGames.filter(g =>
        g.game_title.toLowerCase().includes(searchValue.toLowerCase())
      )
    }
    return originalGames
  }, [originalGames, searchValue])

  return {
    games,
    totalResult: games.length,
    hasMore: false,
    loading,
    firstLoading: !isFetched,
    loadMoreLoading: false,
    searchValue,
    selectedBlockGame: '',
    selectedProviders: [],
    selectedSortBy: '',
    categorySlug: null,
    favourite,
    onChangeSearchValue: setSearchValue,
    onChangeBlockedGames: () => {},
    onChangeProviders: () => {},
    onChangeSort: () => {},
    loadMoreGames: () => {},
    onClearParams: () => setSearchValue(''),
    addToFavoriteGameList,
    removeFromFavoriteGameList,
  }
}

/** Block: games come straight from the cached `/game-blocks` response, sorted by position. */
export const useBlockGamesData = (config: GamesCategoryConfig): GamesListData => {
  const favourite = useAppSelector(state => state.game.favourite)
  const { addToFavoriteGameList, removeFromFavoriteGameList } = useFavoriteActions()
  const [searchValue, setSearchValue] = useState<string>('')

  const {
    data: blocks = [],
    isLoading: loading,
    isFetched,
  } = useQuery<IGameBlock[]>({
    queryKey: ['game-blocks'],
    queryFn: async () => {
      const resp = await getGameBlocks()
      return resp.data?.data ?? []
    },
    staleTime: 60_000,
  })

  const block = blocks.find(b => b.slug === config.blockSlug)
  const blockGames = useMemo(() => {
    if (!block) return []
    return [...block.games].sort(
      (a, b) =>
        ((a as { position?: number }).position ?? 0) - ((b as { position?: number }).position ?? 0)
    )
  }, [block])

  const games = useMemo(() => {
    if (searchValue.trim().length > 2) {
      return blockGames.filter(g => g.game_title.toLowerCase().includes(searchValue.toLowerCase()))
    }
    return blockGames
  }, [blockGames, searchValue])

  return {
    games,
    totalResult: games.length,
    hasMore: false,
    loading,
    firstLoading: !isFetched,
    loadMoreLoading: false,
    searchValue,
    selectedBlockGame: '',
    selectedProviders: [],
    selectedSortBy: '',
    categorySlug: null,
    favourite,
    onChangeSearchValue: setSearchValue,
    onChangeBlockedGames: () => {},
    onChangeProviders: () => {},
    onChangeSort: () => {},
    loadMoreGames: () => {},
    onClearParams: () => setSearchValue(''),
    addToFavoriteGameList,
    removeFromFavoriteGameList,
  }
}

/** Regular categories: full filter/search/sort/load-more flow with URL param sync. */
export const useRegularGamesData = (config: GamesCategoryConfig): GamesListData => {
  const { categorySlugName, isOriginalGame, comesFromBonusMode = false } = config
  const isMobile = useIsMobile()
  const categories = useAppSelector(state => state.game.categories)
  const providers = useAppSelector(state => state.game.providers)
  const favourite = useAppSelector(state => state.game.favourite)
  const { addToFavoriteGameList, removeFromFavoriteGameList } = useFavoriteActions()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchNameQuery = searchParams.get('search_name')
  const blockedQuery = searchParams.get('show_available_only')
  const providerQuery = searchParams.get('provider')
  const sortQuery = searchParams.get('sort')

  const defaultFilterParams = {
    per_page: '28',
    device: isMobile ? 'mobile' : 'desktop',
    category: 0,
    provider: '',
    sort: 'popular',
    search_name: '',
    page: 1,
  }
  const initialFilterParams = isOriginalGame
    ? { provider: '' }
    : comesFromBonusMode
      ? { ...defaultFilterParams, per_page: '32' }
      : defaultFilterParams

  const {
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
    loadMoreGames: loadMoreBase,
    onChangeBlockedGames: onChangeBlockedGamesBase,
    onClearParams: onClearParamsBase,
  } = useGameSearch({ initialFilterParams, comesFromBonusMode })

  const [categorySlug, setCategorySlug] = useState<string | null>(null)

  useEffect(() => {
    if (!isOriginalGame && !providerQuery && !comesFromBonusMode && categorySlugName) {
      const matched = categories.find((c: ICategory) => c.slug === categorySlugName)
      if (matched) {
        setCategorySlug(matched.slug)
        setFilterParams(prev => ({ ...prev, category: matched.id }))
      }
    }
  }, [categories, categorySlugName])

  useEffect(() => {
    if (isOriginalGame && !providerQuery && !comesFromBonusMode) {
      const id = providers.find(p => p.slug === 'inhouse')?.id
      if (id) setFilterParams(prev => ({ ...prev, provider: String(id) }))
    }
  }, [providers])

  useEffect(() => {
    if (!isOriginalGame && providerQuery && !comesFromBonusMode && categorySlugName) {
      if (providers && categories) {
        const cat = categories.find((c: ICategory) => c.slug === categorySlugName)
        const providerId = providers.find((p: IProvider) => p.id === Number(providerQuery))?.id
        if (cat && providerId) {
          setCategorySlug(cat.slug)
          setFilterParams(prev => ({
            ...prev,
            category: cat.id,
            provider: String(providerId),
          }))
          setProviders([String(providerId)])
        }
      }
    }
  }, [providers, categories, providerQuery, categorySlugName])

  useEffect(() => {
    if (!isOriginalGame && filterParams.category && !comesFromBonusMode) onLoadGame()
    if (!isOriginalGame && comesFromBonusMode) onLoadGame()
    if (isOriginalGame && filterParams.provider) onLoadGame()
  }, [filterParams, searchParams])

  const getSearchParamsObj = () => ({
    search_name: searchNameQuery,
    show_available_only: blockedQuery,
    provider: providerQuery,
    sort: sortQuery,
  })

  const onLoadGame = () => {
    fetchGames(filterParams, getSearchParamsObj())
  }

  const setFiltersHandler = (value: string) => {
    setFilterParams({ ...filterParams, search_name: value })
    setSearchParams(prev => {
      if (value) prev.set('search_name', value)
      else prev.delete('search_name')
      return prev
    })
  }
  const debouncedSetFilters = useDebouncedCallback(setFiltersHandler, 300)

  const onChangeSearchValue = (value: string): void => {
    setSearchValue(value)
    debouncedSetFilters(value)
  }

  const onChangeBlockedGames = (value: string): void => {
    onChangeBlockedGamesBase(value)
    setSearchParams(prev => {
      if (value === 'games.show') prev.delete('show_available_only')
      else prev.set('show_available_only', '1')
      return prev
    })
  }

  const onChangeProviders = (providerId: number): void => {
    if (providerId === -1) {
      setProviders([])
      setSearchParams(prev => {
        prev.delete('provider')
        return prev
      })
      setFilterParams({ ...filterParams, provider: '' })
      return
    }
    const isAlready = selectedProviders.includes(String(providerId))
    const result = isAlready
      ? selectedProviders.filter(item => item !== String(providerId))
      : [...selectedProviders, String(providerId)]
    setProviders(result)
    setFilterParams({ ...filterParams, provider: result.join(',') })
    setSearchParams(prev => {
      if (result.length > 0) prev.set('provider', result.join(','))
      else prev.delete('provider')
      return prev
    })
  }

  const onChangeSort = (value: string): void => {
    setFilterParams({ ...filterParams, sort: value })
    setSearchParams(prev => {
      if (value) prev.set('sort', value)
      else prev.delete('sort')
      return prev
    })
  }

  const loadMoreGames = (): void => {
    loadMoreBase(getSearchParamsObj())
  }

  return {
    games,
    totalResult,
    hasMore,
    loading,
    firstLoading,
    loadMoreLoading,
    searchValue,
    selectedBlockGame: blockedGames,
    selectedProviders,
    selectedSortBy: sortBy,
    categorySlug,
    favourite,
    onChangeSearchValue,
    onChangeBlockedGames,
    onChangeProviders,
    onChangeSort,
    loadMoreGames,
    onClearParams: () => onClearParamsBase(isOriginalGame ? 'provider' : 'category'),
    addToFavoriteGameList,
    removeFromFavoriteGameList,
  }
}
