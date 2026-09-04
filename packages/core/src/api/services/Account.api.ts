import instance from '../axios'

export const getCurrencyList = () => {
  return instance.get('/currency')
}

/** Bootstrap the cashier for a wallet — called when the wallet/deposit modal opens. */
export const cashierInit = (body: { wallet_id: number }) => {
  return instance.post('/cashier/init', body)
}

/**
 * Update the active cashier session. Send ONLY the field(s) being changed — the session is
 * identified by `payment_session_id` alone, so callers must not re-send `wallet_id` / `type` /
 * `bonus_ids` / unchanged fields (e.g. an address update sends just `{ payment_session_id, address }`).
 */
export const updateCashierSession = (body: {
  payment_session_id: string
  wallet_id?: number
  type?: string
  provider?: string
  currency?: string
  bonus_ids?: number[]
  amounts?: unknown
  /** Destination address for crypto withdrawals. */
  address?: string
  /** Destination tag/memo for crypto withdrawals (coins with requires_tag). */
  tag?: string
}) => {
  return instance.post('/cashier/session/update', body)
}

/**
 * Quote a crypto deposit conversion. Send exactly one of `amount_to_send` /
 * `amount_to_receive` — the other side is computed and returned.
 */
export const cashierQuote = (body: {
  payment_session_id: string
  amount_to_send?: number
  amount_to_receive?: number
}) => {
  return instance.post('/cashier/quote', body)
}

/**
 * Initialise a transaction for the active cashier session. The amounts must already be
 * locked on the session (via `/cashier/quote`) — this endpoint reads them from there.
 */
export const transactionsInit = (body: {
  payment_session_id: string
  /** Destination address for crypto withdrawals. */
  address?: string
}) => {
  return instance.post('/transactions/init', body)
}

/** Cashier deposit currencies (crypto + fiat), grouped by `group_name`, one entry per network. */
export const getDepositCurrencies = () => {
  return instance.get('/cashier/currencies/deposit')
}

/**
 * Cashier deposit quote — returns the deposit address + converted amount for the chosen
 * currency/provider. Response shape TBD; wired to the address step (logged) for now.
 */
export const createDepositQuote = (body: {
  wallet_id: number
  deposit_currency: string
  amount: number
  provider: string
  bonus_ids?: number[]
}) => {
  return instance.post('/cashier/deposit/quote', { bonus_ids: [], ...body })
}

export const getNetworkList = () => {
  return instance.get('/network')
}

export const getNowPaymentsCurrencies = async () => {
  const response = await instance.get('/nowpayments/currencies')
  return response.data
}

export const getNowPaymentsEstimate = async (params: { pay_currency: string; amount: number }) => {
  const response = await instance.get('/nowpayments/estimate', { params })
  return response.data
}

export const createNowPayment = async (params: {
  currency: string
  wallet_id: number
  amount: number
}) => {
  const response = await instance.post('/transactions/deposit', params)
  return response.data
}

export const getNowPaymentsPayoutMinAmount = async (coinCode: string) => {
  const response = await instance.get(`/nowpayments/payout/min-amount/${coinCode}`)
  return response.data
}

export const validateNowPaymentsPayoutAddress = async (params: {
  address: string
  currency: string
  extra_id: string | null
}) => {
  const response = await instance.post('/nowpayments/payout/validate-address', params)
  return response.data
}

export const getNowPaymentsPayoutFee = async (params: { currency: string; amount: number }) => {
  const response = await instance.get('/nowpayments/payout/fee', { params })
  return response.data
}

export const createNowPaymentsPayout = async (params: {
  currency: string
  amount: number
  address: string
  wallet_id: number
  extra_id: string | null
}) => {
  const response = await instance.post('/transactions/withdraw', params)
  return response.data
}

export const getWallet = (coinId: string) => {
  return instance.get(`/currency/get_wallets/${coinId}`)
}

export const calculateFee = (params: any) => {
  return instance.get(`/transactions/withdraw/calculate`, {
    params,
  })
}

export const withdraw = (params: any) => {
  return instance.post(`/transactions/withdraw`, {
    ...params,
  })
}

export const getChangellyCurrencies = async () => {
  const response = await instance.get('/changelly/currencies', { params: { type: 'fiat' } })
  return response.data
}

export const getChangellyOffers = (params: any) => {
  return instance.post('/changelly/offers', {
    ...params,
  })
}

export const createOrder = (params: any) => {
  return instance.post('/changelly/create_order', {
    ...params,
  })
}

export const getTransactions = (params: { page: number; per_page: number; type?: string }) => {
  return instance.get('/transactions', { params })
}

/** Pending withdrawal requests that are separate from the normal transaction history. */
export const getWithdrawalRequests = () => {
  return instance.get('/transactions/withdraw')
}

/** Cancel a pending withdrawal request that has not entered normal transaction history. */
export const cancelWithdrawalRequest = (withdrawRequestId: number) => {
  return instance.post('/transactions/withdraw/cancel', { withdraw_request_id: withdrawRequestId })
}

/** Cancel a still-pending deposit transaction (rows with `cancelable: true`, type deposit). */
export const cancelDepositTransaction = (transactionId: number) => {
  return instance.post('/transactions/deposit/cancel', { transaction_id: transactionId })
}

/** Cancel a still-pending withdrawal transaction (rows with `cancelable: true`, type withdraw). */
export const cancelWithdrawTransaction = (transactionId: number) => {
  return instance.post('/transactions/withdraw/cancel', { transaction_id: transactionId })
}
