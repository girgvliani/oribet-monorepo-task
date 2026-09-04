import { IconTransaction } from '@oribet/assets/icons/IconTransaction'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { OribetPagination, fontSize } from '@oribet/ui'
import { TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import styled, { useTheme } from 'styled-components'
import { ITransaction } from '@oribet/core/types/common.type'

interface ITransactionProps {
  loading: boolean
  data: ITransaction[]
  totalItems: number
  currentPage: number
  onPageChange: (page: number) => void
  activeTransactionIndex: number
  setActiveTransactionIndex: (index: number) => void
}

const ROWS_PER_PAGE = 6

const Transaction = ({
  loading,
  data,
  totalItems,
  currentPage,
  onPageChange,
  activeTransactionIndex,
  setActiveTransactionIndex,
}: ITransactionProps) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()
  const tableHeader = isMobile
    ? ['wallet.type', 'wallet.amount']
    : ['wallet.type', 'wallet.amount', 'wallet.time']
  const transactionTypes = ['wallet.all', 'wallet.deposits', 'wallet.withdrawals']

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      deposit: t('account.deposit'),
      manual_deposit: t('wallet.manualDeposit'),
      withdrawal: t('account.withdraw'),
      manual_withdrawal: t('wallet.manualWithdrawal'),
    }
    return map[type] ?? type
  }

  return (
    <Root $isMobile={isMobile}>
      {!isMobile && (
        <Header>
          <HeaderLeft>
            <IconTransaction size={20} />
            <span>{t('account.transactions')}</span>
          </HeaderLeft>
          <TransactionTypes>
            {transactionTypes.map((type, index) => (
              <TransactionTypeButton
                key={index}
                onClick={() => setActiveTransactionIndex(index)}
                $isActive={activeTransactionIndex === index}
                data-testid={`${TRANSACTIONS_TEST_IDS.filters.type}.${type.split('.').pop()}`}
              >
                {t(type)}
              </TransactionTypeButton>
            ))}
          </TransactionTypes>
        </Header>
      )}
      {isMobile && (
        <TabsMobile>
          <TabMobile
            $isActive={activeTransactionIndex === 0}
            onClick={() => setActiveTransactionIndex(0)}
            data-testid={`${TRANSACTIONS_TEST_IDS.filters.type}.all`}
          >
            {t('wallet.all')}
          </TabMobile>
          <TabMobile
            $isActive={activeTransactionIndex === 1}
            onClick={() => setActiveTransactionIndex(1)}
            data-testid={`${TRANSACTIONS_TEST_IDS.filters.type}.deposits`}
          >
            {t('wallet.deposits')}
          </TabMobile>
          <TabMobile
            $isActive={activeTransactionIndex === 2}
            onClick={() => setActiveTransactionIndex(2)}
            data-testid={`${TRANSACTIONS_TEST_IDS.filters.type}.withdrawals`}
          >
            {t('wallet.withdrawals')}
          </TabMobile>
        </TabsMobile>
      )}
      {!isMobile && <Divider />}
      <Content $isMobile={isMobile}>
        {!isMobile && (
          <TableHeader>
            {tableHeader.map((header: string, index: number) => {
              return <TableHeaderCell key={index}>{t(header)}</TableHeaderCell>
            })}
          </TableHeader>
        )}
        <TableBody>
          {!loading && data.length === 0 && (
            <NoResultContainer>
              <span
                style={{
                  color: theme.colors.text.primary,
                  fontSize: fontSize.base,
                  fontWeight: 600,
                  lineHeight: '24px',
                }}
              >
                {t('wallet.noTransactionsYet')}
              </span>
              <span
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: fontSize.base,
                  fontWeight: 600,
                  lineHeight: '24px',
                }}
              >
                {t('wallet.emptyTransactions')}
              </span>
            </NoResultContainer>
          )}
          {data.map((row, index) => (
            <Row key={index}>
              <RowCell>
                <IconWithdraw size={20} />
                <span>{typeLabel(row.type)}</span>
              </RowCell>
              <RowCell>
                <span>
                  {row.amount} {row.currency}
                </span>
              </RowCell>
              {!isMobile && (
                <RowCell>
                  <TimeText>{moment(row.create_dt).format('YYYY-MM-DD HH:mm:ss')}</TimeText>
                </RowCell>
              )}
            </Row>
          ))}
        </TableBody>
        <div>
          <OribetPagination
            onPageChange={onPageChange}
            initialPage={currentPage}
            rowsPerPage={ROWS_PER_PAGE}
            totalAmount={totalItems}
            testId={TRANSACTIONS_TEST_IDS.history.pagination}
          />
        </div>
      </Content>
    </Root>
  )
}

export default Transaction

const Root = styled.div<{ $isMobile: boolean }>`
  ${({ $isMobile, theme }) =>
    $isMobile
      ? `
        width: 100%;
        box-sizing: border-box;
        background: ${theme.colors.bg.secondary};
        padding: 16px 8px;
        overflow-y: auto;
        height: ${window.innerHeight - 150}px;
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
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  color: ${({ theme }) => theme.colors.text.primary};

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
`

const HeaderLeft = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 24px;
`

const TransactionTypes = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const TransactionTypeButton = styled.span<{ $isActive: boolean }>`
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.surface.hover : 'transparent'};
  transition: all 0.3s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const Divider = styled.div`
  background: ${({ theme }) => theme.colors.surface.borderSubtle};
  width: 100%;
  height: 1px;
`

const TabsMobile = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 4px;
  height: 40px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 24px;
`

const TabMobile = styled.div<{ $isActive: boolean }>`
  flex: 1;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: ${({ $isActive }) => ($isActive ? '8px' : '0')};
  border: ${({ $isActive, theme }) =>
    $isActive ? `1px solid ${theme.colors.surface.borderSubtle}` : 'none'};
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.surface.hover : 'transparent')};
`

const Content = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0px' : '16px')};
`

const TableHeader = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 700;
  font-size: ${fontSize.sm};
  line-height: 24px;
  text-transform: uppercase;

  & div:last-child {
    text-align: right;
  }
`

const TableHeaderCell = styled.div`
  flex: 1;
  padding: 8px 16px;
`

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  overflow: auto;
  max-height: 500px;
`

const Row = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  font-size: ${fontSize.base};
  font-weight: 700;
  line-height: 24px;

  & div:last-child {
    justify-content: flex-end;
  }
`

const RowCell = styled.div`
  display: flex;
  flex: 1;
  padding: 12px 16px;
  align-items: center;
  gap: 8px;

  & rect {
    fill: ${({ theme }) => theme.colors.surface.border};
  }
`

const NoResultContainer = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
  flex-direction: column;
`

const TimeText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`
