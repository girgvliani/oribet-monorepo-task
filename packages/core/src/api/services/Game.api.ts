import instance from '../axios'
import { isMobile } from 'react-device-detect'
import { getUserLanguage } from '../../util/appUtil'

export const getGameCategories = () => {
  return instance.get('/categories')
}

export const getProviders = () => {
  return instance.get('/providers')
}

export const getGames = (params: any, comesFromBonusMode?: boolean) => {
  if (comesFromBonusMode) {
    return instance.get(`/game/bm_games?${new URLSearchParams(params).toString()}`)
  } else {
    return instance.get(`/game/list?${new URLSearchParams(params).toString()}`)
  }
}

export const getRecentGame = () => {
  return instance.get(`/last_games_played`)
}

export const getFavoriteGame = () => {
  return instance.get(`/game/favourite/list`)
}

export const addGameToFavourites = (id: number) => {
  return instance.post(`/game/favourite/add`, {
    id,
  })
}

export const removeGameFromFavourites = (id: number) => {
  return instance.post(`/game/favourite/remove`, {
    id,
  })
}

export const getGameInfoBySlug = (slug: string) => {
  return instance.get(`/game/by_slug/${slug} `)
}

export const getDemoGameUrl = (gameId: string) => {
  return instance.get(`/game/generate_demo_url/${gameId}`)
}

export const getRealGameUrl = (gameId: string, is_play_bm?: boolean) => {
  if (is_play_bm) {
    const device = isMobile ? 'mobile' : 'desktop'
    const lang = localStorage.getItem('language') || 'en'
    const country = JSON.parse(localStorage.getItem('userInfo') || '{}').player?.country || ''

    return instance.get(
      `/game/generate_url/${gameId}?is_play_bm=true&device=${device}&lang=${lang}&country=${country}`
    )
  } else {
    return instance.get(`/game/generate_url/${gameId}`)
  }
}

export const getTrendingGames = () => {
  return instance.get(`/game/trending?device=${isMobile ? 'mobile' : 'desktop'}`)
}

export const getRecommendedGames = () => {
  return instance.get(`/game/recommended`)
}

export const getLuckyWins = () => {
  return instance.get('/last_winnings_100x')
}

export const getGameBlocks = () => {
  const params = new URLSearchParams({
    device: isMobile ? 'mobile' : 'desktop',
    lang: getUserLanguage(),
    show_in_lobby: 'null',
    show_in_casino: 'null',
    show_in_game: 'null',
    show_in_sidebar: 'null',
  })
  return instance.get(`/game-blocks?${params.toString()}`)
}
