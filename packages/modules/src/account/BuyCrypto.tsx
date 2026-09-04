import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconInfo } from '@oribet/assets/icons/IconInfo'
import { CustomPrimaryButton, CustomInput, CustomSelect, Spinner, fontSize } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { ChangeEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IChangellyCurrency, IPaymentOffers } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface IBuyCrypto {
  cryptoWallets: IWallet[]
  selectedWallet: IWallet | null
  setSelectedWallet: (wallet: IWallet | null) => void
  currencies: IChangellyCurrency[]
  selectedCurrency: IChangellyCurrency | null
  onCurrencyChange: (currency: IChangellyCurrency | null) => void
  loadingCurrencies: boolean
  amount: number | null
  setAmount: (amount: number) => void
  onGetOffers: () => void
  loadingOffers: boolean
  offers: IPaymentOffers[] | null
  selectedOffer: IPaymentOffers | null
  setSelectedOffer: (offer: IPaymentOffers) => void
  onConfirm: () => void
  confirmLoading: boolean
  limits: { min: number | null; max: number | null }
  hideHeader?: boolean
}

const BuyCrypto = ({
  cryptoWallets,
  selectedWallet,
  setSelectedWallet,
  currencies,
  selectedCurrency,
  onCurrencyChange,
  loadingCurrencies,
  amount,
  setAmount,
  onGetOffers,
  loadingOffers,
  offers,
  selectedOffer,
  setSelectedOffer,
  onConfirm,
  confirmLoading,
  limits,
  hideHeader,
}: IBuyCrypto) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()

  const showMultipleWallets = cryptoWallets.length > 1

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

  const currencyRendererData = () => {
    return currencies.map((c: IChangellyCurrency) => ({
      value: c.ticker,
      searchLabel: `${c.name} ${c.ticker}`,
      renderer: () => (
        <CurrencyItem>
          <CurrencyIcon src={c.iconColoredUrl} alt={c.name} width="24px" height="24px" />
          <CurrencyName>{c.name}</CurrencyName>
          <CurrencyTicker>{c.ticker}</CurrencyTicker>
        </CurrencyItem>
      ),
    }))
  }

  const amountError = useMemo(() => {
    if (!amount || amount <= 0) return null
    if (limits.min !== null && amount < limits.min)
      return `${t('wallet.minLabel')}: ${limits.min} ${selectedCurrency?.ticker ?? ''}`
    if (limits.max !== null && amount > limits.max)
      return `${t('wallet.maxLabel')}: ${limits.max} ${selectedCurrency?.ticker ?? ''}`
    return null
  }, [amount, limits, selectedCurrency, t])

  const isAmountValid = !!amount && amount > 0 && !amountError

  const onChangeCurrency = (ticker: string) => {
    const found = currencies.find(c => c.ticker === ticker)
    onCurrencyChange(found ?? null)
  }

  return (
    <Root $isMobile={isMobile} $hideHeader={hideHeader}>
      {!isMobile && !hideHeader && (
        <Header>
          <HeaderLeft>
            <IconDeposit size={20} />
            <span>{t('account.buyCrypto')}</span>
          </HeaderLeft>
        </Header>
      )}
      {!isMobile && !hideHeader && <Divider />}

      <WalletSection $isMobile={isMobile}>
        {showMultipleWallets ? (
          <CustomSelect
            onChange={event => onChangeWallet(event.target.value)}
            value={selectedWallet ? String(selectedWallet.id) : ''}
            label={t('wallet.wallet')}
            data={walletRendererData()}
            testId={DEPOSIT_TEST_IDS.buyCrypto.wallet}
          />
        ) : (
          selectedWallet && (
            <WalletBadge>
              {t('wallet.wallet')}: {selectedWallet.currency}
            </WalletBadge>
          )
        )}
      </WalletSection>

      <ContentScroll $isMobile={isMobile}>
        <SelectContainer $isMobile={isMobile}>
          {loadingCurrencies ? (
            <LoadingContainer>
              <Spinner color={theme.colors.accent.brand} />
            </LoadingContainer>
          ) : (
            <CustomSelect
              onChange={event => onChangeCurrency(event.target.value)}
              value={selectedCurrency?.ticker || ''}
              label={t('wallet.youSend')}
              data={currencyRendererData()}
              searchable
              testId={DEPOSIT_TEST_IDS.buyCrypto.currency}
            />
          )}
        </SelectContainer>

        {selectedCurrency && (
          <>
            {(limits.min !== null || limits.max !== null) && (
              <LimitsBox>
                <LimitsLeft>
                  <IconInfo size={16} style={{ color: theme.colors.accent.primary }} />
                  {limits.min !== null && (
                    <LimitsText>
                      {t('wallet.minLabel')}: {limits.min} {selectedCurrency.ticker}
                    </LimitsText>
                  )}
                  {limits.max !== null && (
                    <LimitsText>
                      {t('wallet.maxLabel')}: {limits.max} {selectedCurrency.ticker}
                    </LimitsText>
                  )}
                </LimitsLeft>
              </LimitsBox>
            )}

            <AmountRow>
              <CustomInput
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setAmount(Number(event.target.value))
                }
                label={`${t('wallet.amount')} (${selectedCurrency.ticker})`}
                type="number"
                value={amount ? amount : ''}
                placeholder="0.00"
                error={amountError ?? undefined}
                testId={DEPOSIT_TEST_IDS.buyCrypto.amount}
              />
              <GetOffersButtonWrapper>
                <CustomPrimaryButton
                  onClick={onGetOffers}
                  disabled={!isAmountValid}
                  loading={loadingOffers}
                  testId={DEPOSIT_TEST_IDS.buyCrypto.getOffers}
                >
                  {t('wallet.getEstimate')}
                </CustomPrimaryButton>
              </GetOffersButtonWrapper>
            </AmountRow>

            {loadingOffers ? (
              <LoadingContainer>
                <Spinner color={theme.colors.accent.brand} />
              </LoadingContainer>
            ) : (
              offers && (
                <OffersSection>
                  <OffersLabel>{t('wallet.paymentOffers')}</OffersLabel>
                  <OffersGrid $isMobile={isMobile}>
                    {offers.map((offer: IPaymentOffers, index: number) => (
                      <OfferCard
                        key={index}
                        $isSelected={selectedOffer?.providerCode === offer.providerCode}
                        onClick={() => setSelectedOffer(offer)}
                        data-testid={`${DEPOSIT_TEST_IDS.buyCrypto.offer}.${offer.providerCode}`}
                      >
                        <OfferProvider>{offer.providerCode}</OfferProvider>
                        <OfferAmount>{offer.amountExpectedTo}</OfferAmount>
                      </OfferCard>
                    ))}
                  </OffersGrid>
                </OffersSection>
              )
            )}
          </>
        )}

        {!selectedCurrency && !loadingCurrencies && (
          <SelectPrompt>
            <SelectPromptText>{t('wallet.selectCoin')}</SelectPromptText>
          </SelectPrompt>
        )}

        {isMobile && <MobileSpacer />}
      </ContentScroll>

      {offers && (
        <ConfirmSection $isMobile={isMobile}>
          {!isMobile && <Divider />}
          <ConfirmPadding $isMobile={isMobile}>
            <CustomPrimaryButton
              style={{ textTransform: 'uppercase', width: isMobile ? '100%' : '' }}
              disabled={!selectedOffer}
              loading={confirmLoading}
              onClick={onConfirm}
              fullWidth={isMobile ? '100%' : 'auto'}
              testId={DEPOSIT_TEST_IDS.buyCrypto.confirm}
            >
              {t('wallet.confirm')}
            </CustomPrimaryButton>
          </ConfirmPadding>
        </ConfirmSection>
      )}
    </Root>
  )
}

