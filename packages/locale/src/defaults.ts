import en from './translations/en.json'
import ko from './translations/ko.json'

export type SupportedLang = 'en' | 'ko'

export type Translations = Record<string, string>

export const defaultTranslations: Record<SupportedLang, Translations> = {
  en,
  ko,
}

export const supportedLangs: SupportedLang[] = ['en', 'ko']
