import { createNowPayment, getNowPaymentsEstimate } from '@oribet/core/api/services/Account.api'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconInfo } from '@oribet/assets/icons/IconInfo'
import { CustomPrimaryButton, CustomInput, CustomSelect, Spinner } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import styled, { useTheme } from 'styled-components'
import { INowPaymentsCurrency, INowPaymentsEstimate, INowPaymentsPayment } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { fontSize, IconChevronRight } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface IDeposit {
  coins: INowPaymentsCurrency[]
  selectedCoin: INowPaymentsCurrency | null
  setSelectedCoin: (coin: INowPaymentsCurrency | null) => void
  cryptoWallets: IWallet[]
  selectedWallet: IWallet | null
  setSelectedWallet: (wallet: IWallet | null) => void
  loading: boolean
  hideHeader?: boolean
  onClose?: () => void
}

const Deposit = ({
  coins,
  selectedCoin,
  setSelectedCoin,
  cryptoWallets,
  selectedWallet,
  setSelectedWallet,
  loading,
  hideHeader,
  onClose,
}: IDeposit) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [estimate, setEstimate] = useState<INowPaymentsEstimate | null>(null)
  const [estimateLoading, setEstimateLoading] = useState(false)
  const [estimateError, setEstimateError] = useState<string | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [payment, setPayment] = useState<INowPaymentsPayment | null>(null)

  const walletRendererData = () => {
    return cryptoWallets.map((w: IWallet) => ({
      value: String(w.id),
      renderer: () => <ItemName>{w.currency}</ItemName>,
    }))
  }

  const onChangeWallet = (value: string) => {
    const found = cryptoWallets.find(w => w.id === Number(value))
    if (found) setSelectedWallet(found)
  }

  const coinRendererData = () => {
    return coins.map((item: INowPaymentsCurrency) => ({
      value: item.code,
      searchLabel: `${item.name} ${item.code} ${item.ticker}`,
      renderer: () => (
        <CoinItem>
          <CoinLogo src={item.logo_url} alt={item.name} width="24px" height="24px" />
          <ItemName>
            {item.name} ({item.code.toUpperCase()})
          </ItemName>
        </CoinItem>
      ),
    }))
  }

  const onChangeCoin = (code: string) => {
    const found = coins.find(c => c.code === code)
    if (found) {
      setSelectedCoin(found)
      setAmount('')
      setEstimate(null)
      setEstimateError(null)
      setConfirmError(null)
      setPayment(null)
    }
  }

  const rootRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchEstimate = useCallback(
    (value: string) => {
      if (!selectedCoin || !value || Number(value) <= 0) {
        setEstimate(null)
        return
      }

      setEstimateLoading(true)
      setEstimateError(null)

      getNowPaymentsEstimate({ pay_currency: selectedCoin.code, amount: Number(value) })
        .then((resp: any) => {
          if (resp.success && resp.data) {
            setEstimate(resp.data)
          }
        })
        .catch(() => {
          setEstimateError(t('wallet.estimateError'))
        })
        .finally(() => setEstimateLoading(false))
    },
    [selectedCoin, t]
  )

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setPayment(null)
    setConfirmError(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchEstimate(value), 500)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleConfirm = () => {
    if (!selectedCoin || !selectedWallet || !amount || Number(amount) <= 0) return

    setConfirmError(null)

    if (estimate && Number(amount) < estimate.min_amount) {
      setConfirmError(t('wallet.amountBelowMinimum'))
      return
    }

    setConfirmLoading(true)
    createNowPayment({
      currency: selectedCoin.code,
      wallet_id: selectedWallet.id,
      amount: Number(amount),
    })
      .then((resp: any) => {
        if (resp.success === false) {
          setConfirmError(resp.data?.message || t('wallet.paymentError'))
        } else {
          setPayment(resp)
          requestAnimationFrame(() => {
            rootRef.current?.scrollTo({ top: rootRef.current.scrollHeight, behavior: 'smooth' })
          })
        }
      })
      .catch(() => {
        setConfirmError(t('wallet.paymentError'))
      })
      .finally(() => setConfirmLoading(false))
  }

  const { enqueueSnackbar } = useSnackbar()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      enqueueSnackbar(t('wallet.addressCopied'), { variant: 'success' })
    })
  }

  const showMultipleWallets = cryptoWallets.length > 1

  return (
    <Root ref={rootRef} $isMobile={isMobile} $hideHeader={hideHeader}>
      {!isMobile && !hideHeader && (
        <Header>
          <IconDeposit size={20} />
          <span>{t('account.deposit')}</span>
        </Header>
      )}
      {!isMobile && !hideHeader && <Divider />}

      <SelectContainer $isMobile={isMobile}>
        {showMultipleWallets ? (
          <CustomSelect
            onChange={event => onChangeWallet(event.target.value)}
            value={selectedWallet ? String(selectedWallet.id) : ''}
            label={t('wallet.wallet')}
            data={walletRendererData()}
            testId={DEPOSIT_TEST_IDS.crypto.wallet}
          />
        ) : (
          selectedWallet && (
            <WalletBadge>
              {t('wallet.wallet')}: {selectedWallet.currency}
            </WalletBadge>
          )
        )}
      </SelectContainer>

      <SelectContainer $isMobile={isMobile}>
        {loading ? (
          <LoadingContainer>
            <Spinner color={theme.colors.accent.brand} />
          </LoadingContainer>
        ) : (
          <CustomSelect
            onChange={event => onChangeCoin(event.target.value)}
            value={selectedCoin?.code || ''}
            label={t('wallet.coin')}
            data={coinRendererData()}
            searchable
            testId={DEPOSIT_TEST_IDS.crypto.coin}
          />
        )}
      </SelectContainer>

      {selectedCoin && (
        <AmountSection $isMobile={isMobile}>
          <AmountGrid>
            <CustomInput
              label={`${t('wallet.amountToTransfer')} (${selectedCoin.ticker.toUpperCase()})`}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              testId={DEPOSIT_TEST_IDS.crypto.amount}
            />
            <ChevronWrapper>
              <IconChevronRight size={20} />
            </ChevronWrapper>
            <CustomInput
              label={`${t('wallet.estimatedReceive')} (${selectedWallet?.currency ?? 'USDT'})`}
              type="text"
              value={estimateLoading ? '...' : (estimate?.estimated_amount ?? '')}
              onChange={() => {}}
              disabled
              placeholder="—"
              testId={DEPOSIT_TEST_IDS.crypto.estimate}
            />
          </AmountGrid>

          {estimateError && <ErrorText>{estimateError}</ErrorText>}

          {estimate && (
            <EstimateInfoBox>
              <EstimateRow>
                <IconInfo size={16} style={{ color: theme.colors.accent.primary, flexShrink: 0 }} />
                <EstimateDetails>
                  <EstimateSubRow>
                    <EstimateLabel>{t('wallet.minimumAmount')}</EstimateLabel>
                    <EstimateSubValue>
                      {estimate.min_amount} {estimate.currency_from.toUpperCase()}
                    </EstimateSubValue>
                  </EstimateSubRow>
                </EstimateDetails>
              </EstimateRow>
            </EstimateInfoBox>
          )}

          {confirmError && <ErrorText>{confirmError}</ErrorText>}

          {estimate && !payment && (
            <CustomPrimaryButton
              onClick={handleConfirm}
              disabled={!selectedWallet || !amount || Number(amount) <= 0 || confirmLoading}
              loading={confirmLoading}
              fullWidth="100%"
              testId={DEPOSIT_TEST_IDS.crypto.confirm}
            >
              {t('wallet.confirm')}
            </CustomPrimaryButton>
          )}
        </AmountSection>
      )}

      {payment && (
        <PaymentSection $isMobile={isMobile}>
          <PaymentSummaryCard>
            <PaymentSummaryText>
              <Trans
                i18nKey="wallet.paymentSummaryMessage"
                values={{
                  payAmount: amount,
                  payCurrency: selectedCoin?.code?.toUpperCase() ?? '',
                  estimatedAmount: estimate?.estimated_amount ?? '',
                  walletCurrency: estimate?.currency_to?.toUpperCase() ?? '',
                }}
                components={{ bold: <PaymentSummaryBold /> }}
              />
            </PaymentSummaryText>
          </PaymentSummaryCard>

          <QrContainer $isMobile={isMobile}>
            {!isMobile && (
              <QrWrapper>
                <QRCode
                  size={128}
                  style={{ height: '154px', width: '154px', display: 'block' }}
                  value={payment.address}
                  viewBox="0 0 128 128"
                />
              </QrWrapper>
            )}
            <AddressSection>
              <AddressContent>
                <AddressRow>
                  <AddressInfo>
                    <DepositAddressLabel>{t('wallet.depositAddress')}</DepositAddressLabel>
                    <AddressText>{payment.address}</AddressText>
                  </AddressInfo>
                  <CustomPrimaryButton
                    style={{ textTransform: 'uppercase', width: '81px', flexShrink: 0 }}
                    onClick={() => copyToClipboard(payment.address)}
                    testId={DEPOSIT_TEST_IDS.crypto.addressCopy}
                  >
                    {t('common.copy')}
                  </CustomPrimaryButton>
                </AddressRow>
                <DepositAddressDescription>{t('wallet.howToUseQrCode')}</DepositAddressDescription>
              </AddressContent>

              {(payment.payin_extra_id || payment.tag) && (
                <>
                  <HeaderLine $isMobile={isMobile} />
                  <MemoContent>
                    <MemoInfo>
                      <MemoAddressLabel>{t('wallet.memo')}</MemoAddressLabel>
                      <MemoText>{payment.payin_extra_id || payment.tag}</MemoText>
                    </MemoInfo>
                    <CustomPrimaryButton
                      style={{ textTransform: 'uppercase', width: '81px', flexShrink: 0 }}
                      onClick={() => copyToClipboard((payment.payin_extra_id || payment.tag)!)}
                      testId={DEPOSIT_TEST_IDS.crypto.memoCopy}
                    >
                      {t('common.copy')}
                    </CustomPrimaryButton>
                  </MemoContent>
                </>
              )}
            </AddressSection>
          </QrContainer>

          <DepositInfoText>{t('wallet.depositPropagationInfo')}</DepositInfoText>

          <PendingTxTable>
            <PendingTxHeader>
              <PendingTxHeaderCell>{t('wallet.type')}</PendingTxHeaderCell>
              <PendingTxHeaderCell>{t('wallet.amount')}</PendingTxHeaderCell>
              {!isMobile && <PendingTxHeaderCell>{t('wallet.time')}</PendingTxHeaderCell>}
              <PendingTxHeaderCell style={{ textAlign: 'right' }}>
                {t('wallet.status')}
              </PendingTxHeaderCell>
            </PendingTxHeader>
            <PendingTxRow>
              <PendingTxCell>{t('account.deposit')}</PendingTxCell>
              <PendingTxCell>
                {amount} {selectedCoin?.code?.toUpperCase()}
              </PendingTxCell>
              {!isMobile && (
                <PendingTxCell>
                  <PendingTxTime>
                    {new Date().toISOString().replace('T', ' ').slice(0, 19)}
                  </PendingTxTime>
                </PendingTxCell>
              )}
              <PendingTxCell style={{ justifyContent: 'flex-end' }}>
                <PendingBadge>{t('wallet.pending')}</PendingBadge>
              </PendingTxCell>
            </PendingTxRow>
          </PendingTxTable>

          <SeeAllRow>
            <CustomPrimaryButton
              onClick={() => {
                onClose?.()
                navigate(AppRoutePath.TRANSACTIONS())
              }}
              testId={DEPOSIT_TEST_IDS.crypto.seeTransactions}
            >
              {t('wallet.seeAllTransactions')}
            </CustomPrimaryButton>
          </SeeAllRow>
        </PaymentSection>
      )}

      {!selectedCoin && !loading && !payment && (
        <SelectPrompt>
          <SelectCurrencyText>{t('wallet.selectCoin')}</SelectCurrencyText>
        </SelectPrompt>
      )}
    </Root>
  )
}

