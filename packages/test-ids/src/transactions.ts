/**
 * Withdrawals + transaction-history test-id registry.
 *
 * Covers the two withdraw surfaces (WithdrawCrypto = crypto; Withdraw = the
 * currency/network/memo form) and the transaction history (oribet Transaction +
 * oribet-korea TransactionHistorySection): type/status/date filters, pagination,
 * and the korea view-instructions modal. Most elements are runtime-conditional
 * (route/flag/auth gated).
 */
import type { IdNode, TestIdRegistry } from './types'

export const TRANSACTIONS_TEST_IDS = {
  withdraw: {
    /** Crypto withdrawal (WithdrawCrypto). */
    crypto: {
      /** Mobile-wallet "withdraw" launcher. */
      open: 'withdraw.crypto.open',
      wallet: 'withdraw.crypto.wallet',
      coin: 'withdraw.crypto.coin',
      address: 'withdraw.crypto.address',
      extraId: 'withdraw.crypto.extra-id',
      amount: 'withdraw.crypto.amount',
      validate: 'withdraw.crypto.validate',
      confirm: 'withdraw.crypto.confirm',
    },
    /** Currency/network withdrawal form (Withdraw). */
    fiat: {
      currency: 'withdraw.fiat.currency',
      network: 'withdraw.fiat.network',
      memo: 'withdraw.fiat.memo',
      address: 'withdraw.fiat.address',
      amount: 'withdraw.fiat.amount',
      confirm: 'withdraw.fiat.confirm',
    },
    /** Withdraw-method chooser (crypto / agentpay). */
    method: {
      crypto: 'withdraw.method.crypto',
      agentpay: 'withdraw.method.agentpay',
      back: 'withdraw.method.back',
    },
    /** AgentPay withdrawal (wallet select + submit → redirect). */
    agentpay: {
      wallet: 'withdraw.agentpay.wallet',
      submit: 'withdraw.agentpay.submit',
    },
  },
  /** Transaction-history filters. */
  filters: {
    /** Type tab/filter (all / deposits / withdrawals). Collection — `<id>.<key>`. */
    type: 'transactions.filters.type',
    /** Activity-type select (korea). */
    activityType: 'transactions.filters.activity-type',
    /** Status select (korea). */
    status: 'transactions.filters.status',
    dateFrom: 'transactions.filters.date-from',
    dateTo: 'transactions.filters.date-to',
  },
  /** Transaction-history table chrome. */
  history: {
    /** Mobile-wallet "transactions" launcher. */
    open: 'transactions.history.open',
    pagination: 'transactions.history.pagination',
    /** View-instructions link per row (korea). Collection — `<id>.<txid>`. */
    viewInstructions: 'transactions.history.view-instructions',
    /** Close the instructions modal (korea). */
    instructionsClose: 'transactions.history.instructions-close',
    /** Cancel a pending transaction (per row). Collection — `<id>.<transactionId>`. */
    cancel: 'transactions.history.cancel',
    /** Cancel-confirm modal: confirm. */
    cancelConfirm: 'transactions.history.cancel-confirm',
    /** Cancel-confirm modal: dismiss. */
    cancelDismiss: 'transactions.history.cancel-dismiss',
  },
} as const

const T = TRANSACTIONS_TEST_IDS

export const TRANSACTIONS_STRUCTURE: IdNode[] = [
  // Crypto withdraw.
  {
    id: T.withdraw.crypto.open,
    role: 'link',
    label: 'Withdraw (mobile launcher)',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.wallet,
    role: 'combobox',
    label: 'Withdraw crypto: wallet',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.coin,
    role: 'combobox',
    label: 'Withdraw crypto: coin',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.address,
    role: 'textbox',
    label: 'Withdraw crypto: address',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.extraId,
    role: 'textbox',
    label: 'Withdraw crypto: extra id',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.amount,
    role: 'textbox',
    label: 'Withdraw crypto: amount',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.validate,
    role: 'button',
    label: 'Withdraw crypto: validate',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.crypto.confirm,
    role: 'button',
    label: 'Withdraw crypto: confirm',
    runtimeConditional: true,
  },

  // Currency/network withdraw.
  {
    id: T.withdraw.fiat.currency,
    role: 'combobox',
    label: 'Withdraw: currency',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.fiat.network,
    role: 'combobox',
    label: 'Withdraw: network',
    runtimeConditional: true,
  },
  { id: T.withdraw.fiat.memo, role: 'textbox', label: 'Withdraw: memo', runtimeConditional: true },
  {
    id: T.withdraw.fiat.address,
    role: 'textbox',
    label: 'Withdraw: address',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.fiat.amount,
    role: 'textbox',
    label: 'Withdraw: amount',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.fiat.confirm,
    role: 'button',
    label: 'Withdraw: confirm',
    runtimeConditional: true,
  },

  // Withdraw-method chooser + AgentPay.
  {
    id: T.withdraw.method.crypto,
    role: 'button',
    label: 'Withdraw method: crypto',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.method.agentpay,
    role: 'button',
    label: 'Withdraw method: agentpay',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.method.back,
    role: 'button',
    label: 'Withdraw method: back',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.agentpay.wallet,
    role: 'combobox',
    label: 'Withdraw agentpay: wallet',
    runtimeConditional: true,
  },
  {
    id: T.withdraw.agentpay.submit,
    role: 'button',
    label: 'Withdraw agentpay: submit',
    runtimeConditional: true,
  },

  // Filters.
  {
    id: T.filters.type,
    role: 'tab',
    label: 'Transactions: type filter',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.filters.activityType,
    role: 'combobox',
    label: 'Transactions: activity type',
    runtimeConditional: true,
  },
  {
    id: T.filters.status,
    role: 'combobox',
    label: 'Transactions: status',
    runtimeConditional: true,
  },
  {
    id: T.filters.dateFrom,
    role: 'textbox',
    label: 'Transactions: from date',
    runtimeConditional: true,
  },
  {
    id: T.filters.dateTo,
    role: 'textbox',
    label: 'Transactions: to date',
    runtimeConditional: true,
  },

  // History chrome.
  {
    id: T.history.open,
    role: 'link',
    label: 'Transactions (mobile launcher)',
    runtimeConditional: true,
  },
  {
    id: T.history.pagination,
    role: 'group',
    label: 'Transactions: pagination',
    runtimeConditional: true,
  },
  {
    id: T.history.viewInstructions,
    role: 'button',
    label: 'Transactions: view instructions',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.history.instructionsClose,
    role: 'button',
    label: 'Transactions: close instructions',
    runtimeConditional: true,
  },
  {
    id: T.history.cancel,
    role: 'button',
    label: 'Transactions: cancel transaction',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.history.cancelConfirm,
    role: 'button',
    label: 'Transactions: confirm cancel',
    runtimeConditional: true,
  },
  {
    id: T.history.cancelDismiss,
    role: 'button',
    label: 'Transactions: dismiss cancel',
    runtimeConditional: true,
  },
]

export const TRANSACTIONS_REGISTRY: TestIdRegistry = {
  feature: 'transactions',
  structure: TRANSACTIONS_STRUCTURE,
}
