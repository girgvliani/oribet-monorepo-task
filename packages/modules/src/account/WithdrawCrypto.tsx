import { IconInfo } from '@oribet/assets/icons/IconInfo'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { CustomPrimaryButton, CustomInput, CustomSelect, Spinner, fontSize } from '@oribet/ui'
import { TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { INowPaymentsCurrency } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'

interface IWithdrawCrypto {
  coins: INowPaymentsCurrency[]
  selectedCoin: INowPaymentsCurrency | null
  onCoinChange: (code: string) => void
  cryptoWallets: IWallet[]
  selectedWallet: IWallet | null
  onWalletChange: (walletId: string) => void
  coinsLoading: boolean
  address: string
  setAddress: (val: string) => void
  amount: string
  setAmount: (val: string) => void
  extraId: string
  setExtraId: (val: string) => void
  minAmount: number | null
  minAmountLoading: boolean
  validationState: 'idle' | 'validating' | 'valid' | 'invalid'
  validationError: string | null
  fee: { currency: string; fee: number } | null
  feeLoading: boolean
  feeError: string | null
  confirmLoading: boolean
  lastValidated: { address: string; amount: string } | null
  onValidate: () => void
  onConfirm: () => void
}

const WithdrawCrypto = ({
  coins,
  selectedCoin,
  onCoinChange,
  cryptoWallets,
  selectedWallet,
  onWalletChange,
  coinsLoading,
  address,
  setAddress,
  amount,
  setAmount,
  extraId,
  setExtraId,
  minAmount,
  minAmountLoading,
  validationState,
  validationError,
  fee,
  feeLoading,
  feeError,
  confirmLoading,
  lastValidated,
  onValidate,
  onConfirm,
}: IWithdrawCrypto) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()

  const needsRevalidation =
    lastValidated !== null && (address !== lastValidated.address || amount !== lastValidated.amount)

  const showFeeAndConfirm = fee && validationState === 'valid' && !needsRevalidation

  const walletRendererData = () => {
    return cryptoWallets.map((w: IWallet) => ({
      value: String(w.id),
      renderer: () => <ItemName>{w.currency}</ItemName>,
    }))
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

  const showMultipleWallets = cryptoWallets.length > 1

  const validateDisabled =
    !address ||
    !amount ||
    Number(amount) <= 0 ||
    validationState === 'validating' ||
    (minAmount !== null && Number(amount) < minAmount)

  return (
    <Root $isMobile={isMobile}>
      {!isMobile && (
        <Header>
          <IconWithdraw size={20} />
          <span>{t('account.withdrawCrypto')}</span>
        </Header>
      )}
      {!isMobile && <Divider />}

      <SelectContainer $isMobile={isMobile}>
        {showMultipleWallets ? (
          <CustomSelect
            onChange={event => onWalletChange(event.target.value)}
            value={selectedWallet ? String(selectedWallet.id) : ''}
            label={t('wallet.wallet')}
            data={walletRendererData()}
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.wallet}
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
        {coinsLoading ? (
          <LoadingContainer>
            <Spinner color={theme.colors.accent.brand} />
          </LoadingContainer>
        ) : (
          <CustomSelect
            onChange={event => onCoinChange(event.target.value)}
            value={selectedCoin?.code || ''}
            label={t('wallet.coin')}
            data={coinRendererData()}
            searchable
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.coin}
          />
        )}
      </SelectContainer>

      {selectedCoin && (
        <FormSection $isMobile={isMobile}>
          <CustomInput
            label={t('wallet.withdrawalAddress')}
            placeholder={t('wallet.enterAddress')}
            value={address}
            onChange={e => setAddress(e.target.value)}
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.address}
          />

          {selectedCoin.extra_id_exists && (
            <CustomInput
              label={t('withdrawCrypto.extraId')}
              placeholder={t('withdrawCrypto.extraId')}
              value={extraId}
              onChange={e => setExtraId(e.target.value)}
              testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.extraId}
            />
          )}

          <CustomInput
            label={`${t('wallet.amount')} (${selectedCoin.ticker.toUpperCase()})`}
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.amount}
          />

          {minAmountLoading ? (
            <LoadingContainer>
              <Spinner size={16} color={theme.colors.accent.brand} />
            </LoadingContainer>
          ) : (
            minAmount !== null && (
              <InfoBox>
                <InfoRow>
                  <IconInfo
                    size={16}
                    style={{ color: theme.colors.accent.primary, flexShrink: 0 }}
                  />
                  <InfoDetails>
                    <InfoMainRow>
                      <InfoLabel>{t('withdrawCrypto.minimumWithdrawal')}</InfoLabel>
                      <InfoValue>
                        {minAmount} {selectedCoin.ticker.toUpperCase()}
                      </InfoValue>
                    </InfoMainRow>
                  </InfoDetails>
                </InfoRow>
              </InfoBox>
            )
          )}

          {validationError && <ErrorText>{validationError}</ErrorText>}

          {needsRevalidation && (
            <RevalidationText>{t('withdrawCrypto.revalidationNeeded')}</RevalidationText>
          )}

          <CustomPrimaryButton
            onClick={onValidate}
            disabled={validateDisabled}
            loading={validationState === 'validating'}
            fullWidth="100%"
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.validate}
          >
            {t('withdrawCrypto.validate')}
          </CustomPrimaryButton>

          {feeLoading && (
            <LoadingContainer>
              <Spinner size={16} color={theme.colors.accent.brand} />
            </LoadingContainer>
          )}

          {feeError && <ErrorText>{feeError}</ErrorText>}

          {showFeeAndConfirm && (
            <>
              <InfoBox>
                <InfoRow>
                  <IconInfo
                    size={16}
                    style={{ color: theme.colors.accent.primary, flexShrink: 0 }}
                  />
                  <InfoDetails>
                    <InfoMainRow>
                      <InfoLabel>{t('withdrawCrypto.fee')}</InfoLabel>
                      <InfoValue>
                        {fee.fee} {fee.currency.toUpperCase()}
                      </InfoValue>
                    </InfoMainRow>
                  </InfoDetails>
                </InfoRow>
              </InfoBox>

              <CustomPrimaryButton
                onClick={onConfirm}
                disabled={confirmLoading}
                loading={confirmLoading}
                fullWidth="100%"
                testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.confirm}
              >
                {t('withdrawCrypto.confirmWithdrawal')}
              </CustomPrimaryButton>
            </>
          )}
        </FormSection>
      )}

      {!selectedCoin && !coinsLoading && (
        <SelectPrompt>
          <SelectCurrencyText>{t('withdrawCrypto.selectCoin')}</SelectCurrencyText>
        </SelectPrompt>
      )}
    </Root>
  )
}

export default WithdrawCrypto

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

const FormSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0 8px 16px' : '0 16px 16px')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 8px;
  padding: 12px;
`

const InfoRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`

const InfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const InfoMainRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 16px;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${fontSize.sm};
  font-weight: 500;
  padding-left: 16px;
`

const RevalidationText = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
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
