import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { CustomModal, MobileContainer, Spinner } from '@oribet/ui'
import DepositContainer from '../containers/DepositContainer'
import BuyCryptoContainer from '../containers/BuyCryptoContainer'
import useCreateOmnoCashierSession from '@oribet/core/hooks/wallet/useCreateOmnoCashierSession'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { enqueueSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { fontSize, media } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'
import OmnoCashierContainer from '../OmnoDepositModal/OmnoCashierContainer'
import WalletSelector from '../OmnoDepositModal/WalletSelector'
import MethodChooser from './MethodChooser'
import AgentPayDeposit from './AgentPayDeposit'

interface ChooseDepositMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step =
  | 'choose-method'
  | 'fiat-select-wallet'
  | 'fiat-cashier'
  | 'transfer-crypto'
  | 'buy-crypto'
  | 'agentpay'

const ChooseDepositMethodModal: FC<ChooseDepositMethodModalProps> = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const { t } = useTranslation()

  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const allWallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const fiatWallets = useMemo(() => allWallets.filter(w => !w.is_crypto), [allWallets])

  const onlyCrypto = systemSettings?.multi_currency?.only_crypto ?? false
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet ?? false
  const showFiat = !onlyCrypto
  const showCrypto = hasCryptoWallet

  const [step, setStep] = useState<Step>('choose-method')
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('choose-method')
      setSessionId(null)
    }
  }, [isOpen])

  const { mutateAsync, isPending } = useCreateOmnoCashierSession()

  const createSession = useCallback(
    async (wallet: IWallet) => {
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
        setStep('fiat-cashier')
      } catch (error) {
        enqueueSnackbar(extractApiError(error), { variant: 'error' })
      }
    },
    [mutateAsync, t]
  )

  const handleSelectFiat = useCallback(() => {
    if (fiatWallets.length === 1) {
      createSession(fiatWallets[0])
    } else if (fiatWallets.length > 1) {
      setStep('fiat-select-wallet')
    }
  }, [fiatWallets, createSession])

  // The modal ALWAYS opens on the method chooser — never auto-skip/redirect to a
  // method. The user must explicitly pick one every time.

  const handleBack = () => {
    setStep('choose-method')
    setSessionId(null)
  }

  const getHeaderTitle = () => {
    switch (step) {
      case 'choose-method':
        return t('account.deposit')
      case 'fiat-select-wallet':
      case 'fiat-cashier':
        return t('interkasa.depositFiat')
      case 'transfer-crypto':
        return t('account.transferCrypto')
      case 'buy-crypto':
        return t('account.buyCrypto')
      case 'agentpay':
        return t('account.depositAgentPay')
    }
  }

  const showBackButton = step !== 'choose-method' || isMobile

  const isChooserStep = step === 'choose-method' || step === 'fiat-select-wallet'

  const renderBody = () => (
    <Root $mobile={isMobile} $fitContent={isChooserStep}>
      <Header $mobile={isMobile}>
        <HeaderButtonGroup>
          {showBackButton && (
            <BackButton
              data-testid={DEPOSIT_TEST_IDS.method.back}
              onClick={() => {
                if (step === 'choose-method') {
                  onClose()
                } else {
                  handleBack()
                }
              }}
            >
              <IconArrowBack size={16} />
            </BackButton>
          )}
          <HeaderLabel>
            {!isMobile && <IconDeposit size={20} />}
            <span>{getHeaderTitle()}</span>
          </HeaderLabel>
        </HeaderButtonGroup>
      </Header>
      <Divider />

      <Content>
        {step === 'choose-method' && (
          <MethodChooser
            showFiat={showFiat}
            showCrypto={showCrypto}
            onSelectFiat={handleSelectFiat}
            onSelectTransferCrypto={() => setStep('transfer-crypto')}
            onSelectBuyCrypto={() => setStep('buy-crypto')}
            onSelectAgentPay={() => setStep('agentpay')}
            isFiatLoading={isPending}
          />
        )}

        {step === 'fiat-select-wallet' && (
          <WalletSelector wallets={fiatWallets} onSelect={createSession} isLoading={isPending} />
        )}

        {step === 'fiat-cashier' && sessionId && (
          <OmnoCashierContainer sessionId={sessionId} onPaymentSuccess={onClose} />
        )}

        {step === 'fiat-cashier' && !sessionId && (
          <SpinnerWrapper>
            <Spinner color={theme.colors.accent.brand} />
          </SpinnerWrapper>
        )}

        {step === 'transfer-crypto' && <DepositContainer hideHeader onClose={onClose} />}

        {step === 'buy-crypto' && <BuyCryptoContainer hideHeader />}

        {step === 'agentpay' && <AgentPayDeposit wallets={allWallets} onSuccess={onClose} />}
      </Content>
    </Root>
  )

  return isMobile ? (
    isOpen && (
      <MobileContainer open={isOpen} setOpen={onClose}>
        {renderBody()}
      </MobileContainer>
    )
  ) : (
    // idmap-ignore: structural modal wrapper — inner controls carry testids
    <CustomModal open={isOpen} onClose={onClose} fullScreen="">
      {renderBody()}
    </CustomModal>
  )
}

export default ChooseDepositMethodModal

const Root = styled.div<{ $mobile: boolean; $fitContent: boolean }>`
  width: ${({ $mobile }) => ($mobile ? '100%' : '900px')};
  display: flex;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.secondary};
  flex-direction: column;
  height: ${({ $mobile, $fitContent }) =>
    $mobile ? `calc(100% - env(safe-area-inset-bottom))` : $fitContent ? 'auto' : '60vh'};
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

const BackButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