export default Deposit

const Root = styled.div<{ $isMobile: boolean; $hideHeader?: boolean }>`
  ${({ $hideHeader, $isMobile, theme }) => {
    if ($hideHeader) {
      return `
        border: none;
        height: 100%;
        overflow: scroll;
        padding-bottom: 24px;
      `
    }
    if ($isMobile) {
      return `
        width: 100%;
        box-sizing: border-box;
        background: ${theme.colors.bg.secondary};
        min-height: calc(100% - env(safe-area-inset-bottom));
      `
    }
    return `
      border: 1px solid ${theme.colors.surface.hover};
      background: ${theme.colors.bg.secondary};
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
    `
  }}
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

const SelectContainer = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0 8px 0' : '0 16px 0')};
  display: flex;
  gap: 24px;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};

  &:first-of-type {
    padding-top: 16px;
  }

  &:last-of-type {
    padding-bottom: 16px;
  }
`

const WalletBadge = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
  text-transform: uppercase;
  padding: 0 16px;
`

const CoinItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 24px;
`

const CoinLogo = styled.img`
  border-radius: 50%;
`

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.base};
  line-height: 16px;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  display: flex;
`

const AmountSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0 8px 16px' : '0 16px 16px')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: end;
`

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const EstimateInfoBox = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 8px;
  padding: 12px;
