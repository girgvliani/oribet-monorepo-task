interface DefaultsType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modals: any
  defaultLanguage: string
  /** Brand name for hardcoded (non-i18n) brand strings in shared components.
   *  Apps override it (e.g. oribet → 'efsobet'); defaults to the 'asdfbet' placeholder. */
  brandName: string
  /** Public brand domain shown in copy (e.g. marketing-consent line). Displayed verbatim.
   *  Apps override it per brand (oribet → 'ORIBET.SPACE'); defaults to 'ASDFBET.IO'. */
  brandDomain: string
  /**
   * App-configured language list for the switcher. Merged with the backend's
   * `available_languages` (union by ISO) so a brand can guarantee its languages
   * appear even if the backend hasn't published them yet. Leave undefined to be
   * fully backend-driven.
   */
  languages?: { iso: string; name: string }[]
  modalAnimationDuration: number
  backdropAnimationDuration: number
  defaultModalShowAnimationType: string
  defaultModalHideAnimationType: string
  telegramLink: string
}

const Defaults: DefaultsType = {
  defaultLanguage: 'en',
  brandName: 'asdfbet',
  brandDomain: 'ASDFBET.IO',
  modalAnimationDuration: 0.5,
  backdropAnimationDuration: 0.3,
  defaultModalShowAnimationType: 'Slide_Up',
  defaultModalHideAnimationType: 'Slide_Down',
  modals: {
    moveToMainBalanceModal: null,
    buyBonusModal: null,
    wageredAndClaimModal: null,
    CancelOldBonusMoneyAndBuyNew: null,
    promoCodeModal: null,
    rakeBackModal: null,
    didnTCompleteWaigeringModal: null,
    welcomeBonusModal: null,
    alreadyHaveActiveBmBonusContainer: null,
    marketPlaceCardDescContainer: null,
    bonusReadyToClaimModal: null,
    invalidBonusBetModal: null,
  },
  telegramLink: 'https://t.me/+I3htn9Kt3Z1iOGYy',
}

export { Defaults }
