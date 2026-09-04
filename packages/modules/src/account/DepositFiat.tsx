import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { depositFiat } from '@oribet/core/api/services/Interkasa'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { LogoApplePay } from '@oribet/assets/logos/LogoApplePay'
import { LogoGooglePayWhite } from '@oribet/assets/logos/LogoGooglePayWhite'
import { LogoMasterCard } from '@oribet/assets/logos/LogoMasterCard'
import { LogoVisa } from '@oribet/assets/logos/LogoVisa'
import { CustomPrimaryButton, CustomInput, CustomSelect } from '@oribet/ui'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { ICurrency } from '@oribet/core/types/common.type'
import * as yup from 'yup'
import { fontSize, media } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

type PaymentMethod = 'mastercard' | 'visa' | 'gpaym' | 'apaym'

interface IDeposit {
  currencies: ICurrency[]
  selectedCurrency: ICurrency | null
  address: string | null
  hasTag: string | null
  setHasTag: (hasTag: string | null) => void
  setAddress: any
  hideHeader?: boolean
  amount: number | null
  setAmount: (amount: number) => void
}

const DepositFiat = ({ amount, setAmount, hideHeader, currencies, selectedCurrency }: IDeposit) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mastercard')

  const [loading, setLoading] = useState<boolean>(false)

  const validationSchema = yup.object({
    amount: yup
      .number()
      .required(t('settings.fillAllFields'))
      .positive(t('wallet.moreThanZero'))
      .min(10, t('wallet.minAmountText')),
    selectedPayment: yup.string().required(t('settings.fillAllFields')),
  })

  const currencyRendererData = () => {
    return currencies.map((item: ICurrency) => {
      return {
        ...item,
        value: item.name,
        renderer: () => (
          <CurrencyItem>
            {item.logo && (
              <img
                src={resolveImageUrl(item.logo)}
                alt={item.name}
                width={'24px'}
                height={'24px'}
              />
            )}
            <ItemName>{item.name}</ItemName>
          </CurrencyItem>
        ),
      }
    })
  }

  const onFillAmount = (value: number) => setAmount(value)
  const onSelectPayment = (value: PaymentMethod) => setSelectedPayment(value)

  const renderMoneyComponent = () => (
    <MoneyComponentContainer>
      <PriceContainer
        $isSelected={amount === 50}
        onClick={() => onFillAmount(50)}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.amountChip}.50`}
      >
        <h5>50 EUR</h5>
      </PriceContainer>
      <PriceContainer
        $isSelected={amount === 100}
        onClick={() => onFillAmount(100)}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.amountChip}.100`}
      >
        <h5>100 EUR</h5>
      </PriceContainer>
      <PriceContainer
        $isSelected={amount === 250}
        onClick={() => onFillAmount(250)}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.amountChip}.250`}
      >
        <h5>250 EUR</h5>
      </PriceContainer>
      <PriceContainer
        $isSelected={amount === 500}
        onClick={() => onFillAmount(500)}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.amountChip}.500`}
      >
        <h5>500 EUR</h5>
      </PriceContainer>
    </MoneyComponentContainer>
  )

  const renderPaymentMethodComponent = (selectedPayment: PaymentMethod) => (
    <MoneyComponentContainer>
      <PaymentContainer
        $isSelected={selectedPayment === 'mastercard'}
        onClick={() => onSelectPayment('mastercard')}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.methodCard}.mastercard`}
      >
        <LogoMasterCard style={{ color: theme.colors.text.primary }} />
      </PaymentContainer>

      <PaymentContainer
        $isSelected={selectedPayment === 'visa'}
        onClick={() => onSelectPayment('visa')}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.methodCard}.visa`}
      >
        <LogoVisa style={{ color: theme.colors.text.primary }} />
      </PaymentContainer>

      <PaymentContainer
        $isSelected={selectedPayment === 'apaym'}
        onClick={() => onSelectPayment('apaym')}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.methodCard}.applepay`}
      >
        <LogoApplePay style={{ color: theme.colors.text.primary }} />
      </PaymentContainer>

      <PaymentContainer
        $isSelected={selectedPayment === 'gpaym'}
        onClick={() => onSelectPayment('gpaym')}
        data-testid={`${DEPOSIT_TEST_IDS.fiat.methodCard}.googlepay`}
      >
        <LogoGooglePayWhite style={{ color: theme.colors.text.primary }} />
      </PaymentContainer>
    </MoneyComponentContainer>
  )

  const validateForm = async (values: {
    amount: number | null
    selectedPayment: string
  }): Promise<boolean> => {
    try {
      await validationSchema.validate(values, { abortEarly: false })
      return true
    } catch (err: any) {
      const validationErrors: { amount?: string; selectedPayment?: string } = {}
      err.inner.forEach((error: yup.ValidationError) => {
        validationErrors[error.path as keyof typeof validationErrors] = error.message
      })

      if (validationErrors.amount) {
        enqueueSnackbar(validationErrors.amount, {
          variant: 'error',
        })
      }
      return false
    }
  }

  const onSubmit = async () => {
    const isValid = await validateForm({
      amount: Number(amount),
      selectedPayment,
    })

    if (isValid) {
      setLoading(true)
      try {
        const response = await depositFiat({
          ik_payment_method: selectedPayment,
          ik_am: amount,
        })

        if (response.data.success) {
          window.location.href = response.data.data.url
        }
      } catch (error: any) {
        enqueueSnackbar(t(extractApiError(error)), {
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Root $isMobile={isMobile} $hideHeader={hideHeader}>
      {!isMobile && !hideHeader && (
        <Header>
          <IconDeposit size={20} />
          <span>{t('interkasa.depositFiat')}</span>
        </Header>
      )}
      {!isMobile && !hideHeader && <Divider />}

      <div>
        <InputSection $isMobile={isMobile}>
          <GridContainer>
            <AmountInputWrapper>
              <CustomInput
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setAmount(Number(event.target.value))
                }
                label={t('wallet.amount')}
                type={'number'}
                value={amount ? amount : ''}
                placeholder={'0.00'}
                testId={DEPOSIT_TEST_IDS.fiat.amount}
              />
            </AmountInputWrapper>

            <CurrencySelectWrapper>
              {currencies && (
                <CustomSelect
                  onChange={() => {}}
                  value={selectedCurrency?.name || ''}
                  label={t('wallet.currency')}
                  data={currencyRendererData()}
                  testId={DEPOSIT_TEST_IDS.fiat.currency}
                />
              )}
            </CurrencySelectWrapper>
          </GridContainer>

          {renderMoneyComponent()}
        </InputSection>

        <Divider />

        <PaymentSection $isMobile={isMobile}>
          <PaymentMethodText>{t('wallet.paymentMethod')}</PaymentMethodText>
          {renderPaymentMethodComponent(selectedPayment)}
        </PaymentSection>

        <Divider />

        <SubmitSection $isMobile={isMobile}>
          <CustomPrimaryButton
            style={{
              textTransform: 'uppercase',
              width: isMobile ? '100%' : '',
            }}
            disabled={loading}
            loading={loading}
            onClick={onSubmit}
            fullWidth={isMobile ? '100%' : 'auto'}
            testId={DEPOSIT_TEST_IDS.fiat.submit}
          >
            {t('wallet.proceedToPayment')}
          </CustomPrimaryButton>
        </SubmitSection>
      </div>
    </Root>
  )
}

export default DepositFiat

const Root = styled.div<{ $isMobile: boolean; $hideHeader?: boolean }>`
  ${({ $hideHeader, $isMobile, theme }) => {
    if ($hideHeader) {
      return `
        height: 100%;
        overflow: scroll;
        border: none;
      `
    }
    if ($isMobile) {
      return `
        width: 100%;
        box-sizing: border-box;
        background: ${theme.colors.bg.secondary};
        overflow-y: auto;
        height: calc(100% - env(safe-area-inset-bottom));
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

const InputSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px 8px 0px 8px' : '16px 16px 0px 16px')};
`

const GridContainer = styled.div`
  display: flex;
  gap: 24px;
`

const AmountInputWrapper = styled.div`
  flex: 2;

  ${media.sm} {
    flex: 2;
  }
`

const CurrencySelectWrapper = styled.div`
  flex: 1;

  ${media.sm} {
    flex: 1;
  }
`

const CurrencyItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 24px;
`

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.base};
  line-height: 16px;
`

const MoneyComponentContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 16px;
`

const PriceContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 25%;
  gap: 4px;
  height: 32px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-sizing: border-box;
  cursor: pointer;
  transition: border 0.3s ease-in-out;
  border: ${({ $isSelected, theme }) =>
    $isSelected ? `1px solid ${theme.colors.accent.brand}` : '1px solid transparent'};

  & h5 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 700;
    font-size: ${fontSize.lg};
    margin: 0;

    ${media.md} {
      font-size: ${fontSize.base};
    }
  }
`

const PaymentContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 25%;
  gap: 4px;
  height: 48px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 4px;
  padding-top: 14px;
  padding-bottom: 14px;
  box-sizing: border-box;
  cursor: pointer;
  transition: border 0.3s ease-in-out;
  border: ${({ $isSelected, theme }) =>
    $isSelected ? `1px solid ${theme.colors.accent.brand}` : '1px solid transparent'};

  ${media.md} {
    & svg {
      width: 45px;
    }
  }
`

const PaymentSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0px 8px 16px 8px' : '0px 16px')};
`

const PaymentMethodText = styled.h6`
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: 24px;
  margin-top: 16px;
  margin-left: 16px;
`

const SubmitSection = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px 8px' : '16px')};
  justify-content: start;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  box-shadow: ${({ $isMobile }) => ($isMobile ? 'rgba(0, 0, 0, 0.55) 0px -7px 9px 0px' : 'none')};
`
