import DepositFiat from '../DepositFiat'
import { useState } from 'react'
import { ICurrency } from '@oribet/core/types/common.type'

interface DepositContainerProps {
  hideHeader?: boolean
}

const DepositFiatContainer = ({ hideHeader }: DepositContainerProps) => {
  const [currencies] = useState<ICurrency[]>([{ name: 'EUR', logo: '', networks_id: [] }])
  const [selectedCurrency] = useState<ICurrency | null>(currencies[0])
  const [amount, setAmount] = useState<number | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [hasTag, setHasTag] = useState<string | null>(null)

  return (
    <DepositFiat
      amount={amount}
      hasTag={hasTag}
      address={address}
      setAmount={setAmount}
      setHasTag={setHasTag}
      currencies={currencies}
      hideHeader={hideHeader}
      setAddress={setAddress}
      selectedCurrency={selectedCurrency}
    />
  )
}

export default DepositFiatContainer
