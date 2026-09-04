import ModalWrapper from '../ModalWrapper'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'
import PromoCodeModal from '../modals/PromoCodeModal'

export type PromoCodeModalContainerMethods = {
  open: (value: string) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function PromoCodeModalContainer(
  _,
  ref: Ref<PromoCodeModalContainerMethods>
) {
  const { show, animationType, data: value, open, hide } = useModalContainer<string>('')

  useImperativeHandle(ref, () => ({ open, hide }), [])

  if (show) {
    return (
      <ModalWrapper
        backdropAnimationDuration={BACKDROP_ANIMATION_DURATION}
        modalAnimationDuration={MODAL_ANIMATION_DURATION}
        isVisible={show}
        animationType={animationType}
        width="340px"
        modalTitle="Promo Code"
        onClose={() => Defaults.modals.promoCodeModal?.hide()}
      >
        <PromoCodeModal value={value} />
      </ModalWrapper>
    )
  }

  return null
})
