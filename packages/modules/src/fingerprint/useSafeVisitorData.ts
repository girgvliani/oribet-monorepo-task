import { useVisitorData } from '@fingerprint/react'
import { FINGERPRINT_ENABLED } from './config'

type VisitorGetData = ReturnType<typeof useVisitorData>['getData']
type VisitorResult = Awaited<ReturnType<VisitorGetData>>

export interface SafeVisitorData {
  /** Resolves the visitor data, or `null` when fingerprint is disabled / unavailable. */
  getData: (...args: Parameters<VisitorGetData>) => Promise<VisitorResult | null>
}

/**
 * Provider-safe wrapper around `useVisitorData`. When no API key is configured the real hook
 * (and its `<FingerprintProvider>` requirement) is bypassed entirely and `getData` resolves to
 * `null`, so screens that request a fingerprint keep working without a provider in the tree.
 *
 * `FINGERPRINT_ENABLED` is a build-time constant, so the conditional hook call is stable for the
 * app's lifetime (never toggles between renders).
 */
export const useSafeVisitorData = (
  options?: Parameters<typeof useVisitorData>[0]
): SafeVisitorData => {
  if (!FINGERPRINT_ENABLED) {
    return { getData: async () => null }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getData } = useVisitorData(options)
  return { getData }
}

export default useSafeVisitorData
