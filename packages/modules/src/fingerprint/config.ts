/**
 * Fingerprint (device identification) runtime config, read from build-time env.
 * When `VITE_FINGERPRINT_API_KEY` is absent the whole feature degrades to a no-op:
 * the provider is skipped and `useSafeVisitorData` returns null — so a missing key
 * never blanks the site. The error is logged once at startup.
 */
const API_KEY = import.meta.env.VITE_FINGERPRINT_API_KEY ?? ''

export const FINGERPRINT_API_KEY = API_KEY
export const FINGERPRINT_REGION = import.meta.env.VITE_FINGERPRINT_REGION ?? 'eu'
export const FINGERPRINT_ENABLED = Boolean(API_KEY)

if (!FINGERPRINT_ENABLED) {
  // eslint-disable-next-line no-console
  console.error(
    '[fingerprint] VITE_FINGERPRINT_API_KEY is missing — device identification is disabled'
  )
}
