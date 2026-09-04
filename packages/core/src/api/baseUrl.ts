import { getUserLanguage } from '../util/appUtil'

export const getBaseUrl = () => import.meta.env.VITE_API_URL + '/api'
export const getBaseUrlStatic = () => import.meta.env.VITE_API_URL

/**
 * Backend image fields (banners, promotions, blog) can arrive either as a plain
 * URL string or as a per-language map, e.g. `{ en: "https://.../banner.jpg" }`.
 * Returns the active language's URL (fallback: English, then first available).
 */
const pickLocalizedImage = (value: Record<string, unknown>): string => {
  const lang = (getUserLanguage() || 'en').toLowerCase()
  const picked = value[lang] ?? value.en ?? Object.values(value)[0]
  return typeof picked === 'string' ? picked : ''
}

export const resolveImageUrl = (
  path: string | Record<string, string> | undefined | null
): string => {
  // Normalise a per-language image map down to the active language's URL string.
  if (path && typeof path === 'object') path = pickLocalizedImage(path)
  if (!path || typeof path !== 'string') return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path
  }
  return getBaseUrlStatic() + (path.startsWith('/') ? '' : '/') + path
}
export const getBaseSocketUrl = () => import.meta.env.VITE_SOCKET_URL
export const getChatSocketUrl = () => import.meta.env.VITE_CHAT_SOCKET_URL
export const getGiphySdkApiKey = () => import.meta.env.VITE_GIPHY_SDK_API_KEY
export const getAirCrashSlug = () => import.meta.env.VITE_AIRCRASH_SLUG
export const getSportBookLibrarySrc = () => import.meta.env.VITE_SPORT_BOOK_LIBRARY_SRC
