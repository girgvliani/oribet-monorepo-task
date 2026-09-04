import { store } from '../redux/store'

export const getActiveCurrencySymbol = (currency?: string): string => {
  let currencyToUse = currency

  if (!currencyToUse) {
    const state = store.getState()
    currencyToUse = state.user?.playerInfo?.player?.currency
  }

  if (!currencyToUse) return '$'

  switch (currencyToUse.toUpperCase()) {
    case 'USD':
    case 'USDT':
    case 'USDC':
    case 'DAI':
      return '$'
    case 'EUR':
      return '€'
    case 'GBP':
      return '£'
    case 'CAD':
      return 'C$'
    case 'AUD':
      return 'A$'
    case 'JPY':
    case 'CNY':
      return '¥'
    case 'KRW':
      return '₩'
    case 'INR':
      return '₹'
    case 'RUB':
      return '₽'
    case 'TRY':
      return '₺'
    case 'BRL':
      return 'R$'
    case 'BTC':
      return '₿'
    case 'ETH':
      return 'Ξ'
    case 'ADA':
      return '₳'
    case 'LTC':
      return 'Ł'
    case 'DOGE':
      return 'Ð'
    case 'BNB':
      return 'BNB'
    case 'XRP':
      return 'XRP'
    case 'DOT':
      return 'DOT'
    case 'TRX':
      return 'TRX'
    case 'SOL':
      return 'SOL'
    case 'MATIC':
      return 'MATIC'
    default:
      return currencyToUse.toUpperCase()
  }
}
