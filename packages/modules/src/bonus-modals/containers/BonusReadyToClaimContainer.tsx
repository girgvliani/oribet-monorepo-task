import ModalWrapper from '../ModalWrapper'
import BonusReadyToClaimModal from '../modals/BonusReadyToClaimModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'

export interface BonusReadyToClaimData {
  returnMode?: boolean
  claimAmount?: string
  claimBonusId?: number
}

export type BonusReadyToClaimContainerMethods = {
  open: (data?: BonusReadyToClaimData) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function BonusReadyToClaimContainer(
  _,
  ref: Ref<BonusReadyToClaimContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<BonusReadyToClaimData>()

  useImperativeHandle(ref, () => ({ open, hide }), [])

  if (show) {
    return (
      <ModalWrapper
        backdropAnimationDuration={BACKDROP_ANIMATION_DURATION}
        modalAnimationDuration={MODAL_ANIMATION_DURATION}
        isVisible={show}
        animationType={animationType}
        width="340px"
        modalTitle={'Claim Bonus'}
        onClose={() => Defaults.modals.bonusReadyToClaimModal?.hide()}
      >
        <BonusReadyToClaimModal
          returnMode={data?.returnMode}
          claimAmount={data?.claimAmount}
          claimBonusId={data?.claimBonusId}
        />
      </ModalWrapper>
    )
  }

  return null
})
