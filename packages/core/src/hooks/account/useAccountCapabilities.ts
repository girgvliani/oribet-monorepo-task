import { useAppSelector } from '../../redux/hooks'
import { SettingsKeys } from '../../util/appUtil'

/**
 * Reads the feature gates that decide which Account sections are usable for this player.
 * - `hasCryptoWallet`: drives Deposit/Withdraw-Crypto/Buy-Crypto sections.
 * - `hasFiatDeposit`: Interkasa fiat deposit toggle from `general_settings`.
 */
export const useAccountCapabilities = () => {
  const generalSetting = useAppSelector(state => state.settings.generalSetting)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = !!systemSettings?.multi_currency?.has_crypto_wallet
  const hasFiatDeposit = !!generalSetting?.find(
    (item: any) =>
      item.value === '1' && item.key === SettingsKeys.interkassa_transaction_status,
  )
  return { hasCryptoWallet, hasFiatDeposit }
}
