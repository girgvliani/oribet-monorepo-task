import ModalWrapper from '../ModalWrapper'
import MarketPlaceCardModal from '../modals/MarketPlaceCardModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type MarketPlaceCardDescContainerMethods = {
  open: (data: { description: string }) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function MarketPlaceCardDescContainer(
  _,
  ref: Ref<MarketPlaceCardDescContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<{
    description: string
  }>({
    description: '',
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
        modalTitle="Item Info"
        onClose={() => Defaults.modals.marketPlaceCardDescContainer?.hide()}
      >
        <MarketPlaceCardModal data={data} />
      </ModalWrapper>
    )
  }

  return null
})