export default BuyCrypto

const Root = styled.div<{ $isMobile: boolean; $hideHeader?: boolean }>`
  ${({ $hideHeader, $isMobile, theme }) => {
    if ($hideHeader) {
      return `
        border: none;
        height: 100%;
        overflow: scroll;
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
  padding: 16px 24px;
  display: flex;
  align-items: center;

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

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

const WalletSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px 8px 0' : '16px 16px 0')};
`

const WalletBadge = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
  text-transform: uppercase;
  padding: 0 16px;
`

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.base};
  line-height: 16px;
`

const ContentScroll = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${({ $isMobile }) => ($isMobile ? '16px 8px' : '16px')};
  gap: 24px;
  min-height: 320px;
`

const SelectContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  z-index: 10;
`

const CurrencyItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 24px;
`

const CurrencyIcon = styled.img`
  border-radius: 50%;
`

const CurrencyName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.base};
  line-height: 16px;
`

const CurrencyTicker = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const LimitsBox = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
`

const LimitsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const LimitsText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const AmountRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`

const GetOffersButtonWrapper = styled.div`
  flex-shrink: 0;
  padding-bottom: 1px;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
`

const SelectPrompt = styled.div`
  margin: 8px 24px 24px 24px;
`

const SelectPromptText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  font-size: ${fontSize.sm};
  line-height: 24px;
`

const OffersSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const OffersLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 24px;
  text-transform: uppercase;
  padding-left: 16px;
  padding-bottom: 8px;
`

const OffersGrid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr' : 'repeat(2, 1fr)')};
  gap: 24px;
`

const OfferCard = styled.div<{ $isSelected: boolean }>`
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid
    ${({ $isSelected, theme }) => ($isSelected ? theme.colors.accent.brand : theme.colors.bg.primary)};
  transition: border-color 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const OfferProvider = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  line-height: 24px;
  font-size: ${fontSize.base};
  text-transform: uppercase;
`

const OfferAmount = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 24px;
`

const MobileSpacer = styled.div`
  height: 60px;
  width: 100%;
`

const ConfirmSection = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'relative')};
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`

const ConfirmPadding = styled.div<{ $isMobile: boolean }>`
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${({ $isMobile }) => ($isMobile ? 'rgb(19 19 19 / 55%) 0px -7px 9px 0px' : 'none')};
`
