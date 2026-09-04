import ModalWrapper from '../ModalWrapper'
import WageredAndClaimModal from '../modals/WageredAndClaimModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export type WageredAndClaimModalContainerMethods = {
  open: (data: {
    bonus_id: number
    buy_amount: number
    amountClaimed: string
    init_amount: string
    wager_amount: string
    wagering_coefficient: number
  }) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function WageredAndClaimModalContainer(
  _,
  ref: Ref<WageredAndClaimModalContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<{
    amountClaimed: string
    init_amount: string
    wager_amount: string
    wagering_coefficient: number
    bonus_id: number
    buy_amount?: number
  }>({
    amountClaimed: '',
    init_amount: '',
    wager_amount: '',
    wagering_coefficient: 0,
    bonus_id: 0,
    buy_amount: 0,
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
        onClose={() => Defaults.modals.wageredAndClaimModal?.hide()}
      >
        <WageredAndClaimModal data={data} />
      </ModalWrapper>
    )
  }

  return null
})
