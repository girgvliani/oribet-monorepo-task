import ModalWrapper from '../ModalWrapper'
import BuyBonusModal from '../modals/BuyBonusModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type BuyBonusModalContainerMethods = {
  open: (data: {
    amount: string
    price: string
    wagering_coefficient: string
    bonus_id: number
    buy_amount?: number
  }) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function BuyBonusModalContainer(
  _,
  ref: Ref<BuyBonusModalContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<{
    amount: string
    price: string
    wagering_coefficient: string
    bonus_id: number
    buy_amount?: number
  }>({
    amount: '',
    price: '',
    wagering_coefficient: '',
    bonus_id: 0,
    buy_amount: undefined,
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
        onClose={() => Defaults.modals.buyBonusModal?.hide()}
      >
        <BuyBonusModal data={data} />
      </ModalWrapper>
    )
  }

  return null
})
