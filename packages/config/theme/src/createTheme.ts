import type { AppTheme } from '@oribet/ui'
import type { DeepPartial } from '@oribet/shared-types'
import { defaultTheme } from './defaultTheme'
import { deepMerge } from './deepMerge'

export function createTheme(overrides?: DeepPartial<AppTheme>): AppTheme {
  if (!overrides) return defaultTheme
  return deepMerge(
    defaultTheme as unknown as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as unknown as AppTheme
}
