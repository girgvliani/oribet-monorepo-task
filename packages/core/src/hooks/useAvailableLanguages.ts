import { useMemo } from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectSystemSettings } from '../redux/selectors'
import { getFlagByIso } from '../util/flagRegistry'
import { Defaults } from '../util/defaults'
import type { ILanguage } from '../types/common.type'

const FALLBACK_LANGUAGES: ILanguage[] = [
  { icon: getFlagByIso('gb') ?? null, label: 'English', value: 'en' },
]

/**
 * Returns the language list for the language switcher, derived from
 * `settings.systemSettings.available_languages` returned by `/settings/system`.
 * Falls back to a static `[English]` list when the systemSettings call hasn't
 * populated yet so the UI is never empty.
 *
 * Also exposes `defaultLanguage` (lowercase ISO) — sourced from
 * `systemSettings.main_language`, falling back to `Defaults.defaultLanguage`.
 */
export const useAvailableLanguages = (): {
  languages: ILanguage[]
  defaultLanguage: string
} => {
  const systemSettings = useAppSelector(selectSystemSettings)

  return useMemo(() => {
    const apiList = systemSettings?.available_languages ?? []
    const apiLangs: ILanguage[] = apiList.map(lang => ({
      icon: getFlagByIso(lang.flag_iso) ?? getFlagByIso(lang.iso) ?? null,
      label: lang.name,
      value: lang.iso.toLowerCase(),
    }))

    // App-configured languages (e.g. a brand storefront) merged in by ISO so they
    // always appear even if the backend hasn't published them yet.
    const configuredLangs: ILanguage[] = (Defaults.languages ?? []).map(lang => ({
      icon: getFlagByIso(lang.iso) ?? null,
      label: lang.name,
      value: lang.iso.toLowerCase(),
    }))

    // Configured entries provide the canonical label (each language's autonym, e.g.
    // "한국어") and win over the backend's label for matching ISO codes. They only override
    // labels/icons — they do NOT add languages the backend hasn't enabled, so the switcher
    // shows exactly the backend's `available_languages`.
    const configuredByValue = new Map(configuredLangs.map(lang => [lang.value, lang]))
    const withLabels: ILanguage[] = apiLangs.map(lang => {
      const configured = configuredByValue.get(lang.value)
      return configured
        ? { ...lang, label: configured.label, icon: lang.icon ?? configured.icon }
        : lang
    })

    const languages: ILanguage[] = withLabels.length ? withLabels : FALLBACK_LANGUAGES

    const main = systemSettings?.main_language?.toLowerCase()
    const defaultLanguage = main || Defaults.defaultLanguage

    return { languages, defaultLanguage }
  }, [systemSettings])
}
