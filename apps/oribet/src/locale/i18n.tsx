import {
  createI18n,
  supportedLangs,
  defaultTranslations,
  type SupportedLang,
  type Translations,
} from '@oribet/locale'
import { getUserLanguage } from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'

// The shared locale defaults use the "asdfbet" placeholder brand, so every string that
// mentions it is overridden here with this app's own brand.
const rebrand = (value: string): string =>
  value
    .replace(/asdfbet/g, 'oribet')
    .replace(/ASDFBET/g, 'ORIBET')
    .replace(/Asdfbet/g, 'Oribet')

const brandOverrides = supportedLangs.reduce<Partial<Record<SupportedLang, Partial<Translations>>>>(
  (acc, lang) => {
    const base = defaultTranslations[lang] ?? {}
    const changed: Translations = {}
    for (const [key, val] of Object.entries(base)) {
      if (typeof val === 'string' && /asdfbet/i.test(val)) changed[key] = rebrand(val)
    }
    acc[lang] = changed
    return acc
  },
  {}
)

// Brand name for hardcoded (non-i18n) brand strings in shared components. Must agree with
// the domain below and with the rebrand map above — it read 'efsobet' while everything
// around it said oribet, so shared components rendered the wrong brand.
Defaults.brandName = 'oribet'
Defaults.brandDomain = 'ORIBET.SPACE'

const i18n = createI18n({
  fallbackLng: getUserLanguage(),
  langs: supportedLangs,
  overrides: brandOverrides,
})

export const languageKeys = supportedLangs.reduce<Record<string, string>>((acc, key) => {
  acc[key] = key
  return acc
}, {})

export default i18n
