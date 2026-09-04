import i18n, { type i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  defaultTranslations,
  supportedLangs,
  type SupportedLang,
  type Translations,
} from './defaults'

export interface CreateI18nOptions {
  fallbackLng?: string
  langs?: SupportedLang[]
  overrides?: Partial<Record<SupportedLang, Partial<Translations>>>
  /**
   * Extra, brand-specific language bundles keyed by arbitrary ISO code (e.g. a
   * brand-only Korean override or a Chinese bundle). Merged on top of the base
   * resources, so a brand can add/override languages without changing the shared
   * `supportedLangs`.
   */
  resources?: Record<string, Translations>
}

export function createI18n(options: CreateI18nOptions = {}): I18nInstance {
  const {
    fallbackLng = 'en',
    langs = supportedLangs,
    overrides = {},
    resources: extraResources = {},
  } = options

  const resources = langs.reduce<Record<string, { translation: Translations }>>((acc, lang) => {
    const base = defaultTranslations[lang] ?? {}
    const override = overrides[lang] ?? {}
    acc[lang] = { translation: { ...base, ...override } as Translations }
    return acc
  }, {})

  // Brand-specific bundles (any ISO code) merged on top of the base resources.
  for (const [lang, translation] of Object.entries(extraResources)) {
    resources[lang] = {
      translation: { ...(resources[lang]?.translation ?? {}), ...translation } as Translations,
    }
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng,
    keySeparator: false,
    interpolation: { escapeValue: false },
  })

  return i18n
}
