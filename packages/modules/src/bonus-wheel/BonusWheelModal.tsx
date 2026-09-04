import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { globalBonusWheelModalClose } from '@oribet/core/redux/slices/userSlice'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { CustomModal } from '@oribet/ui'
import BonusWheelContainer from './BonusWheelContainer'

const DESKTOP_SIZE = 380
const MOBILE_SIZE = 280

const BonusWheelModal = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(state => state.user.globalBonusWheelModalOpen)
  const isMobile = useIsMobile()

  const size = isMobile ? MOBILE_SIZE : DESKTOP_SIZE

  return (
    /* idmap-ignore: structural modal wrapper */
    <CustomModal open={isOpen} onClose={() => dispatch(globalBonusWheelModalClose(false))}>
      <BonusWheelContainer width={size} height={size} />
    </CustomModal>
  )
}

export default BonusWheelModal
