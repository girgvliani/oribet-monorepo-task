/**
 * Deposit + wallet test-id registry: how a player funds the account.
 *
 * Covers the shared "open deposit" triggers (balance pill, header button, wallet
 * card, account-menu add, mobile wallet), the deposit-method chooser, and each
 * concrete deposit surface (transfer-crypto, fiat/Interkasa, Omno cashier, AgentPay,
 * buy-crypto/Changelly), plus the wallet balance display / currency switcher and the
 * wallet-attached bonus actions. Shared modules: oribet renders the header
 * MultiWalletView/DepositView; oribet-korea renders CenteredNavBalancePill +
 * DepositMoneySection. Both compose the same `@oribet/modules/account` deposit views.
 */
import type { IdNode, TestIdRegistry } from './types'

/**
 * Korea tabbed wallet modal (Deposit / Withdraw / Transactions) — opened from the
 * header wallet pill. Distinct from the shared deposit-method chooser. Nested into
 * DEPOSIT_TEST_IDS below (as `walletModal`) so it shares the deposit registry.
 */
export const WALLET_TEST_IDS = {
  modal: {
    root: 'wallet.modal.root',
    close: 'wallet.modal.close',
    /** Close-confirmation dialog (shown on committed end screens): confirm close. */
    closeConfirm: 'wallet.modal.close-confirm',
    /** Close-confirmation dialog: dismiss (keep the wallet open). */
    closeDismiss: 'wallet.modal.close-dismiss',
  },
  tab: {
    /** Tab button. Collection — `<id>.<deposit|withdraw|transactions>`. */
    root: 'wallet.tab',
  },
  deposit: {
    back: 'wallet.deposit.back',
    /** Method card. Collection — `<id>.<crypto|bank>`. */
    method: 'wallet.deposit.method',
    bankVerifiedToggle: 'wallet.deposit.bank-verified-toggle',
    /** Crypto wizard: amount input. */
    cryptoAmount: 'wallet.deposit.crypto-amount',
    /** Crypto wizard: amount → currency continue. */
    cryptoContinue: 'wallet.deposit.crypto-continue',
    /** Crypto wizard: currency row. Collection — `<id>.<code>`. */
    currencyOption: 'wallet.deposit.currency-option',
    /** Crypto wizard: network row. Collection — `<id>.<network>`. */
    networkOption: 'wallet.deposit.network-option',
    /** Crypto wizard: copy deposit address. */
    addressCopy: 'wallet.deposit.address-copy',
  },
  withdraw: {
    back: 'wallet.withdraw.back',
    /** Method card. Collection — `<id>.<fiat|crypto>`. */
    method: 'wallet.withdraw.method',
  },
  bonus: {
    header: 'wallet.bonus-select.header',
    /** Bonus option. Collection — `<id>.<none|id>`. */
    option: 'wallet.bonus-select.option',
    disableConfirm: 'wallet.bonus-select.disable-confirm',
    disableCancel: 'wallet.bonus-select.disable-cancel',
  },
  select: {
    /** Wallet card on the pre-init select-wallet screen. Collection — `<id>.<walletId>`. */
    card: 'wallet.select.card',
    /** Back to select-wallet from the deposit/withdraw method screen. */
    changeWallet: 'wallet.select.change-wallet',
  },
} as const

