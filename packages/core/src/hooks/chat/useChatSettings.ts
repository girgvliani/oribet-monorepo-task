import { useAppSelector } from '../../redux/hooks'
import { SettingsKeys } from '../../util/appUtil'

export interface ChatSettings {
  /** `chat_is_enabled === '1'` — whether community chat is available at all. */
  isChatEnabled: boolean
  /** `chat_min_wager_amount` parsed to a number; null when absent / <= 0 / NaN. */
  minWagerAmount: number | null
  /** Site main currency, used to render the wager amount. */
  mainCurrency: string
  /**
   * Show the "verify your email" chat notice: verification is required
   * (`chat_is_allow_email_not_virified === '0'`) AND the logged-in user's email
   * is not yet verified. False for guests and verified users.
   */
  showEmailVerifyNotice: boolean
  isUserAuthorized: boolean
}

/**
 * Reads the runtime `chat` group from `/settings` (in `state.settings.generalSetting`) plus the
 * player's verification state, and derives the flags the chat panels need. Values in
 * `generalSetting` are strings (`'1'` / `'0'` / `'10'`).
 */
const useChatSettings = (): ChatSettings => {
  const generalSetting = useAppSelector(state => state.settings.generalSetting)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const isUserAuthorized = useAppSelector(state => !!state.user.isUserAuthorized)

  const findValue = (key: string): string | undefined =>
    generalSetting?.find((item: any) => item.key === key)?.value as string | undefined

  const isChatEnabled = findValue(SettingsKeys.chatEnable) === '1'

  const rawWager = Number(findValue(SettingsKeys.chatMinimumWagerKey))
  const minWagerAmount = Number.isFinite(rawWager) && rawWager > 0 ? rawWager : null

  const requiresVerifiedEmail = findValue(SettingsKeys.chatEmailVerification) === '0'
  const isEmailVerified = Boolean(playerInfo?.player?.email_verified)
  const showEmailVerifyNotice = isUserAuthorized && requiresVerifiedEmail && !isEmailVerified

  return {
    isChatEnabled,
    minWagerAmount,
    mainCurrency: systemSettings?.main_currency ?? '',
    showEmailVerifyNotice,
    isUserAuthorized,
  }
}

export default useChatSettings
