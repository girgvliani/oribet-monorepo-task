import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setLocalStorageValue } from '../../util/appUtil'
import { IUserProfileInfo } from '../../util/UserProfileHelper'
import Cookies from 'js-cookie'
import { IBonusClaimStatus } from '../../types/Bonus.type'
import { IAccessToken, IRankInfo, IUserInfo, IWheelSpinsInfo } from '../../types/common.type'
import { IWallet, IWalletBalanceUpdate, IDefaultWalletChanged } from '../../types/Wallet.type'
// AppDispatch is not imported from store to avoid circular dependency (store → userSlice → store)
type AppDispatch = (...args: any[]) => any

interface UserState {
  isUserAuthorized: boolean | null
  access_token: IAccessToken
  // TODO: Type properly once API response types are defined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playerInfo: any
  language: string
  isCountryRestricted: boolean
  ranksInfo: IRankInfo[]
  userProfileInformation: IUserProfileInfo | Record<string, never>
  globalUserLoginModalOpen: boolean
  globalUserRegistrationModalOpen: boolean
  globalCurrencySelectionModalOpen: boolean
  globalBonusWheelModalOpen: boolean
  bonusClaimModalStatusInfo: IBonusClaimStatus
  hideMainHeader: boolean
  globalDepositModal: boolean
  globalWelcomeModalOpen: boolean
  globalWalletModalOpen: boolean
  /**
   * Deposit bonus to pre-select when the wallet opens on the Deposit tab. Set via
   * `openDepositWithBonus(bonusId)` from anywhere (bonuses page, promotions, …); cleared when the
   * wallet closes. `null` = no pre-selection (generic open).
   */
  globalWalletBonusId: number | null
  globalChatOpen: boolean
  isSidebarOpen: boolean
  bmBonusReadyToClaim: { bonus_id: number; wallet_id: number } | null
}