`

const EstimateRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`

const EstimateDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const EstimateSubRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const EstimateLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const EstimateSubValue = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${fontSize.sm};
  font-weight: 500;
  padding-left: 16px;
`

const SelectPrompt = styled.div`
  margin: 8px 24px 24px 24px;
`

const SelectCurrencyText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  font-size: ${fontSize.sm};
  line-height: 24px;
`

const PaymentSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0 8px 16px' : '0 16px 16px')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const QrContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
  border-radius: 8px;
`

const QrWrapper = styled.div`
  border: 5px solid #ffffff;
  border-radius: 4px;
  display: flex;
  flex-shrink: 0;
  align-self: flex-start;
`

const AddressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
  overflow-y: auto;
`

const AddressContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 12px;
`

const AddressRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
`

const AddressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`

const DepositAddressLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const AddressText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.lg};
  line-height: 24px;
  word-break: break-all;
`

const DepositAddressDescription = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 20px;
`

const HeaderLine = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  margin-top: ${({ $isMobile }) => (!$isMobile ? '8px' : '5px')};
`

const MemoContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
`

const MemoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MemoAddressLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const MemoText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.lg};
  line-height: 24px;
  line-break: anywhere;
`

const PaymentSummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.accent.brand}1A;
  border: 1px solid ${({ theme }) => theme.colors.accent.brand};
  border-radius: 8px;
  padding: 16px;
`

const PaymentSummaryBold = styled.span`
  color: ${({ theme }) => theme.colors.accent.brand};
  font-weight: 700;
`

const PaymentSummaryText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 22px;
`

const PendingTxTable = styled.div`
  border-radius: 8px;
  overflow: hidden;
`

const PendingTxHeader = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 700;
  font-size: ${fontSize.sm};
  line-height: 24px;
  text-transform: uppercase;
`

const PendingTxHeaderCell = styled.div`
  flex: 1;
  padding: 8px 16px;
`

const PendingTxRow = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: 700;
  line-height: 24px;
  border-radius: 8px;
`

const PendingTxCell = styled.div`
  display: flex;
  flex: 1;
  padding: 12px 16px;
  align-items: center;
  gap: 8px;
`

const PendingTxTime = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`

const PendingBadge = styled.span`
  color: ${({ theme }) => theme.colors.accent.brand};
  font-weight: 600;
  font-size: ${fontSize.sm};
`

const DepositInfoText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.sm};
  line-height: 20px;
`

const SeeAllRow = styled.div`
  display: flex;
  justify-content: flex-end;
`
