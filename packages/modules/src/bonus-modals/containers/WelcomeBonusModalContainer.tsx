import ModalWrapper from '../ModalWrapper'
import WelcomeBonusModal from '../modals/WelcomeBonusModal'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import { type Ref, forwardRef, useImperativeHandle } from 'react'
import { IBMBonusMoney } from '@oribet/core/types/BonusMoney.type'

export type WelcomeBonusModalContainerMethods = {
  open: (data: {
    yourDeposit: string
    bonusAmout: string
    totalBonusMoney: string
    wagering_coefficient: string
    modalTitle: string
    desc: string
    type: string
    currentWelcomeBonus: IBMBonusMoney
  }) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function WelcomeBonusModalContainer(
  _,
  ref: Ref<WelcomeBonusModalContainerMethods>
) {
  const { show, animationType, data, open, hide } = useModalContainer<{
    yourDeposit: string
    bonusAmout: string
    totalBonusMoney: string
    wagering_coefficient: string
    modalTitle: string
    desc: string
    type: string
    currentWelcomeBonus: IBMBonusMoney | undefined
  }>({
    yourDeposit: '',
    bonusAmout: '',
    totalBonusMoney: '',
    wagering_coefficient: '',
    modalTitle: '',
    desc: '',
    type: '',
    currentWelcomeBonus: undefined,
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
        modalTitle={data.modalTitle}
        onClose={() => Defaults.modals.welcomeBonusModal?.hide()}
      >
        <WelcomeBonusModal data={data} />
      </ModalWrapper>
    )
  }

  return null
})
