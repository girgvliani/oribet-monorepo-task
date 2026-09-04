import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { IconInfo } from '@oribet/assets/icons/IconInfo'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { CustomPrimaryButton, CustomInput, CustomSelect, Spinner, fontSize } from '@oribet/ui'
import { TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'
import { CurrenciesNameWithMemo } from '@oribet/core/util/appUtil'
import { ChangeEvent } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { ICurrency, ICurrencyNetworksId, INetwork } from '@oribet/core/types/common.type'

interface IWithdraw {
  currencies: ICurrency[]
  network: INetwork[]
  selectedCurrency: ICurrency | null
  selectedNetwork: INetwork | null
  address: string | null
  setAddress: (address: string | null) => void
  amount: string | null
  setAmount: (amount: string | null) => void
  fee: {
    total_withdraw_amount: string
    withdraw_amount: string
    fee: string
  } | null
  memo: string | null
  setMemo: (memo: string | null) => void
  feeLoading: boolean
  getFilteredNetworks: any
  setSelectedNetwork: any
  setSelectedCurrency: any
  confirmLoading: boolean
  onConfirm: () => void
  getFeeResult: () => void
}

const Withdraw = ({
  network,
  currencies,
  selectedNetwork,
  selectedCurrency,
  getFilteredNetworks,
  setSelectedNetwork,
  setSelectedCurrency,
  amount,
  setAmount,
  setAddress,
  fee,
  feeLoading,
  memo,
  setMemo,
  address,
  onConfirm,
  confirmLoading,
  getFeeResult,
}: IWithdraw) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()

  const networkRendererData = () => {
    if (selectedCurrency) {
      return getFilteredNetworks(selectedCurrency, network).map((item: INetwork) => {
        return {
          ...item,
          value: item.id,
          renderer: () => <ItemName>{item.name}</ItemName>,
        }
      })
    }

    return []
  }

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

  const onChangeNetwork = (value: string): void => {
    const findNetwork: INetwork | undefined = network.find(
      (item: INetwork) => item.id === Number(value)
    )
    if (findNetwork) {
      setSelectedNetwork({ ...findNetwork })
      setMemo(null)
    }
  }

  const onChangeCurrency = (value: string): void => {
    const findCurrency: ICurrency | undefined = currencies.find(
      (item: ICurrency) => item.name === value
    )
    if (findCurrency) {
      setSelectedNetwork(null)
      setSelectedCurrency(findCurrency)
      setMemo(null)
    }
  }

  const getMinimumAmount = () => {
    if (selectedCurrency && selectedNetwork) {
      return selectedCurrency.networks_id.find(
        (item: ICurrencyNetworksId) => item.coin_network_id === selectedNetwork.id
      )?.min_amount_usd
    }

    return ''
  }

  const onConfirmDisable = () => {
    return (
      !(selectedCurrency && selectedNetwork && fee && address) ||
      Boolean(fee && amount && Number(fee.fee) + Number(getMinimumAmount()) > Number(amount))
    )
  }

  const onSelectNetworkAuto = (value: string) => {
    const findCurrency: ICurrency | undefined = currencies.find(
      (item: ICurrency) => item.name === value
    )

    const networks = getFilteredNetworks(findCurrency, network).map((item: INetwork) => {
      return {
        ...item,
        value: item.id,
        renderer: () => <ItemName>{item.name}</ItemName>,
      }
    })

    if (networks && networks.length > 0) {
      onChangeNetwork(String(networks[0].value))
    }
  }

  return (
    <Root $isMobile={isMobile}>
      {!isMobile && (
        <Header>
          <IconWithdraw size={20} />
          <span>{t('account.withdraw')}</span>
        </Header>
      )}
      {!isMobile && <Divider />}
      <Content $isMobile={isMobile}>
        <SelectRow $isMobile={isMobile}>
          {currencies && (
            <CustomSelect
              onChange={event => {
                onChangeCurrency(event.target.value)
                onSelectNetworkAuto(event.target.value)
              }}
              value={selectedCurrency?.name || ''}
              label={t('wallet.currency')}
              data={currencyRendererData()}
              testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.currency}
            />
          )}

          {network && (
            <CustomSelect
              onChange={event => onChangeNetwork(event.target.value)}
              value={selectedNetwork ? String(selectedNetwork?.id) : ''}
              label={t('wallet.network')}
              data={networkRendererData()}
              testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.network}
            />
          )}
        </SelectRow>
        {selectedNetwork &&
          selectedCurrency &&
          CurrenciesNameWithMemo.includes(selectedCurrency.name) && (
            <MemoRow>
              <CustomInput
                onChange={(event: ChangeEvent<HTMLInputElement>) => setMemo(event.target.value)}
                label={t('wallet.memo')}
                placeholder={t('wallet.memo')}
                defaultValue={memo ? memo : ''}
                testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.memo}
              />
            </MemoRow>
          )}
        {selectedCurrency && selectedNetwork && (
          <MinimumAmountContainer>
            <MinimumAmountInfo>
              <IconInfo size={16} style={{ color: theme.colors.accent.primary }} />
              <MinimumAmountValue>{getMinimumAmount()}</MinimumAmountValue>
              <MinimumAmountLabel>{t('wallet.minimumWithdraw')}</MinimumAmountLabel>
            </MinimumAmountInfo>
            {!isMobile && (
              <MinimumAmountDescription>
                {t('wallet.minimumWithdrawDescription')}
              </MinimumAmountDescription>
            )}
          </MinimumAmountContainer>
        )}

        <InputRow $isMobile={isMobile}>
          <CustomInput
            onChange={(event: ChangeEvent<HTMLInputElement>) => setAddress(event.target.value)}
            label={t('wallet.withdrawalAddress')}
            placeholder={t('wallet.enterAddress')}
            onBlur={() => amount && getFeeResult()}
            testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.address}
          />
          <CustomInput
            onChange={event => setAmount(event.target.value)}
            label={t('wallet.amount')}
            type={'text'}
            value={amount}
            placeholder={'0.00'}
            testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.amount}
          />
        </InputRow>

        <CalculationContainer $isMobile={isMobile}>
          <CalculationItem $isMobile={isMobile}>
            <CalculationHeaderText>{t('wallet.withdrawAmount')}</CalculationHeaderText>
            <CalculationBodyText>
              {feeLoading ? (
                <Spinner size={12} color={theme.colors.accent.brand} />
              ) : fee?.fee && fee?.total_withdraw_amount ? (
                Number(fee?.withdraw_amount)
              ) : (
                ''
              )}
            </CalculationBodyText>
          </CalculationItem>
          <CalculationItem $isMobile={isMobile}>
            <CalculationHeaderText>{t('wallet.fee')}</CalculationHeaderText>
            <CalculationBodyText>
              {feeLoading ? <Spinner size={12} color={theme.colors.accent.brand} /> : fee?.fee}
            </CalculationBodyText>
          </CalculationItem>
          <CalculationItem $isMobile={isMobile}>
            <CalculationHeaderText>{t('wallet.totalWithdraw')}</CalculationHeaderText>
            <CalculationBodyText>
              {feeLoading ? (
                <Spinner size={12} color={theme.colors.accent.brand} />
              ) : (
                fee?.total_withdraw_amount
              )}
            </CalculationBodyText>
          </CalculationItem>
        </CalculationContainer>
        <SubmitRow>
          <CustomPrimaryButton
            style={{
              textTransform: 'uppercase',
              width: isMobile ? '100%' : '',
            }}
            disabled={onConfirmDisable()}
            onClick={onConfirm}
            loading={confirmLoading}
            fullWidth={isMobile ? '100%' : 'auto'}
            testId={TRANSACTIONS_TEST_IDS.withdraw.fiat.confirm}
          >
            {t('common.confirm')}
          </CustomPrimaryButton>
        </SubmitRow>
      </Content>
    </Root>
  )
}

export default Withdraw

const Root = styled.div<{ $isMobile: boolean }>`
  ${({ $isMobile, theme }) =>
    $isMobile
      ? `
        width: 100%;
        box-sizing: border-box;
        background: ${theme.colors.bg.secondary};
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

const Content = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px 8px' : '16px')};
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SelectRow = styled.div<{ $isMobile: boolean }>`
  gap: 24px;
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`

const MemoRow = styled.div`
  gap: 24px;
  display: flex;
`

const InputRow = styled.div<{ $isMobile: boolean }>`
  gap: 24px;
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
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

const MinimumAmountContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MinimumAmountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const MinimumAmountValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.lg};
  line-height: 16px;
`

const MinimumAmountLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const MinimumAmountDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const CalculationContainer = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 16px;
  border-radius: 8px;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`

const CalculationItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'row' : 'column')};
  flex: 1;
  justify-content: space-between;
  width: 100%;
`

const CalculationHeaderText = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
  text-transform: uppercase;
`

const CalculationBodyText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.lg};
  line-height: 24px;
  height: 24px;
`

const SubmitRow = styled.div`
  display: flex;
  width: 100%;
`
