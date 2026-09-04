import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { Spinner } from '@oribet/ui'
import OmnoCashierContainer from './OmnoDepositModal/OmnoCashierContainer'
import WalletSelector from './OmnoDepositModal/WalletSelector'
import useCreateOmnoCashierSession from '@oribet/core/hooks/wallet/useCreateOmnoCashierSession'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

type Step = 'idle' | 'select-wallet' | 'cashier'

const DepositFiatOmno: FC = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const { t } = useTranslation()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const wallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const defaultWallet: IWallet | undefined = playerInfo?.player?.default_wallet

  const [step, setStep] = useState<Step>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)

  const { mutateAsync, isPending } = useCreateOmnoCashierSession()

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

  return (
    <Root $isMobile={isMobile}>
      {!isMobile && (
        <Header>
          <IconDeposit size={20} />
          <span>{t('interkasa.depositFiat')}</span>
        </Header>
      )}
      {!isMobile && <Divider />}

      <Content>
        {(step === 'idle' || (step !== 'select-wallet' && isPending)) && (
          <SpinnerWrapper>
            <Spinner color={theme.colors.accent.brand} />
          </SpinnerWrapper>
        )}

        {step === 'select-wallet' && (
          <WalletSelector wallets={wallets} onSelect={createSession} isLoading={isPending} />
        )}

        {step === 'cashier' && sessionId && (
          <>
            {wallets.length > 1 && (
              <BackLink
                data-testid={DEPOSIT_TEST_IDS.omno.back}
                onClick={() => { setStep('select-wallet'); setSessionId(null) }}
              >
                ← {t('common.back')}
              </BackLink>
            )}
            <OmnoCashierContainer sessionId={sessionId} />
          </>
        )}
      </Content>
    </Root>
  )
}

export default DepositFiatOmno

const Root = styled.div<{ $isMobile: boolean }>`
  ${({ $isMobile, theme }) =>
    $isMobile
      ? `
        width: 100%;
        box-sizing: border-box;
        background: ${theme.colors.bg.secondary};
        min-height: calc(100% - env(safe-area-inset-bottom));
      `
      : `
        border: 1px solid ${theme.colors.surface.hover};
        background: ${theme.colors.bg.secondary};
        width: 100%;
        box-sizing: border-box;
        border-radius: 12px;
      `}
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  margin: 16px 0px;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 8px;

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

const Divider = styled.div`
  background: ${({ theme }) => theme.colors.surface.borderSubtle};
  width: 100%;
  height: 1px;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 500px;
`

const SpinnerWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`

const BackLink = styled.button`
  align-self: flex-start;
  margin: 12px 16px 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`
