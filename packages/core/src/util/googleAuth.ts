import { getBaseUrl } from '../api/baseUrl'

/**
 * Query param the backend reads for the chosen wallet currency (ISO code, e.g. `KRW`)
 * on the Google flow: `…/auth/social/google?player_cur=KRW`. Only set on the retry
 * after the currency picker; harmless (ignored) for already-registered players.
 */
export const GOOGLE_AUTH_PLAYER_CUR_PARAM = 'player_cur'

/**
 * Query params the backend reads for the verified phone on the Google sign-up retry
 * (Korea): `…/auth/social/google?player_cur=KRW&phone=+82-10...&phone_confirm_code=1234`.
 * NOTE: assumed param names — adjust if the backend expects different keys.
 */
export const GOOGLE_AUTH_PHONE_PARAM = 'phone'
export const GOOGLE_AUTH_PHONE_CODE_PARAM = 'phone_confirm_code'

/**
 * `error_type` value the backend appends to the callback URL when a brand-new Google
 * user has no wallet yet — the frontend must show the currency picker and retry the
 * Google URL with `player_cur` set.
 */
export const GOOGLE_PLAYER_NEEDS_WALLET_ERROR = 'player_not_registered_need_wallet'

interface GoogleAuthOptions {
  /** ISO wallet currency chosen on the currency-selection step (the retry call). */
  playerCur?: string
  /** Verified phone (`+CC-number`) collected on the Korea finish-signup step. */
  phone?: string
  /** 4-digit phone confirmation code that pairs with `phone`. */
  phoneConfirmCode?: string
}

/**
 * Builds the Google social-login redirect URL. Centralises the affiliate-cookie logic
 * previously duplicated across the auth modules and, when provided, appends the chosen
 * wallet currency (`player_cur`) for the backend.
 */
export const buildGoogleAuthUrl = ({
  playerCur,
  phone,
  phoneConfirmCode,
}: GoogleAuthOptions = {}): string => {
  const url = new URL(getBaseUrl() + '/auth/social/google')
  const params = new URLSearchParams()

  const affiliateData = localStorage.getItem('affiliate')
  if (affiliateData) {
    try {
      const parsed = JSON.parse(affiliateData)
      const expiry = new Date(parsed.date)
      expiry.setDate(expiry.getDate() + 7)
      if (expiry > new Date()) {
        if (parsed.affid) params.append('affid', parsed.affid)
        if (parsed.cxd) params.append('cxd', parsed.cxd)
      }
    } catch {
      /* ignore malformed affiliate cookie */
    }
  }

  if (playerCur) params.append(GOOGLE_AUTH_PLAYER_CUR_PARAM, playerCur)
  if (phone) params.append(GOOGLE_AUTH_PHONE_PARAM, phone)
  if (phoneConfirmCode) params.append(GOOGLE_AUTH_PHONE_CODE_PARAM, phoneConfirmCode)

  url.search = params.toString()
  return url.toString()
}

/** Redirects the browser to Google social login (optionally with a chosen currency). */
export const redirectToGoogleAuth = (options: GoogleAuthOptions = {}): void => {
  window.location.replace(buildGoogleAuthUrl(options))
}
