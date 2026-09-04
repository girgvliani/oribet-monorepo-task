import Transaction from '../Transaction'
import useFetchTransactions from '@oribet/core/hooks/socket/useFetchTransactions'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const TAB_TYPE_MAP: Record<number, string | undefined> = {
  0: undefined,
  1: 'deposit',
  2: 'withdrawal',
}

const TYPE_TO_TAB: Record<string, number> = {
  deposit: 1,
  withdrawal: 2,
}

const TransactionContainer = () => {
  const [searchParams] = useSearchParams()
  const initialTab = TYPE_TO_TAB[searchParams.get('tab') ?? ''] ?? 0

  const [page, setPage] = useState(1)
  const [activeTransactionIndex, setActiveTransactionIndex] = useState(initialTab)

  const type = TAB_TYPE_MAP[activeTransactionIndex]
  const { data, isLoading } = useFetchTransactions(page, type)

  const handleTabChange = (index: number) => {
    setActiveTransactionIndex(index)
    setPage(1)
  }

  return (
    <Transaction
      loading={isLoading}
      data={data?.data ?? []}
      totalItems={data?.meta?.total ?? 0}
      currentPage={page}
      onPageChange={setPage}
      activeTransactionIndex={activeTransactionIndex}
      setActiveTransactionIndex={handleTabChange}
    />
  )
}

export default TransactionContainer