export const DEPOSIT_TEST_IDS = {
  /**
   * Shared "open the deposit flow" trigger. Rendered in several places that can be
   * on screen at once (header button + sidebar card), so it is a collection —
   * `wallet.deposit-open.<location>`.
   */
  open: 'wallet.deposit-open',
  /** Deposit-method chooser modal (fiat / crypto / buy / agentpay + bonus toggle). */
  method: {
    fiat: 'deposit.method.fiat',
    crypto: 'deposit.method.crypto',
    buyCrypto: 'deposit.method.buy-crypto',
    agentPay: 'deposit.method.agent-pay',
    bonusToggle: 'deposit.method.bonus-toggle',
    bonusConfirm: 'deposit.method.bonus-confirm',
    bonusCancel: 'deposit.method.bonus-cancel',
    back: 'deposit.method.back',
  },
  /** Legacy two-tab deposit modal (crypto / fiat). */
  modal: {
    cryptoTab: 'deposit.modal.crypto-tab',
    fiatTab: 'deposit.modal.fiat-tab',
    back: 'deposit.modal.back',
  },
  /** Transfer-crypto deposit. */
  crypto: {
    wallet: 'deposit.crypto.wallet',
    coin: 'deposit.crypto.coin',
    amount: 'deposit.crypto.amount',
    estimate: 'deposit.crypto.estimate',
    confirm: 'deposit.crypto.confirm',
    addressCopy: 'deposit.crypto.address-copy',
    memoCopy: 'deposit.crypto.memo-copy',
    seeTransactions: 'deposit.crypto.see-transactions',
  },
  /** Fiat (Interkasa) deposit. */
  fiat: {
    amount: 'deposit.fiat.amount',
    currency: 'deposit.fiat.currency',
    /** Preset amount chip. Collection — `<id>.<value>`. */
    amountChip: 'deposit.fiat.amount-chip',
    /** Payment-method card. Collection — `<id>.<method>`. */
    methodCard: 'deposit.fiat.method-card',
    submit: 'deposit.fiat.submit',
  },
  /** Omno fiat cashier. */
  omno: {
    /** Wallet option card. Collection — `<id>.<currency>`. */
    walletOption: 'deposit.omno.wallet-option',
    back: 'deposit.omno.back',
  },
  /** AgentPay deposit. */
  agentPay: {
    wallet: 'deposit.agent-pay.wallet',
    currency: 'deposit.agent-pay.currency',
    submit: 'deposit.agent-pay.submit',
  },
  /** Buy crypto (Changelly). */
  buyCrypto: {
    wallet: 'deposit.buy-crypto.wallet',
    currency: 'deposit.buy-crypto.currency',
    amount: 'deposit.buy-crypto.amount',
    getOffers: 'deposit.buy-crypto.get-offers',
    /** Provider offer card. Collection — `<id>.<key>`. */
    offer: 'deposit.buy-crypto.offer',
    confirm: 'deposit.buy-crypto.confirm',
  },
  /** Wallet balance display + currency switcher + wallet-attached bonus actions. */
  wallet: {
    balancePill: 'wallet.balance.pill',
    expand: 'wallet.balance.expand',
    /** Wallet/currency row (switch active wallet). Collection — `<id>.<currency>`. */
    switchCard: 'wallet.switch.card',
    bonusClaim: 'wallet.bonus.claim',
    bonusWager: 'wallet.bonus.wager',
    bonusMove: 'wallet.bonus.move',
    bonusPromo: 'wallet.bonus.promo',
    bonusSubmit: 'wallet.bonus.submit',
  },
  /** Korea tabbed wallet modal — defined above as WALLET_TEST_IDS. */
  walletModal: WALLET_TEST_IDS,
} as const

const T = DEPOSIT_TEST_IDS
const W = WALLET_TEST_IDS

