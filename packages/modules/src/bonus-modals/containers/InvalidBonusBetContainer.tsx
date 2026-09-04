import { type Ref, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import useModalContainer from '@oribet/core/hooks/useModalContainer'
import { Defaults } from '@oribet/core/util/defaults'
import ModalWrapper from '../ModalWrapper'
import InvalidBonusBetModal from '../modals/InvalidBonusBetModal'

export interface InvalidBonusBetData {
  minBet?: string | number
  maxBet?: string | number
}

export type InvalidBonusBetContainerMethods = {
  open: (data?: InvalidBonusBetData) => void
  hide: () => void
}

const BACKDROP_ANIMATION_DURATION = Defaults.backdropAnimationDuration
const MODAL_ANIMATION_DURATION = Defaults.modalAnimationDuration

export default forwardRef(function InvalidBonusBetContainer(
  _,
  ref: Ref<InvalidBonusBetContainerMethods>
) {
  const { t } = useTranslation()
  const { show, animationType, data, open, hide } = useModalContainer<InvalidBonusBetData>()

  useImperativeHandle(ref, () => ({ open, hide }), [])

  if (!show) return null

  return (
    <ModalWrapper
      backdropAnimationDuration={BACKDROP_ANIMATION_DURATION}
      modalAnimationDuration={MODAL_ANIMATION_DURATION}
      isVisible={show}
      animationType={animationType}
      width="340px"
      modalTitle={t('bonusMoney.invalidBetTitle', { defaultValue: 'Invalid bet' })}
      onClose={() => Defaults.modals.invalidBonusBetModal?.hide()}
    >
      <InvalidBonusBetModal minBet={data?.minBet} maxBet={data?.maxBet} />
    </ModalWrapper>
  )
})
