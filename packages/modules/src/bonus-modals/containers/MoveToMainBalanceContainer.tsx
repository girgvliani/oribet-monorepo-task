import ModalWrapper from '../ModalWrapper'
import MoveToMainBalanceModal from '../modals/MoveToMainBalanceModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type MoveToMainBalanceContainerMethods = {
  open: () => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function MoveToMainBalanceContainer(
  _,
  ref: Ref<MoveToMainBalanceContainerMethods>
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
        modalTitle={'Bonus Cashback'}
        onClose={() => Defaults.modals.moveToMainBalanceModal?.hide()}
      >
        <MoveToMainBalanceModal />
      </ModalWrapper>
    )
  }

  return null
})
