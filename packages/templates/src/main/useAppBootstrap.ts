import {
  connectSocket,
  disconnectSocket,
  connectChatSocket,
  disconnectChatSocket,
} from '@oribet/core/api/oribet.socket'
import { isCountryRestricted } from '@oribet/core/api/services/Country.api'
import { getFavoriteGame } from '@oribet/core/api/services/Game.api'
import { getGeneralSettings, getSystemSettings } from '@oribet/core/api/services/Setting.api'
import { changeBackendLanguage, getRanks, getUserInfo } from '@oribet/core/api/services/User.api'
import { useFetchActiveBmBonus } from '@oribet/modules/app-header'
import useGameCategories from '@oribet/core/hooks/game/useGameCategories'
import useProviders from '@oribet/core/hooks/game/useProviders'
import { changeInitFavouriteGame } from '@oribet/core/redux/slices/gameSlice'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsChatEnabled } from '@oribet/core/redux/selectors'
import { changeSettings, setSystemSettings } from '@oribet/core/redux/slices/settingsSlice'
import {
  changeAccessToken,
  changeLanguage,
  changeRanksInfo,
  changeUserAuthorization,
  changeUserInfo,
  setCountryRestricted,
} from '@oribet/core/redux/slices/userSlice'
import {
  getLocalStorageValue,
  setLocalStorageValue,
  SupportedLanguage,
  supportedLanguages,
} from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import {
  SessionConfig,
  setSessionMarker,
  hasSessionMarker,
  clearSession,
} from '@oribet/core/util/session'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IUserInfo } from '@oribet/core/types/common.type'

export interface AppBootstrapResult {
  loading: boolean
  isUserAuthorized: boolean | null
}

