import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingItem {
  is_active?: boolean
  [key: string]: unknown
}

export interface MultiCurrencySettings {
  only_crypto: boolean
  is_multi_currency: boolean
  has_crypto_wallet: boolean
  supported_currencies: string[]
}

export interface AvailableLanguage {
  /** Display name, e.g. "English", "Korean" */
  name: string
  /** Language ISO 639-1 code (lowercase), e.g. "en", "ko" — used as the i18n + cookie key */
  iso: string
  /** Country flag ISO code (lowercase), e.g. "gb", "kr" — used to pick the flag asset */
  flag_iso: string
}

/**
 * Per-brand registration contract from `/settings/system`. `required_fields` /
 * `optional_fields` map a field name to its Laravel-style validation rule string
 * (e.g. `{ username: "required|min:3|regex:/^[a-z0-9]+$/|unique:..." }`); an empty set
 * may serialize as `[]`. `required_confirmations` lists mandatory confirmations
 * (e.g. Korea returns `["phone"]`).
 */
export interface RegistrationConfig {
  required_fields: Record<string, string> | string[]
  optional_fields: Record<string, string> | string[]
  required_confirmations: string[]
}

export interface SystemSettings {
  project: string
  payment_providers: string[]
  multi_currency: MultiCurrencySettings
  main_currency: string
  main_language: string
  main_country: string
  main_crypto_currency: string
  available_languages?: AvailableLanguage[]
  registration?: RegistrationConfig
}

interface SettingsState {
  generalSetting: SettingItem[]
  termsOfServices: SettingItem[]
  systemSettings: SystemSettings | null
}

const initialState: SettingsState = {
  generalSetting: [],
  termsOfServices: [],
  systemSettings: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSettings(state, action: PayloadAction<SettingItem[]>) {
      state.generalSetting = action.payload
    },
    generalTermsOfServices(state, action: PayloadAction<SettingItem[]>) {
      state.termsOfServices = action.payload.filter(item => item.is_active)
    },
    setSystemSettings(state, action: PayloadAction<SystemSettings>) {
      state.systemSettings = action.payload
    },
  },
})

export const { changeSettings, generalTermsOfServices, setSystemSettings } = settingsSlice.actions
export default settingsSlice.reducer
