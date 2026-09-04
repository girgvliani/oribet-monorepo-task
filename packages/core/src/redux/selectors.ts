import type { RootState } from './store'
import { SettingsKeys } from '../util/appUtil'

// User selectors
export const selectIsUserAuthorized = (state: RootState) => state.user.isUserAuthorized
export const selectPlayerInfo = (state: RootState) => state.user.playerInfo
export const selectLanguage = (state: RootState) => state.user.language
export const selectRanksInfo = (state: RootState) => state.user.ranksInfo
export const selectHideMainHeader = (state: RootState) => state.user.hideMainHeader

// Game selectors
export const selectFavourite = (state: RootState) => state.game.favourite
export const selectCategories = (state: RootState) => state.game.categories
export const selectProviders = (state: RootState) => state.game.providers

// Settings selectors
export const selectGeneralSettings = (state: RootState) => state.settings.generalSetting
export const selectTermsOfServices = (state: RootState) => state.settings.termsOfServices
export const selectSystemSettings = (state: RootState) => state.settings.systemSettings
export const selectRegistrationConfig = (state: RootState) =>
  state.settings.systemSettings?.registration
/** Community chat availability gate (`chat_is_enabled` from `/settings`). */
export const selectIsChatEnabled = (state: RootState) =>
  state.settings.generalSetting?.some(
    (item: any) => item.key === SettingsKeys.chatEnable && item.value === '1'
  ) ?? false

// Blogs selectors
export const selectBlogItems = (state: RootState) => state.blogs.blogItems
