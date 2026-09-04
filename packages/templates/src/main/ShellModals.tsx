import { BonusWheelModal } from '@oribet/modules/bonus-wheel'
import {
  AlreadyHaveActiveBmBonusContainer,
  BonusReadyToClaimContainer,
  BuyBonusModalContainer,
  CancelOldBonusMoneyAndBuyNewContainer,
  DidnTCompleteWaigeringModalContainer,
  InvalidBonusBetContainer,
  MarketPlaceCardDescContainer,
  MoveToMainBalanceContainer,
  PromoCodeModalContainer,
  RakeBackModalContainer,
  WageredAndClaimModalContainer,
  WelcomeBonusModalContainer,
} from '@oribet/modules/bonus-modals'
import { Defaults } from '@oribet/core/util/defaults'

const ShellModals = () => {
  return (
    <>
      <MoveToMainBalanceContainer
        ref={ref => {
          Defaults.modals.moveToMainBalanceModal = ref
        }}
      />
      <PromoCodeModalContainer
        ref={ref => {
          Defaults.modals.promoCodeModal = ref
        }}
      />
      <BuyBonusModalContainer
        ref={ref => {
          Defaults.modals.buyBonusModal = ref
        }}
      />
      <RakeBackModalContainer
        ref={ref => {
          Defaults.modals.rakeBackModal = ref
        }}
      />
      <WageredAndClaimModalContainer
        ref={ref => {
          Defaults.modals.wageredAndClaimModal = ref
        }}
      />
      <CancelOldBonusMoneyAndBuyNewContainer
        ref={ref => {
          Defaults.modals.CancelOldBonusMoneyAndBuyNew = ref
        }}
      />
      <DidnTCompleteWaigeringModalContainer
        ref={ref => {
          Defaults.modals.didnTCompleteWaigeringModal = ref
        }}
      />
      <WelcomeBonusModalContainer
        ref={ref => {
          Defaults.modals.welcomeBonusModal = ref
        }}
      />
      <AlreadyHaveActiveBmBonusContainer
        ref={ref => {
          Defaults.modals.alreadyHaveActiveBmBonusContainer = ref
        }}
      />
      <MarketPlaceCardDescContainer
        ref={ref => {
          Defaults.modals.marketPlaceCardDescContainer = ref
        }}
      />
      <BonusReadyToClaimContainer
        ref={ref => {
          Defaults.modals.bonusReadyToClaimModal = ref
        }}
      />
      <InvalidBonusBetContainer
        ref={ref => {
          Defaults.modals.invalidBonusBetModal = ref
        }}
      />
      <BonusWheelModal />
    </>
  )
}

export default ShellModals