export const useAppBootstrap = (): AppBootstrapResult => {
  const isUserAuthorized = useAppSelector(state => state.user.isUserAuthorized)
  const isChatEnabled = useAppSelector(selectIsChatEnabled)
  const dispatch = useAppDispatch()
  useFetchActiveBmBonus()
  useGameCategories()
  useProviders()
  const [loading, setLoading] = useState<boolean>(true)
  const { i18n } = useTranslation()

  useEffect(() => {
    setLanguage()
    checkIfUserIsAuthorized()
    checkPlayerNumbersByGame()
    setRestrictedCountry()
    setSettings()
    fetchSystemSettings()
    setRanks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isUserAuthorized) {
      const token = getLocalStorageValue('token', '')
      // ORI-462: (re)mark the browser session alive so a later reload can tell tab-close
      // (marker survives) from browser-close (marker gone).
      if (SessionConfig.browserCloseLogout) setSessionMarker()
      connectSocket(token)
      setFavouriteGame()
    } else if (isUserAuthorized === false) {
      disconnectSocket()
      connectSocket()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthorized])

  // Chat socket opens only when `/settings` reports chat enabled — a disabled brand
  // never issues the chat connection request. Reacts once settings resolve.
  useEffect(() => {
    if (isChatEnabled) connectChatSocket()
    else disconnectChatSocket()
  }, [isChatEnabled])

  const setFavouriteGame = () => {
    getFavoriteGame()
      .then((reps: any) => {
        dispatch(changeInitFavouriteGame(reps.data.data))
      })
      .catch(() => {})
  }

  const setLanguage = (): void => {
    let urlLang = window.location.pathname.split('/')[1]

    if (!supportedLanguages.includes(urlLang as SupportedLanguage)) {
      urlLang = Cookies.get('language') || Defaults.defaultLanguage
    }

    if (urlLang) {
      Cookies.set('language', urlLang)
      setLocalStorageValue('language', urlLang)
      Defaults.defaultLanguage = urlLang
    } else {
      Cookies.set('language', Defaults.defaultLanguage)
      setLocalStorageValue('language', Defaults.defaultLanguage)
    }

    i18n.changeLanguage(urlLang).then(() => {
      dispatch(changeLanguage(urlLang))
    })

    // Guests push the URL/cookie language so API content is localized. Logged-in users instead
    // ADOPT their saved `player.lang` in checkIfUserIsAuthorized (backend wins), so we must not
    // overwrite it here.
    const isAuthed =
      Boolean(getLocalStorageValue('isAuthorized', false)) &&
      Boolean(getLocalStorageValue('token', ''))
    if (!isAuthed) {
      changeBackendLanguage(urlLang).catch(() => {})
    }
  }

  const setRestrictedCountry = (): void => {
    isCountryRestricted()
      .then(resp => {
        dispatch(setCountryRestricted(resp.data.data.is_restricted))
      })
      .catch(() => {
        dispatch(setCountryRestricted(false))
      })
  }

  const setRanks = () => {
    getRanks()
      .then((resp: any) => {
        if (resp.data.data) {
          dispatch(changeRanksInfo(resp.data.data))
        }
      })
      .catch(() => {})
  }

  const checkIfUserIsAuthorized = () => {
    const isAuthorized = Boolean(getLocalStorageValue('isAuthorized', false))
    const userToken = Boolean(getLocalStorageValue('token', ''))

    // ORI-462: browser-close logout. A valid-looking session in localStorage but a missing
    // session-marker cookie means the browser was fully closed (session cookies are dropped,
    // but survive tab-close). Clear the stale session and treat the user as logged out.
    if (SessionConfig.browserCloseLogout && isAuthorized && userToken && !hasSessionMarker()) {
      clearSession()
      dispatch(changeUserAuthorization(false))
      setLoading(false)
      return
    }

    const isTokenExpired = getLocalStorageValue('token_expire_at', new Date())
    const result = Boolean(isAuthorized && userToken)
    dispatch(changeUserAuthorization(result))

    if (result) {
      const token = getLocalStorageValue('token', '')

      getUserInfo()
        .then((resp: any) => {
          if (resp.data.data) {
            const data: IUserInfo = {
              access_Token: {
                token: token,
                expire_at: isTokenExpired,
              },
              player: resp.data.data,
            }
            dispatch(changeUserInfo(data))
            setLocalStorageValue('userInfo', JSON.stringify(data))

            // Backend wins: adopt the player's saved language if it differs from the current one.
            const savedLang = resp.data.data.lang as string | undefined
            const currentLang = Cookies.get('language') || Defaults.defaultLanguage
            if (
              savedLang &&
              supportedLanguages.includes(savedLang as SupportedLanguage) &&
              savedLang !== currentLang
            ) {
              Cookies.set('language', savedLang)
              setLocalStorageValue('language', savedLang)
              Defaults.defaultLanguage = savedLang
              const parts = window.location.pathname.split('/')
              if (supportedLanguages.includes(parts[1] as SupportedLanguage)) parts[1] = savedLang
              else parts.splice(1, 0, savedLang)
              // Redirect (replace, no history entry) so the URL + a fresh load match the saved lang.
              window.location.replace(parts.join('/') + window.location.search)
              return
            }
          }
        })
        .catch(() => {
          dispatch(changeUserAuthorization(false))
          dispatch(changeAccessToken({ expire_at: '', token: '' }))
          setLocalStorageValue('isAuthorized', false)
          setLocalStorageValue('token_expire_at', '')
          setLocalStorageValue('userId', '')
          setLocalStorageValue('token', '')
          setLocalStorageValue('userInfo', '')
        })
    }

    setLoading(false)
  }

  const checkPlayerNumbersByGame = () => {
    const savedDate = getLocalStorageValue('playersNumberDate', null)
    if (savedDate) {
      const currentDate = new Date()
      const oldDate = new Date(savedDate)
      const differenceInMinutes = Math.floor(
        (currentDate.getTime() - oldDate.getTime()) / (1000 * 60)
      )
      if (differenceInMinutes >= 3) {
        setLocalStorageValue('playersNumberDate', new Date())
        setLocalStorageValue('updatePlayersNumberDate', true)
      } else {
        setLocalStorageValue('updatePlayersNumberDate', false)
      }
    } else {
      setLocalStorageValue('playersNumberDate', new Date())
      setLocalStorageValue('updatePlayersNumberDate', true)
    }
  }

  const setSettings = () => {
    getGeneralSettings()
      .then((response: any) => {
        if (response && response.data.data) {
          dispatch(changeSettings(response.data.data))
        }
      })
      .catch(() => {})
  }

  const fetchSystemSettings = () => {
    getSystemSettings()
      .then((response: any) => {
        if (response?.data) {
          dispatch(setSystemSettings(response.data))
        }
      })
      .catch(() => {})
  }

  return { loading, isUserAuthorized }
}
