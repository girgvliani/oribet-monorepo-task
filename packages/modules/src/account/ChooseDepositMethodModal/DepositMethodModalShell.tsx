import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeGlobalDepositModal } from '@oribet/core/redux/slices/userSlice'
import ChooseDepositMethodModal from './ChooseDepositMethodModal'

const DepositMethodModalShell = () => {
  const isOpen = useAppSelector(state => state.user.globalDepositModal)
  const dispatch = useAppDispatch()

  return (
    <ChooseDepositMethodModal
      isOpen={isOpen}
      onClose={() => dispatch(changeGlobalDepositModal(false))}
    />
  )
}

export default DepositMethodModalShell
