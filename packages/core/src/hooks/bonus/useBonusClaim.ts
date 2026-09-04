import { useSnackbar } from 'notistack'

interface ResponseAccessor {
  getSuccess: (response: any) => boolean
  getAmount: (response: any) => any
  getMessage: (response: any) => string
}

interface UseBonusClaimOptions {
  claimFn: (payload: any) => Promise<any>
  payload: Record<string, any>
  isReady: boolean
  reloadData?: () => void
  responseAccessor: ResponseAccessor
  bonusType?: 'rakeback' | 'cashback'
}

const useBonusClaim = ({
  claimFn,
  payload,
  isReady,
  reloadData,
  responseAccessor,
}: UseBonusClaimOptions) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleClaim = () => {
    if (!isReady) return

    claimFn(payload)
      .then((response: any) => {
        if (!responseAccessor.getSuccess(response)) {
          enqueueSnackbar(responseAccessor.getMessage(response), {
            variant: 'error',
          })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (reloadData) {
          reloadData()
        }
      })
  }

  return handleClaim
}

export default useBonusClaim
