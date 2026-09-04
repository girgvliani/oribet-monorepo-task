import ModalWrapper from '../ModalWrapper'
import CancelOldBonusMoneyAndBuyNew from '../modals/CancelOldBonusMoneyAndBuyNew'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type CancelOldBonusMoneyAndBuyNewContainerMethods = {
  open: (data: {
    amount: string
    price: string
    wager_amount: string
    bonus_id: number
    wagering_coefficient: string
  }) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function CancelOldBonusMoneyAndBuyNewContainer(
  _,
  ref: Ref<CancelOldBonusMoneyAndBuyNewContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<{
    amount: string
    price: string
    wager_amount: string
    bonus_id: number
    wagering_coefficient: string
  }>({
    amount: '',
    price: '',
    wager_amount: '',
    bonus_id: 0,
    wagering_coefficient: '',
  })

  useImperativeHandle(ref, () => ({ open, hide }), [])

  if (show) {
    return (
      <ModalWrapper
        backdropAnimationDuration={BACKDROP_ANIMATION_DURATION}
        modalAnimationDuration={MODAL_ANIMATION_DURATION}
        isVisible={show}
        animationType={animationType}
        width="340px"
        modalTitle="Bonus Money"
        onClose={() => Defaults.modals.CancelOldBonusMoneyAndBuyNew?.hide()}
      >
        <CancelOldBonusMoneyAndBuyNew data={data} />
      </ModalWrapper>
    )
  }

  return null
})
