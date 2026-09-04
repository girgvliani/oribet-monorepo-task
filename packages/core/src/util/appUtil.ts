import { Defaults } from './defaults'
import { IPlayBonusMoney } from '../types/BonusMode.type'

export const CheckEmailValidation = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocalStorageValue = (key: string, defaultValue: any): any => {
  const currValue = window.localStorage.getItem(key)
  return currValue !== null && currValue !== undefined ? currValue : defaultValue
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorageValue = (key: string, value: any) => {
  if (key) {
    window.localStorage.setItem(key, value)
  }
}

export const getCookieValue = (key: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${key.replace(/([.$?*|{}()[\]\\+^])/g, '\\$1')}=([^;]*)`)
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export const CurrenciesNameWithMemo: string[] = ['BNB', 'XRP']

export const getUserLanguage = () => {
  return getLocalStorageValue('language', Defaults.defaultLanguage)
}

/**
 * A user-facing string from the API that may arrive either as a plain string or as a
 * per-language map, e.g. `"Newcomer"` or `{ en: "Newcomer", ko: "신입" }`.
 */
export type LocalizedString = string | number | Record<string, unknown> | null | undefined

/**
 * Read a (possibly localized) backend string. Plain strings/numbers pass through;
 * per-language maps resolve to the active language, falling back to English, then the
 * first available value. Never throws — returns '' for empty/unusable input. Mirrors
 * `resolveImageUrl`'s language resolution (active lang via `getUserLanguage`).
 */
export const getLocalizedString = (value: LocalizedString, fallbackLang = 'en'): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const map = value as Record<string, unknown>
    const lang = (getUserLanguage() || fallbackLang).toLowerCase()
    const picked = map[lang] ?? map[fallbackLang] ?? Object.values(map)[0]
    if (picked === null || picked === undefined) return ''
    return typeof picked === 'string' ? picked : String(picked)
  }
  return String(value)
}

/**
 * Resolve a (possibly localized) value preferring a fixed language (default English),
 * ignoring the active language. Use when matching a backend string against a value
 * keyed by a stable language — e.g. theme rank art keyed by the English rank name —
 * so the lookup still works in non-English sessions. Plain strings pass through.
 */
export const getCanonicalString = (value: LocalizedString, lang = 'en'): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const map = value as Record<string, unknown>
    const picked = map[lang] ?? Object.values(map)[0]
    return picked === null || picked === undefined ? '' : String(picked)
  }
  return String(value)
}

export const SettingsKeys = {
  chatMinimumWagerKey: 'chat_min_wager_amount',
  chatEnable: 'chat_is_enabled',
  chatEmailVerification: 'chat_is_allow_email_not_virified',
  KYCIsConfirmed: 'withdraw_player_with_kyc',
  KYCIsNotConfirmed: 'withdraw_player_with_out_kyc',
  coinspaid_transaction_status: 'coinspaid_transaction_status',
  interkassa_transaction_status: 'interkassa_transaction_status',
  fiat_transaction_status: 'fiat_transaction_status',
}

export const scrollToTop = () => {
  const element = document.getElementById('oribet-body')
  if (element) {
    element.scrollTop = 0
  }
}

export const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256)
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)

  return '#' + red.toString(16) + green.toString(16) + blue.toString(16)
}

export const updateGamePlayerNumber = (gameId: string, players: number) => {
  try {
    let games = getLocalStorageValue('gamePlayersNumbers', null)
    games = games ? JSON.parse(games) : null

    if (!games) {
      setLocalStorageValue('gamePlayersNumbers', JSON.stringify([{ [gameId]: players }]))
      return players
    } else {
      const updatePlayersNumberDate = getLocalStorageValue('updatePlayersNumberDate', false)
      const findGame = games.find((item: Record<string, number>) => item[gameId])

      if (updatePlayersNumberDate === 'true' && findGame) {
        games[gameId] = players
        setLocalStorageValue('gamePlayersNumbers', JSON.stringify([...games]))
        return players
      } else {
        if (!findGame) {
          setLocalStorageValue(
            'gamePlayersNumbers',
            JSON.stringify([...games, { [gameId]: players }])
          )
          return players
        } else {
          return findGame[gameId]
        }
      }
    }
  } catch (error) {
    /* empty */
  }
}

export const registrationGoogleManagerHelper = (id: string, country: string, type: string) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'user-registration',
    id,
    country,
    type,
  })
}

export const firstDepositGoogleManagerHelper = (id: string, country: string, amount: number) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'first-deposit',
    id,
    country,
    amount,
  })
}

export const generalDepositGoogleManagerHelper = (id: string, country: string, amount: number) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'general-deposit',
    id,
    country,
    amount,
  })
}

// Bootstrap-time list of language ISO codes the app knows how to load translations for.
// The user-facing language switcher comes from `useAvailableLanguages()` which reads
// `systemSettings.available_languages` returned by `/settings/system`.
export const supportedLanguages = ['en', 'ko'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const getLanguage = (): SupportedLanguage[] => {
  return [...supportedLanguages]
}

export const getLanguageLocales = (): Record<SupportedLanguage, string> => {
  const locales: Record<SupportedLanguage, string> = {
    en: 'en-US',
    ko: 'ko-KR',
  }

  supportedLanguages.forEach(lang => {
    if (!locales[lang]) {
      throw new Error(`Locale for language '${lang}' is missing.`)
    }
  })

  return locales
}

export const getBonusProgress = (activeBonusData: IPlayBonusMoney | null | undefined): number => {
  if (!activeBonusData) return 0.0

  if (activeBonusData.is_wagered) return 100.0

  const wageredAmount = Number(activeBonusData.wagered_amount)
  const wagerAmount = Number(activeBonusData.wager_amount)

  if (wagerAmount === 0) return 0.0

  const progress = (wageredAmount / wagerAmount) * 100

  return Number(progress.toFixed(2))
}

export const getWagerMultiplier = (activeBonusData: IPlayBonusMoney | null | undefined): number => {
  if (!activeBonusData) return 0
  if (Number(activeBonusData.wager_amount) === 0) return 0

  return Math.round(Number(activeBonusData.wager_amount) / Number(activeBonusData.init_amount))
}

export const formatAmount = (
  input: string | number | null | undefined,
  decimals: number = 2
): string => {
  const raw = String(input ?? '').trim()

  const validPattern = /^-?\d+(\.\d+)?$/
  if (!validPattern.test(raw)) return '0'

  const [intPart, decPart = ''] = raw.split('.')
  const trimmedDec = decPart.slice(0, decimals).replace(/0+$/, '')

  return trimmedDec ? `${intPart}.${trimmedDec}` : intPart
}

/**
 * Financial display format: thousands grouped with commas and a `.` decimal separator
 * (e.g. `1,234,567.89`, `46,250.00`). Defaults to exactly 2 fraction digits so every
 * amount reads as money; pass a wider `maximumFractionDigits` for crypto precision.
 * Non-numeric / nullish input formats as zero.
 */
export const formatMoney = (
  input: string | number | null | undefined,
  {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string => {
  const n = Number(String(input ?? '').trim())
  const value = Number.isFinite(n) ? n : 0
  return value.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: Math.max(minimumFractionDigits, maximumFractionDigits),
  })
}

export const isOribet = () => {
  return import.meta.env.VITE_APP_NAME === 'oribet'
}

export const isDedprz = () => {
  return import.meta.env.VITE_APP_NAME === 'dedprz'
}

export const isBonusPages = () => {
  const isBonusPage =
    location.pathname.includes('/bonus-mode') || location.pathname.includes('/bonusgames')

  return isBonusPage
}
