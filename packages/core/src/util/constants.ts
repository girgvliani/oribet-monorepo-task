export const SLOTSOFT = 'SlotSoft'

import type { RegistrationConfig } from '../redux/slices/settingsSlice'

/**
 * Token the backend lists in `registration.required_confirmations` to mandate phone
 * verification (confirmed value for Korea). Centralized so a backend rename is a
 * one-line change.
 */
export const PHONE_CONFIRMATION_KEY = 'phone'

/** True when the current brand requires phone confirmation after registration. */
export const isPhoneConfirmationRequired = (registration?: RegistrationConfig): boolean =>
  !!registration?.required_confirmations?.includes(PHONE_CONFIRMATION_KEY)
