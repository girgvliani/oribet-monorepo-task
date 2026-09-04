import { RakeBackModal } from '@oribet/modules/bonuses-page'
import ModalWrapper from '../ModalWrapper'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type RakeBackModalContainerMethods = {
  open: (value: string) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function RakeBackModalContainer(
  _,
  ref: Ref<RakeBackModalContainerMethods>
) {
  const { show, animationType, data: value, open, hide } = useModalContainer<string>('2')

  useImperativeHandle(ref, () => ({ open, hide }), [])

  if (show) {
    return (
      <ModalWrapper
        backdropAnimationDuration={BACKDROP_ANIMATION_DURATION}
        modalAnimationDuration={MODAL_ANIMATION_DURATION}
        isVisible={show}
        animationType={animationType}
        width="340px"
        modalTitle="Rakeback"
        onClose={() => Defaults.modals.rakeBackModal?.hide()}
      >
        <RakeBackModal value={value} />
      </ModalWrapper>
    )
  }

  return null
})
