import Cookies from 'js-cookie'
import { changeBackendLanguage } from '../api/services/User.api'
import { setLocalStorageValue } from './appUtil'

/**
 * User-initiated language change. Persists to the backend (`GET /setLang`) BEFORE navigating, then
 * rewrites the `/{lang}/` URL segment and full-reloads so the whole app re-localizes.
 *
 * Awaiting the request first (a) guarantees it isn't cancelled by the page unload and (b) ensures
 * the saved `player.lang` is already updated before the post-reload bootstrap reconcile reads it,
 * so the reload doesn't bounce the user back to their old language.
 */
export const changeLanguageAndReload = async (lang: string): Promise<void> => {
  Cookies.set('language', lang)
  setLocalStorageValue('language', lang)
  try {
    await changeBackendLanguage(lang)
  } catch {
    // Best-effort — still switch the UI language even if the backend call fails.
  }
  const parts = window.location.pathname.split('/')
  if (parts.length >= 2) parts[1] = lang
  else parts.splice(1, 0, lang)
  window.location.href = parts.join('/') + window.location.search
}
