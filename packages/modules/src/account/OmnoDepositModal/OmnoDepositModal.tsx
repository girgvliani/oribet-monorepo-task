import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { CustomModal, MobileContainer, Spinner } from '@oribet/ui'
import useCreateOmnoCashierSession from '@oribet/core/hooks/wallet/useCreateOmnoCashierSession'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { fontSize, media } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'
import OmnoCashierContainer from './OmnoCashierContainer'
import WalletSelector from './WalletSelector'

interface OmnoDepositModalProps {
  setIsOpenDepositModal: (isOpen: boolean) => void
  isOpenDepositModal: boolean
  changeGlobalDepositModalFn: (isOpen: boolean) => void
}

type Step = 'idle' | 'select-wallet' | 'cashier'

const OmnoDepositModal: FC<OmnoDepositModalProps> = ({
  setIsOpenDepositModal,
  isOpenDepositModal,
  changeGlobalDepositModalFn,
}) => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const { t } = useTranslation()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const wallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const defaultWallet: IWallet | undefined = playerInfo?.player?.default_wallet

  const [step, setStep] = useState<Step>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)

  const { mutateAsync, isPending } = useCreateOmnoCashierSession()

  const handleClose = () => {
    setIsOpenDepositModal(false)
    changeGlobalDepositModalFn(false)
  }

  const createSession = async (wallet: IWallet) => {
    try {
      const response = await mutateAsync({
        wallet_id: wallet.id,
        currency: wallet.currency,
      })
      const url: string | undefined = response.data?.data?.url ?? response.data?.url
      const sid = url?.split('/').pop()
      if (!sid) {
        enqueueSnackbar(t('common.error'), { variant: 'error' })
        return
      }
      setSessionId(sid)
      setStep('cashier')
    } catch (error) {
      enqueueSnackbar(extractApiError(error), { variant: 'error' })
    }
  }

  useEffect(() => {
    if (step !== 'idle') return

    if (wallets.length === 1) {
      createSession(wallets[0])
    } else if (wallets.length > 1) {
      setStep('select-wallet')
    } else if (defaultWallet) {
      createSession(defaultWallet)
    }
  }, [wallets.length, defaultWallet])

  const renderBody = () => {
    return (
      <Root $mobile={isMobile}>
        <Header $mobile={isMobile}>
          <HeaderButtonGroup>
            {(isMobile || (step === 'cashier' && wallets.length > 1)) && (
              <BackIconWrapper data-testid={DEPOSIT_TEST_IDS.omno.back}>
                {/* idmap-ignore: icon click target; wrapper carries the testid */}
                <IconArrowBack
                  onClick={() => {
                    if (step === 'cashier' && wallets.length > 1) {
                      setStep('select-wallet')
                      setSessionId(null)
                    } else {
                      handleClose()
                    }
                  }}
                  size={16}
                />
              </BackIconWrapper>
            )}
            <HeaderLabel>
              {!isMobile && <IconDeposit size={20} />}
              <span>{t('account.deposit')}</span>
            </HeaderLabel>
          </HeaderButtonGroup>
        </Header>
        <Divider />

        <Content>
          {(step === 'idle' || (step !== 'select-wallet' && isPending)) && (
            <SpinnerWrapper>
              <Spinner color={theme.colors.accent.brand} />
            </SpinnerWrapper>
          )}

          {step === 'select-wallet' && (
            <WalletSelector
              wallets={wallets}
              onSelect={createSession}
              isLoading={isPending}
            />
          )}

          {step === 'cashier' && sessionId && (
            <OmnoCashierContainer sessionId={sessionId} onPaymentSuccess={handleClose} />
          )}
        </Content>
      </Root>
    )
  }

  return isMobile ? (
    isOpenDepositModal && (
      <MobileContainer open={isOpenDepositModal} setOpen={handleClose}>
        {renderBody()}
      </MobileContainer>
    )
  ) : (
    // idmap-ignore: structural modal wrapper — inner controls carry testids
    <CustomModal
      open={isOpenDepositModal}
      onClose={handleClose}
      fullScreen={isMobile ? '80vh' : ''}
    >
      {renderBody()}
    </CustomModal>
  )
}

export default OmnoDepositModal

const Root = styled.div<{ $mobile: boolean }>`
  width: ${({ $mobile }) => ($mobile ? '100%' : '900px')};
  display: flex;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.secondary};
  flex-direction: column;
  height: ${({ $mobile }) => ($mobile ? `calc(100% - env(safe-area-inset-bottom))` : '600px')};
  border-radius: ${({ $mobile }) => ($mobile ? '0' : '12px')};
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  overflow: hidden;
`

const Header = styled.div<{ $mobile: boolean }>`
  z-index: 1;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ $mobile, theme }) => ($mobile ? theme.colors.bg.primary : 'transparent')};

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
  & span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    font-size: ${fontSize.lg};
    line-height: 24px;
  }
`

const HeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BackIconWrapper = styled.span`
  display: contents;
`

const HeaderLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 12px;

  span {
    font-size: ${fontSize.lg};
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  ${media.sm} {
    padding: 4px 16px 4px 12px;
    span {
      font-size: ${fontSize.base};
    }
  }
`

const Divider = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const SpinnerWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`
