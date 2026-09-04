import instance from '../axios'

export interface CreateCashierSessionParams {
  wallet_id: number
  currency: string
}

export const createCashierSession = (params: CreateCashierSessionParams) => {
  return instance.post('/transactions/deposit', { ...params, amount: 0 })
}

export interface AgentPayDepositParams {
  wallet_id: number
  currency: string
  amount: number
}

export const depositAgentPay = (params: AgentPayDepositParams) => {
  return instance.post('/transactions/deposit', { ...params, provider: 'agentpay' })
}

export interface AgentPayWithdrawParams {
  wallet_id: number
}

export const withdrawAgentPay = (params: AgentPayWithdrawParams) => {
  return instance.post('/transactions/withdraw', { ...params, provider: 'agentpay' })
}