const initialState: UserState = {
  isUserAuthorized: null,
  access_token: {
    expire_at: '',
    token: '',
  },
  playerInfo: {
    player: {},
  },
  language: 'en',
  isCountryRestricted: false,
  ranksInfo: [],
  userProfileInformation: {},
  globalUserLoginModalOpen: false,
  globalUserRegistrationModalOpen: false,
  globalCurrencySelectionModalOpen: false,
  globalBonusWheelModalOpen: false,
  bonusClaimModalStatusInfo: {
    success: false,
    open: false,
    claimedAmount: '0',
    bonusType: 'rakeback',
  },
  hideMainHeader: false,
  globalDepositModal: false,
  globalWelcomeModalOpen: false,
  globalWalletModalOpen: false,
  globalWalletBonusId: null,
  globalChatOpen: false,
  isSidebarOpen: false,
  bmBonusReadyToClaim: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserAuthorization(state, action: PayloadAction<boolean>) {
      state.isUserAuthorized = action.payload
    },
    changeUserInfo(state, action: PayloadAction<IUserInfo>) {
      state.playerInfo = action.payload
    },
    changeAccessToken(state, action: PayloadAction<IAccessToken>) {
      state.access_token = action.payload
    },
    changeLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    changeCountryRestricted(state, action: PayloadAction<boolean>) {
      state.isCountryRestricted = action.payload
    },
    clearUserInfo(state) {
      state.playerInfo = {}
    },
    changeRanksInfo(state, action: PayloadAction<IRankInfo[]>) {
      state.ranksInfo = action.payload
    },
    changeUserProfileInfo(state, action: PayloadAction<IUserProfileInfo>) {
      state.userProfileInformation = action.payload
    },
    changeEmail(state, action: PayloadAction<string>) {
      state.playerInfo = {
        ...state.playerInfo,
        player: {
          ...state.playerInfo.player,
          email: action.payload,
        },
      }
    },
    changePhone(state, action: PayloadAction<string>) {
      state.playerInfo = {
        ...state.playerInfo,
        player: {
          ...state.playerInfo.player,
          phone: action.payload,
        },
      }
    },
    changeGlobalUserLoginModalOpen(state, action: PayloadAction<boolean>) {
      state.globalUserLoginModalOpen = action.payload
    },
    changeGlobalUserRegistrationModalOpen(state, action: PayloadAction<boolean>) {
      state.globalUserRegistrationModalOpen = action.payload
    },
    changeGlobalCurrencySelectionModalOpen(state, action: PayloadAction<boolean>) {
      state.globalCurrencySelectionModalOpen = action.payload
    },
    changeGlobalUserRegistrationAndLoginModalClose: {
      reducer(state) {
        state.globalUserLoginModalOpen = false
        state.globalUserRegistrationModalOpen = false
      },
      prepare(_open?: boolean) {
        return { payload: undefined }
      },
    },
    globalBonusWheelModalClose: {
      reducer(state) {
        state.globalBonusWheelModalOpen = false
      },
      prepare(_open?: boolean) {
        return { payload: undefined }
      },
    },
    globalBonusWheelModalOpen: {
      reducer(state) {
        state.globalBonusWheelModalOpen = true
      },
      prepare(_open?: boolean) {
        return { payload: undefined }
      },
    },
    changeBonusClaimModalStatusInfo(state, action: PayloadAction<IBonusClaimStatus>) {
      state.bonusClaimModalStatusInfo = action.payload
    },
    changeWheelSpinsInfo(state, action: PayloadAction<IWheelSpinsInfo>) {
      state.playerInfo = {
        ...state.playerInfo,
        player: {
          ...state.playerInfo.player,
          wheel_spins: action.payload.wheel_spins,
          can_spin_after: action.payload.can_spin_after,
        },
      }
    },
    changeBalance(state, action: PayloadAction<{ real: number; bonus: number }>) {
      const player = state.playerInfo.player
      player.balance = action.payload.real
      player.bonus_balance = action.payload.bonus

      if (player.default_wallet) {
        player.default_wallet.balance = String(action.payload.real)
      }
      if (player.wallets) {
        const defaultWallet = player.wallets.find((w: IWallet) => w.is_default)
        if (defaultWallet) {
          defaultWallet.balance = String(action.payload.real)
        }
      }
    },
    updateWalletBalance(state, action: PayloadAction<IWalletBalanceUpdate>) {
      const { id, balance, bm_balance } = action.payload.wallet
      const player = state.playerInfo.player

      if (player.wallets) {
        const wallet = player.wallets.find((w: IWallet) => w.id === id)
        if (wallet) {
          wallet.balance = String(balance)
          wallet.bm_balance = String(bm_balance)
        }
      }

      if (player.default_wallet?.id === id) {
        player.default_wallet.balance = String(balance)
        player.default_wallet.bm_balance = String(bm_balance)
        player.balance = balance
        player.bonus_balance = String(bm_balance)
      }
    },
    syncDefaultWallet(state, action: PayloadAction<IDefaultWalletChanged>) {
      const player = state.playerInfo.player
      if (!player.wallets) return

      for (const sw of action.payload.wallets) {
        const wallet = player.wallets.find((w: IWallet) => w.id === sw.id)
        if (wallet) {
          wallet.balance = String(sw.balance)
          wallet.bm_balance = String(sw.bm_balance)
          wallet.is_default = sw.is_default
        }

        if (sw.is_default) {
          if (player.default_wallet) {
            player.default_wallet.balance = String(sw.balance)
            player.default_wallet.bm_balance = String(sw.bm_balance)
            player.default_wallet.id = sw.id
            player.default_wallet.currency = sw.currency
            player.default_wallet.is_default = true
          }
          player.balance = sw.balance
          player.bonus_balance = String(sw.bm_balance)
          player.currency = sw.currency
        }
      }
    },
    changeDefaultWallet(state, action: PayloadAction<IWallet>) {
      const newDefault = action.payload
      const player = state.playerInfo.player

      player.default_wallet = newDefault
      player.currency = newDefault.currency
      player.balance = Number(newDefault.balance)
      player.bonus_balance = '0'

      if (player.wallets) {
        player.wallets = player.wallets.map((w: IWallet) => ({
          ...w,
          is_default: w.id === newDefault.id,
          bm_balance: w.id === newDefault.id ? '0' : w.bm_balance,
        }))
      }

      if (player.default_wallet) {
        player.default_wallet.bm_balance = '0'
      }
    },
    changeMainHeaderVisibility(state, action: PayloadAction<boolean>) {
      state.hideMainHeader = action.payload
    },
    changeGlobalDepositModal(state, action: PayloadAction<boolean>) {
      state.globalDepositModal = action.payload
    },
    changeGlobalWelcomeModal(state, action: PayloadAction<boolean>) {
      state.globalWelcomeModalOpen = action.payload
    },
    changeGlobalWalletModal(state, action: PayloadAction<boolean>) {
      state.globalWalletModalOpen = action.payload
      // Drop any pre-selected bonus when the wallet closes so the next generic open is clean.
      if (!action.payload) state.globalWalletBonusId = null
    },
    /**
     * Universal entry point to open the wallet on the Deposit tab with a specific deposit bonus
     * pre-selected. Dispatch from anywhere (bonuses page now; promotions, banners, … later).
     */
    openDepositWithBonus(state, action: PayloadAction<number>) {
      state.globalWalletModalOpen = true
      state.globalWalletBonusId = action.payload
    },
    changeGlobalChatOpen(state, action: PayloadAction<boolean>) {
      state.globalChatOpen = action.payload
    },
    changeSideBarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload
    },
    clearDefaultWalletBmBalance(state) {
      const player = state.playerInfo.player
      if (player.default_wallet) {
        player.default_wallet.bm_balance = '0'
      }
      player.bonus_balance = '0'
      if (player.wallets && player.default_wallet) {
        const wallet = player.wallets.find((w: IWallet) => w.id === player.default_wallet.id)
        if (wallet) {
          wallet.bm_balance = '0'
        }
      }
    },
    setBmBonusReadyToClaim(state, action: PayloadAction<{ bonus_id: number; wallet_id: number }>) {
      state.bmBonusReadyToClaim = action.payload
    },
    clearBmBonusReadyToClaim(state) {
      state.bmBonusReadyToClaim = null
    },
    changeWantDepositBonus(state, action: PayloadAction<boolean>) {
      if (state.playerInfo?.player) {
        state.playerInfo.player.want_deposit_bonus = action.payload
      }
    },
    changeUserVerificationStatus: {
      reducer(state, action: PayloadAction<{ key: string; status: string }>) {
        const { key, status } = action.payload
        state.playerInfo = {
          ...state.playerInfo,
          player: { ...state.playerInfo.player, [key]: status },
        }
      },
      prepare(key: string, status: string) {
        return { payload: { key, status } }
      },
    },
  },
})

