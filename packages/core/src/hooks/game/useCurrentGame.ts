import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  getDemoGameUrl,
  getGameInfoBySlug,
  getRealGameUrl,
} from '../../api/services/Game.api'
import { socket } from '../../api/oribet.socket'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addGameToFavourite, removeGameFromFavourite } from '../../redux/slices/gameSlice'
import { useIsMobile } from '../useIsMobile'
import { useReadyToClaimBonusesOnMount } from '../bonus/useReadyToClaimBonusesOnMount'
import type { IGameSchema } from '../../types/Game.type'
import type { IUserInfo } from '../../types/common.type'

const ERROR_LOADING_GAME = 'Error while loading game'

export interface CurrentGameContextValue {
  slug: string | undefined
  comesFromBonusMode: boolean
  isUserAuthenticated: boolean
  playerInfo: IUserInfo
  gameInfo: IGameSchema | null
  gameType: string | null
  setGameType: (value: string | null) => void
  gameUrl: string | undefined
  demoGameUrl: string | undefined
  loading: boolean
  gameCantOpen: boolean
  isUrlLoaded: boolean
  isFavourite: boolean
  addToFavoriteGameList: (gameId: string) => void
  removeFromFavoriteGameList: (gameId: string) => void
  openErrorToast: () => void
  openRestrictedModal: boolean
  setOpenRestrictedModal: (open: boolean) => void
  openFreespinFailedModal: boolean
  setOpenFreespinFailedModal: (open: boolean) => void
}

export const CurrentGameContext = createContext<CurrentGameContextValue | null>(null)

/**
 * Owns the play-game state machine: resolves the game by `:slug`, fetches real/demo URLs
 * based on auth + bonus mode, listens for the `freespinCreationFailed` socket, and exposes
 * favorite + game-mode toggles. Auto-opens the `bonusReadyToClaimModal` on mount when in
 * bonus mode.
 *
 * Call this **once** inside the page Container — modules read the same value via
 * `useCurrentGame()` (consumer of `CurrentGameContext`). Calling this directly from a
 * module would spin up duplicate fetches, sockets, and modal state.
 */
export const useCurrentGameState = (): CurrentGameContextValue => {
  const { slug } = useParams<{ slug?: string }>()
  const location = useLocation()
  const comesFromBonusMode = location.pathname.includes('/bonusgames/')
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const isUserAuthenticated = useAppSelector(state => !!state.user.isUserAuthorized)
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const favourite = useAppSelector(state => state.game.favourite)

  const [gameType, setGameType] = useState<string | null>(null)
  const [gameInfo, setGameInfo] = useState<IGameSchema | null>(null)
  const [gameUrl, setGameUrl] = useState<string | undefined>()
  const [demoGameUrl, setDemoGameUrl] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [openRestrictedModal, setOpenRestrictedModal] = useState(false)
  const [openFreespinFailedModal, setOpenFreespinFailedModal] = useState(false)
  const [gameCantOpen, setGameCantOpen] = useState(false)
  const [isUrlLoaded, setIsUrlLoaded] = useState<boolean>(false)

  useReadyToClaimBonusesOnMount(comesFromBonusMode)

  useEffect(() => {
    const handleFreespinFailed = () => setOpenFreespinFailedModal(true)
    socket.on('freespinCreationFailed', handleFreespinFailed)
    return () => {
      socket.off('freespinCreationFailed', handleFreespinFailed)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 300)
    if (slug) {
      setLoading(true)
      getGameInfoBySlug(slug)
        .then(resp => {
          if (resp.data.data) setGameInfo(resp.data.data)
        })
        .catch(() => setLoading(false))
    }
  }, [slug])

  useEffect(() => {
    if (isUserAuthenticated) {
      setGameType('real')
    } else {
      setGameType(null)
      setLoading(false)
    }
  }, [isUserAuthenticated])

  useEffect(() => {
    if (gameType !== null && gameInfo !== null) {
      setLoading(true)
      if (comesFromBonusMode) {
        loadRealGameUrl(gameInfo.game_id, true)
      } else if (gameType === 'real') {
        loadRealGameUrl(gameInfo.game_id)
      } else {
        loadDemoGameUrl(gameInfo.game_id)
      }
    }
    if (gameInfo !== null && gameInfo.is_restricted) {
      setOpenRestrictedModal(true)
    }
  }, [gameType, gameInfo])

  useEffect(() => {
    if (isMobile && gameInfo !== null) {
      loadDemoGameUrl(gameInfo.game_id, true)
    }
  }, [gameInfo])

  const loadDemoGameUrl = (gameId: string, checkIfDemoGameExist?: boolean) => {
    getDemoGameUrl(gameId)
      .then(resp => {
        if (!resp.data.data.is_restricted) setDemoGameUrl(resp.data.data.url)
        if (gameCantOpen) setGameCantOpen(false)
      })
      .catch(() => {
        setGameCantOpen(true)
        if (!checkIfDemoGameExist) {
          enqueueSnackbar(ERROR_LOADING_GAME, { variant: 'error' })
        }
      })
      .finally(() => setLoading(false))
  }

  const loadRealGameUrl = (gameId: string, is_play_bm?: boolean) => {
    getRealGameUrl(gameId, is_play_bm)
      .then(resp => {
        if (!resp.data.data.is_restricted) {
          setGameUrl(resp.data.data.url)
          setIsUrlLoaded(true)
        }
        if (gameCantOpen) setGameCantOpen(false)
      })
      .catch((err: any) => {
        setGameCantOpen(true)
        enqueueSnackbar(err?.response?.data?.data?.message || 'Error', { variant: 'error' })
      })
      .finally(() => setLoading(false))
  }

  const isFavourite = Boolean(
    favourite && gameInfo && favourite.find((item: IGameSchema) => item.id === gameInfo.id),
  )

  const addToFavoriteGameList = (gameId: string) => {
    dispatch(addGameToFavourite(gameId))
  }
  const removeFromFavoriteGameList = (gameId: string) => {
    dispatch(removeGameFromFavourite(gameId))
  }

  const openErrorToast = () => {
    enqueueSnackbar(ERROR_LOADING_GAME, { variant: 'error' })
  }

  return {
    slug,
    comesFromBonusMode,
    isUserAuthenticated,
    playerInfo,
    gameInfo,
    gameType,
    setGameType,
    gameUrl,
    demoGameUrl,
    loading,
    gameCantOpen,
    isUrlLoaded,
    isFavourite,
    addToFavoriteGameList,
    removeFromFavoriteGameList,
    openErrorToast,
    openRestrictedModal,
    setOpenRestrictedModal,
    openFreespinFailedModal,
    setOpenFreespinFailedModal,
  }
}

/**
 * Read the play-game state from `CurrentGameContext`. The Provider lives in the template
 * Container; modules call this hook and never instantiate the state directly.
 */
export const useCurrentGame = (): CurrentGameContextValue => {
  const ctx = useContext(CurrentGameContext)
  if (!ctx) throw new Error('useCurrentGame must be used inside CurrentGameContext.Provider')
  return ctx
}
