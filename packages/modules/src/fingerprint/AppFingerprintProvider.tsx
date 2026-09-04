import { FingerprintProvider } from '@fingerprint/react'
import type { ReactNode } from 'react'
import { FINGERPRINT_API_KEY, FINGERPRINT_ENABLED, FINGERPRINT_REGION } from './config'

interface AppFingerprintProviderProps {
  children: ReactNode
}

/**
 * Wraps the app in Fingerprint's provider only when an API key is configured. Without a key
 * (see `config`) it renders the children directly, so device identification is disabled but the
 * site still loads instead of showing a blank page. Consumers must read visitor data through
 * `useSafeVisitorData`, which no-ops in the same disabled case.
 */
export const AppFingerprintProvider = ({ children }: AppFingerprintProviderProps) => {
  if (!FINGERPRINT_ENABLED) return <>{children}</>

  return (
    <FingerprintProvider apiKey={FINGERPRINT_API_KEY} region={FINGERPRINT_REGION}>
      {children}
    </FingerprintProvider>
  )
}

export default AppFingerprintProvider
