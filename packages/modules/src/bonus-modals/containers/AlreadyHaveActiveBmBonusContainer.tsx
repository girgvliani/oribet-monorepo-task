import ModalWrapper from '../ModalWrapper'
import AlreadyHaveActiveBmBonusModal from '../modals/AlreadyHaveActiveBmBonusModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type BuyBonusModalContainerMethods = {
  open: () => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function AlreadyHaveActiveBmBonusContainer(
  _,
  ref: Ref<BuyBonusModalContainerMethods>
) {
  const { show, animationType, open, hide } = useModalContainer()

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
        onClose={() => Defaults.modals.alreadyHaveActiveBmBonusContainer?.hide()}
      >
        <AlreadyHaveActiveBmBonusModal />
      </ModalWrapper>
    )
  }

  return null
})
