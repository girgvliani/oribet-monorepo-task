import { getCurrencyList, getNetworkList } from '../../api/services/Account.api'
import { useEffect, useState } from 'react'
import { ICurrency, ICurrencyNetworksId, INetwork } from '../../types/common.type'

interface UseWalletCurrencyNetworkOptions {
  defaultNetworkSlug?: string
}

const useWalletCurrencyNetwork = (options?: UseWalletCurrencyNetworkOptions) => {
  const [currencies, setCurrencies] = useState<ICurrency[]>([])
  const [networks, setNetworks] = useState<INetwork[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null)

  const getFilteredNetworks = (currency: ICurrency, networkData: INetwork[]) => {
    const coinNetworkIds: number[] = currency.networks_id.map((item: ICurrencyNetworksId) => {
      return item.coin_network_id
    })
    if (networkData) {
      return networkData.filter((item: INetwork) => coinNetworkIds.includes(item.id))
    }
    return []
  }

  const getCoinId = (currency: ICurrency, network: INetwork): number | undefined => {
    return currency.networks_id.find(
      (item: ICurrencyNetworksId) => item.coin_network_id === network.id
    )?.coin_id
  }

  useEffect(() => {
    getCurrencyList().then((resp: any) => {
      if (resp.data.data) {
        const currencyData = resp.data.data
        setCurrencies(currencyData)

        if (currencyData.length > 0) {
          const usdtCurrency = currencyData.find((item: any) => item.name === 'USDT')
          const defaultCurrency = usdtCurrency || currencyData[0]
          setSelectedCurrency(defaultCurrency)

          getNetworkList().then((netResp: any) => {
            if (netResp.data.data) {
              setNetworks(netResp.data.data)

              const filtered = getFilteredNetworks(defaultCurrency, netResp.data.data)

              if (filtered && filtered.length > 0) {
                let defaultNetwork = filtered[0]
                if (options?.defaultNetworkSlug) {
                  const preferredIndex = filtered.findIndex(
                    (item: any) => item.slug === options.defaultNetworkSlug
                  )
                  if (preferredIndex !== -1) {
                    defaultNetwork = filtered[preferredIndex]
                  }
                }
                setSelectedNetwork(defaultNetwork)
              }
            }
          })
        }
      }
    })
  }, [])

  return {
    currencies,
    networks,
    selectedCurrency,
    selectedNetwork,
    setSelectedCurrency,
    setSelectedNetwork,
    getFilteredNetworks,
    getCoinId,
  }
}

export default useWalletCurrencyNetwork
