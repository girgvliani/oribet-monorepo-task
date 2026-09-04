import { FlagArabic } from '@oribet/assets/flags/FlagArabic'
import { FlagBrazil } from '@oribet/assets/flags/FlagBrazil'
import { FlagChina } from '@oribet/assets/flags/FlagChina'
import { FlagGeorgia } from '@oribet/assets/flags/FlagGeorgia'
import { FlagGerman } from '@oribet/assets/flags/FlagGerman'
import { FlagKorean } from '@oribet/assets/flags/FlagKorean'
import { FlagRussian } from '@oribet/assets/flags/FlagRussian'
import { FlagSpanish } from '@oribet/assets/flags/FlagSpanish'
import { FlagTurkey } from '@oribet/assets/flags/FlagTurkey'
import { FlagUnitedKingdom } from '@oribet/assets/flags/FlagUnitedKingdom'
import type { FC } from 'react'
import type { IReactIcon } from '@oribet/shared-types'

/** Country/region ISO codes (lowercase) → flag component. */
const FLAG_BY_ISO: Record<string, FC<IReactIcon>> = {
  gb: FlagUnitedKingdom,
  uk: FlagUnitedKingdom,
  en: FlagUnitedKingdom,
  kr: FlagKorean,
  ko: FlagKorean,
  br: FlagBrazil,
  pt: FlagBrazil,
  de: FlagGerman,
  es: FlagSpanish,
  ru: FlagRussian,
  tr: FlagTurkey,
  ar: FlagArabic,
  sa: FlagArabic,
  ae: FlagArabic,
  ge: FlagGeorgia,
  zh: FlagChina,
  cn: FlagChina,
}

/**
 * Resolve a flag icon by ISO code (e.g. "gb", "ko"). Matching is case-insensitive.
 * Returns `undefined` when no flag is registered for the code; callers should
 * either render a placeholder or skip the icon.
 */
export const getFlagByIso = (iso: string | undefined | null): FC<IReactIcon> | undefined => {
  if (!iso) return undefined
  return FLAG_BY_ISO[iso.toLowerCase()]
}