export const {
  changeUserAuthorization,
  changeUserInfo,
  changeAccessToken,
  changeLanguage,
  changeCountryRestricted,
  clearUserInfo,
  changeRanksInfo,
  changeUserProfileInfo,
  changeEmail,
  changePhone,
  changeGlobalUserLoginModalOpen,
  changeGlobalUserRegistrationModalOpen,
  changeGlobalCurrencySelectionModalOpen,
  changeGlobalUserRegistrationAndLoginModalClose,
  globalBonusWheelModalClose,
  globalBonusWheelModalOpen,
  changeBonusClaimModalStatusInfo,
  changeWheelSpinsInfo,
  changeBalance,
  updateWalletBalance,
  syncDefaultWallet,
  changeDefaultWallet,
  changeMainHeaderVisibility,
  changeGlobalDepositModal,
  changeGlobalWelcomeModal,
  changeGlobalWalletModal,
  openDepositWithBonus,
  changeGlobalChatOpen,
  changeSideBarOpen,
  clearDefaultWalletBmBalance,
  setBmBonusReadyToClaim,
  clearBmBonusReadyToClaim,
  changeWantDepositBonus,
  changeUserVerificationStatus,
} = userSlice.actions

// Thunks for actions with side effects (localStorage/cookies)
export const setLanguage = (language: string) => (dispatch: AppDispatch) => {
  setLocalStorageValue('language', language)
  Cookies.set('language', language)
  dispatch(changeLanguage(language))
}

export const setCountryRestricted = (isRestricted: boolean) => (dispatch: AppDispatch) => {
  setLocalStorageValue('isCountryRestricted', isRestricted)
  dispatch(changeCountryRestricted(isRestricted))
}

export default userSlice.reducer
