import en from './translations/en.json'
import ko from './translations/ko.json'
import korean from './translations/korean.json'
import chinese from './translations/chinese.json'
import type { Translations } from './defaults'

/**
 * Brand-specific language bundles for the oribet-korea storefront ONLY (do not wire
 * into the shared `supportedLangs` / oribet).
 *
 * - `ko` — the brand Korean (`korean.json`) layered over the base Korean so any key
 *   the brand file doesn't translate still falls back to standard Korean, not English.
 * - `zh` — Chinese (`chinese.json`) layered over English so untranslated keys show
 *   readable English rather than the raw key.
 */
const brandKorean: Translations = { ...(ko as Translations), ...(korean as Translations) }
const brandChinese: Translations = { ...(en as Translations), ...(chinese as Translations) }

export const koreaResources: Record<string, Translations> = {
  // Aliases (ko/kr, zh/cn) so the brand translations load whichever ISO code the
  // backend/switcher uses for Korean / Chinese.
  ko: brandKorean,
  kr: brandKorean,
  zh: brandChinese,
  cn: brandChinese,
}
