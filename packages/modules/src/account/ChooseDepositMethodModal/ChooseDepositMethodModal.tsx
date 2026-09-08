import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { CustomModal, MobileContainer, Spinner } from '@oribet/ui'
import DepositContainer from '../containers/DepositContainer'
import BuyCryptoContainer from '../containers/BuyCryptoContainer'
import useCashierSession from '@oribet/core/hooks/wallet/useCashierSession'
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
import { DEPOSIT_TEST_IDS, WALLET_TEST_IDS } from '@oribet/test-ids'
import OmnoCashierContainer from '../OmnoDepositModal/OmnoCashierContainer'
import WalletSelector from '../OmnoDepositModal/WalletSelector'
import MethodChooser from './MethodChooser'
import AgentPayDeposit from './AgentPayDeposit'
import Rail from './Rail'
import { WALLET_PALETTE as wp } from './palette'

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

  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const allWallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const fiatWallets = useMemo(() => allWallets.filter(w => !w.is_crypto), [allWallets])
  const defaultWallet = allWallets.find(w => w.is_default) ?? allWallets[0]

  const [step, setStep] = useState<Step>('choose-method')
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('choose-method')
      setSessionId(null)
    }
  }, [isOpen])

  const {
    session: cashierSession,
    isInitializing: isCashierInitializing,
    isUpdating: isCashierUpdating,
    initSession: initCashierSession,
    updateSession: updateCashierSession,
  } = useCashierSession()

  const [initErrorMessage, setInitErrorMessage] = useState<string | null>(null)

  // §6.7: only one cashier session can be live at a time — initializing wallet B
  // invalidates wallet A's session. To show every wallet's methods together anyway, we
  // probe each wallet once (just to read its `providers`) and cache the results; the
  // *last* one probed (the default wallet) is left as the actually-live session.
  const [walletProviders, setWalletProviders] = useState<Record<number, string[]>>({})

  const probeAllWallets = useCallback(async () => {
    const others = allWallets.filter(w => w.id !== defaultWallet?.id)
    const map: Record<number, string[]> = {}

    for (const wallet of others) {
      try {
        const response = await initCashierSession(wallet.id)
        map[wallet.id] = response.data?.data?.providers ?? []
      } catch {
        map[wallet.id] = []
      }
    }

    if (defaultWallet) {
      setInitErrorMessage(null)
      try {
        const response = await initCashierSession(defaultWallet.id)
        map[defaultWallet.id] = response.data?.data?.providers ?? []
      } catch (error) {
        const message = extractApiError(error)
        setInitErrorMessage(message)
        enqueueSnackbar(message, { variant: 'error' })
      }
    }

    setWalletProviders(map)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWallets, defaultWallet?.id, initCashierSession])

  // Bootstrap (or re-bootstrap) every wallet's session whenever the modal opens (§6.7:
  // re-init rather than reuse a possibly-consumed session).
  useEffect(() => {
    if (isOpen) probeAllWallets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleRetryInit = useCallback(() => {
    probeAllWallets()
  }, [probeAllWallets])

  // Remembered independently of `cashierSession.chosen_bonuses`, since re-initializing a
  // different wallet's session (see handleSelectMethod) resets that server-side — this is
  // what lets a bonus pick survive clicking a method that belongs to a different wallet.
  const [lastChosenBonusId, setLastChosenBonusId] = useState<number | null>(null)

  const handleBonusIdsChange = useCallback(
    async (bonusIds: number[]) => {
      try {
        await updateCashierSession({ bonus_ids: bonusIds })
        setLastChosenBonusId(bonusIds[0] ?? null)
      } catch (error) {
        enqueueSnackbar(extractApiError(error), { variant: 'error' })
      }
    },
    [updateCashierSession]
  )

  const [lockingProvider, setLockingProvider] = useState<string | null>(null)

  // §7.1: clicking a method locks the provider onto the session (with the current
  // bonus_ids) before advancing. Stay on the chooser and surface an error on failure.
  // If the method belongs to a wallet other than the currently-live session's, silently
  // re-init that wallet's session first (§6.7) and re-apply the remembered bonus pick if
  // it's still valid for that wallet.
  const handleSelectMethod = useCallback(
    async (walletId: number, provider: string, advance: () => void) => {
      setLockingProvider(provider)
      try {
        let session = cashierSession
        if (session?.wallet.id !== walletId) {
          const response = await initCashierSession(walletId)
          session = response.data?.data ?? null
        }
        if (!session) return

        const bonusIds =
          lastChosenBonusId !== null &&
          session.available_bonuses.some(b => b.id === lastChosenBonusId)
            ? [lastChosenBonusId]
            : []

        await updateCashierSession({ provider, bonus_ids: bonusIds })
        advance()
      } catch (error) {
        enqueueSnackbar(extractApiError(error), { variant: 'error' })
      } finally {
        setLockingProvider(null)
      }
    },
    [cashierSession, initCashierSession, lastChosenBonusId, updateCashierSession]
  )

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

  // Merged across every wallet (not just the active one) — this is what lets Crypto and
  // Card both show on the initial screen together, instead of only whichever wallet
  // happens to be the live session.
  const mergedProviders = useMemo(
    () => Array.from(new Set(Object.values(walletProviders).flat())),
    [walletProviders]
  )
  const walletIdForProvider = useCallback(
    (provider: string) =>
      allWallets.find(w => (walletProviders[w.id] ?? []).includes(provider))?.id,
    [allWallets, walletProviders]
  )

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

  const renderMethodChooser = () => (
    <MethodChooser
      providers={mergedProviders}
      onSelectFiat={handleSelectFiat}
      onSelectTransferCrypto={() => {
        const walletId = walletIdForProvider('nowpayments')
        if (walletId) handleSelectMethod(walletId, 'nowpayments', () => setStep('transfer-crypto'))
      }}
      onSelectBuyCrypto={() => {
        const walletId = walletIdForProvider('changelly')
        if (walletId) handleSelectMethod(walletId, 'changelly', () => setStep('buy-crypto'))
      }}
      onSelectAgentPay={() => {
        const walletId = walletIdForProvider('agentpay')
        if (walletId) handleSelectMethod(walletId, 'agentpay', () => setStep('agentpay'))
      }}
      session={cashierSession}
      onBonusIdsChange={handleBonusIdsChange}
      isBonusUpdating={isCashierUpdating}
      lockingProvider={lockingProvider}
      isLoading={isCashierInitializing}
      initErrorMessage={initErrorMessage}
      onRetryInit={handleRetryInit}
    />
  )

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
        {step === 'choose-method' && renderMethodChooser()}

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

  // The redesigned frame (dark/gold palette, new header) applies to the initial
  // method-chooser step on both desktop (rail+pane) and mobile (single column, no rail —
  // not enough width for it). Every other step keeps the original single-column layout
  // via renderBody(), on both desktop and mobile, since those flows are out of scope.
  const showRail = step === 'choose-method' && !isMobile
  const showMobileRedesign = step === 'choose-method' && isMobile

  return isMobile ? (
    isOpen && (
      <MobileContainer open={isOpen} setOpen={onClose}>
        {showMobileRedesign ? (
          <MobilePaneRoot>
            <PaneHeader>
              <PaneTitle>{t('account.deposit')}</PaneTitle>
              <CloseButton onClick={onClose} data-testid={WALLET_TEST_IDS.modal.close}>
                <IconClose size={18} />
              </CloseButton>
            </PaneHeader>
            <MobileScrollArea>{renderMethodChooser()}</MobileScrollArea>
          </MobilePaneRoot>
        ) : (
          renderBody()
        )}
      </MobileContainer>
    )
  ) : (
    // idmap-ignore: structural modal wrapper — inner controls carry testids
    <CustomModal open={isOpen} onClose={onClose} fullScreen={showRail ? 'min(92vw, 1100px)' : ''}>
      {showRail ? (
        <RailPaneRoot>
          <Rail wallet={defaultWallet} />
          <Pane>
            <PaneHeader>
              <PaneTitle>{t('account.deposit')}</PaneTitle>
              <CloseButton onClick={onClose} data-testid={WALLET_TEST_IDS.modal.close}>
                <IconClose size={18} />
              </CloseButton>
            </PaneHeader>
            <Content>{renderMethodChooser()}</Content>
          </Pane>
        </RailPaneRoot>
      ) : (
        renderBody()
      )}
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

const RailPaneRoot = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: min(75vh, 640px);
  max-height: 90vh;
  display: flex;
  flex-direction: row;
  background: ${wp.bgPane};
  border: 1px solid ${wp.border};
  border-radius: 22px;
  overflow: hidden;
`

const Pane = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  overflow: hidden;
`

const PaneHeader = styled.div`
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const PaneTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${wp.textPrimary};
`

const CloseButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${wp.textSecondary};
  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${wp.textPrimary};
  }
  &:active {
    transform: scale(0.92);
  }
`

const MobilePaneRoot = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${wp.bgPane};
  overflow: hidden;

  ${PaneHeader} {
    padding: 16px 20px;
    flex-shrink: 0;
  }
`

const MobileScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px 20px;
`
