import ModalWrapper from '../ModalWrapper'
import DidntCompleteWaigeringModal from '../modals/DidntCompleteWaigeringModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type CompleteWaigeringModalContainerMethods = {
  open: () => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function DidnTCompleteWaigeringModalContainer(
  _,
  ref: Ref<CompleteWaigeringModalContainerMethods>
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
        modalTitle="Wagering incomplete"
        onClose={() => (window.location.href = AppRoutePath.HOME())}
      >
        <DidntCompleteWaigeringModal />
      </ModalWrapper>
    )
  }

  return null
})