export const DEPOSIT_STRUCTURE: IdNode[] = [
  // Shared open trigger.
  {
    id: T.open,
    role: 'button',
    label: 'Open deposit flow',
    collection: true,
    runtimeConditional: true,
  },

  // Method chooser.
  { id: T.method.fiat, role: 'button', label: 'Method: fiat', runtimeConditional: true },
  {
    id: T.method.crypto,
    role: 'button',
    label: 'Method: transfer crypto',
    runtimeConditional: true,
  },
  { id: T.method.buyCrypto, role: 'button', label: 'Method: buy crypto', runtimeConditional: true },
  { id: T.method.agentPay, role: 'button', label: 'Method: AgentPay', runtimeConditional: true },
  {
    id: T.method.bonusToggle,
    role: 'checkbox',
    label: 'Method: deposit-bonus toggle',
    runtimeConditional: true,
  },
  {
    id: T.method.bonusConfirm,
    role: 'button',
    label: 'Method: confirm bonus change',
    runtimeConditional: true,
  },
  {
    id: T.method.bonusCancel,
    role: 'button',
    label: 'Method: cancel bonus change',
    runtimeConditional: true,
  },
  { id: T.method.back, role: 'button', label: 'Method chooser: back', runtimeConditional: true },

  // Legacy deposit modal tabs.
  {
    id: T.modal.cryptoTab,
    role: 'tab',
    label: 'Deposit modal: crypto tab',
    runtimeConditional: true,
  },
  { id: T.modal.fiatTab, role: 'tab', label: 'Deposit modal: fiat tab', runtimeConditional: true },
  { id: T.modal.back, role: 'button', label: 'Deposit modal: back', runtimeConditional: true },

  // Transfer-crypto.
  {
    id: T.crypto.wallet,
    role: 'combobox',
    label: 'Crypto deposit: wallet',
    runtimeConditional: true,
  },
  { id: T.crypto.coin, role: 'combobox', label: 'Crypto deposit: coin', runtimeConditional: true },
  {
    id: T.crypto.amount,
    role: 'textbox',
    label: 'Crypto deposit: amount',
    runtimeConditional: true,
  },
  {
    id: T.crypto.estimate,
    role: 'textbox',
    label: 'Crypto deposit: estimated receive',
    runtimeConditional: true,
  },
  {
    id: T.crypto.confirm,
    role: 'button',
    label: 'Crypto deposit: confirm',
    runtimeConditional: true,
  },
  {
    id: T.crypto.addressCopy,
    role: 'button',
    label: 'Crypto deposit: copy address',
    runtimeConditional: true,
  },
  {
    id: T.crypto.memoCopy,
    role: 'button',
    label: 'Crypto deposit: copy memo',
    runtimeConditional: true,
  },
  {
    id: T.crypto.seeTransactions,
    role: 'link',
    label: 'Crypto deposit: see transactions',
    runtimeConditional: true,
  },

  // Fiat (Interkasa).
  { id: T.fiat.amount, role: 'textbox', label: 'Fiat deposit: amount', runtimeConditional: true },
  {
    id: T.fiat.currency,
    role: 'combobox',
    label: 'Fiat deposit: currency',
    runtimeConditional: true,
  },
  {
    id: T.fiat.amountChip,
    role: 'button',
    label: 'Fiat deposit: amount chip',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.fiat.methodCard,
    role: 'button',
    label: 'Fiat deposit: payment method',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.fiat.submit, role: 'button', label: 'Fiat deposit: submit', runtimeConditional: true },

  // Omno cashier.
  {
    id: T.omno.walletOption,
    role: 'button',
    label: 'Omno: wallet option',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.omno.back, role: 'button', label: 'Omno: back', runtimeConditional: true },

  // AgentPay.
  { id: T.agentPay.wallet, role: 'combobox', label: 'AgentPay: wallet', runtimeConditional: true },
  {
    id: T.agentPay.currency,
    role: 'textbox',
    label: 'AgentPay: currency',
    runtimeConditional: true,
  },
  { id: T.agentPay.submit, role: 'button', label: 'AgentPay: submit', runtimeConditional: true },

  // Buy crypto (Changelly).
  {
    id: T.buyCrypto.wallet,
    role: 'combobox',
    label: 'Buy crypto: wallet',
    runtimeConditional: true,
  },
  {
    id: T.buyCrypto.currency,
    role: 'combobox',
    label: 'Buy crypto: currency',
    runtimeConditional: true,
  },
  {
    id: T.buyCrypto.amount,
    role: 'textbox',
    label: 'Buy crypto: amount',
    runtimeConditional: true,
  },
  {
    id: T.buyCrypto.getOffers,
    role: 'button',
    label: 'Buy crypto: get offers',
    runtimeConditional: true,
  },
  {
    id: T.buyCrypto.offer,
    role: 'button',
    label: 'Buy crypto: offer',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.buyCrypto.confirm,
    role: 'button',
    label: 'Buy crypto: confirm',
    runtimeConditional: true,
  },

  // Wallet balance / switch / bonus.
  { id: T.wallet.balancePill, role: 'button', label: 'Balance pill', runtimeConditional: true },
  {
    id: T.wallet.expand,
    role: 'button',
    label: 'Balance: expand wallets',
    runtimeConditional: true,
  },
  {
    id: T.wallet.switchCard,
    role: 'button',
    label: 'Wallet switch card',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.wallet.bonusClaim,
    role: 'button',
    label: 'Wallet bonus: claim',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.wallet.bonusWager,
    role: 'button',
    label: 'Wallet bonus: wager',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.wallet.bonusMove,
    role: 'button',
    label: 'Wallet bonus: move to balance',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.wallet.bonusPromo,
    role: 'textbox',
    label: 'Wallet bonus: promo code',
    runtimeConditional: true,
  },
  {
    id: T.wallet.bonusSubmit,
    role: 'button',
    label: 'Wallet bonus: submit',
    runtimeConditional: true,
  },

  // Korea tabbed wallet modal — only mounted at runtime, so runtimeConditional.
  {
    id: W.modal.root,
    role: 'dialog',
    label: 'Korea wallet modal',
    runtimeConditional: true,
    children: [
      { id: W.modal.close, role: 'button', label: 'Wallet: close', runtimeConditional: true },
      {
        id: W.modal.closeConfirm,
        role: 'button',
        label: 'Wallet: confirm close',
        runtimeConditional: true,
      },
      {
        id: W.modal.closeDismiss,
        role: 'button',
        label: 'Wallet: keep open',
        runtimeConditional: true,
      },
      {
        id: W.tab.root,
        role: 'tab',
        label: 'Wallet: tab',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.deposit.back,
        role: 'button',
        label: 'Wallet deposit: back',
        runtimeConditional: true,
      },
      {
        id: W.deposit.method,
        role: 'button',
        label: 'Wallet deposit: method',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.deposit.bankVerifiedToggle,
        role: 'checkbox',
        label: 'Wallet deposit: bank-verified (demo) toggle',
        runtimeConditional: true,
      },
      {
        id: W.deposit.cryptoAmount,
        role: 'textbox',
        label: 'Wallet deposit: crypto amount',
        runtimeConditional: true,
      },
      {
        id: W.deposit.cryptoContinue,
        role: 'button',
        label: 'Wallet deposit: crypto continue',
        runtimeConditional: true,
      },
      {
        id: W.deposit.currencyOption,
        role: 'button',
        label: 'Wallet deposit: currency option',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.deposit.networkOption,
        role: 'button',
        label: 'Wallet deposit: network option',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.deposit.addressCopy,
        role: 'button',
        label: 'Wallet deposit: copy address',
        runtimeConditional: true,
      },
      {
        id: W.withdraw.back,
        role: 'button',
        label: 'Wallet withdraw: back',
        runtimeConditional: true,
      },
      {
        id: W.withdraw.method,
        role: 'button',
        label: 'Wallet withdraw: method',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.bonus.header,
        role: 'button',
        label: 'Wallet bonus: section header',
        runtimeConditional: true,
      },
      {
        id: W.bonus.option,
        role: 'button',
        label: 'Wallet bonus: option',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.bonus.disableConfirm,
        role: 'button',
        label: 'Wallet bonus: disable confirm',
        runtimeConditional: true,
      },
      {
        id: W.bonus.disableCancel,
        role: 'button',
        label: 'Wallet bonus: disable cancel',
        runtimeConditional: true,
      },
      {
        id: W.select.card,
        role: 'button',
        label: 'Wallet select: wallet card',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: W.select.changeWallet,
        role: 'button',
        label: 'Wallet select: change wallet',
        runtimeConditional: true,
      },
    ],
  },
]

export const DEPOSIT_REGISTRY: TestIdRegistry = {
  feature: 'deposit',
  structure: DEPOSIT_STRUCTURE,
}
