import useFetchLastWins from '../socket/useFetchLastWins'
import { setSocketData, useSocketData } from '../socket/useSocketData'
import { useEffect } from 'react'
import { IBetsTableItem } from '../../types/common.type'

const MAX_ITEMS = 200

function processLastWins(incoming: any, current: IBetsTableItem[]): IBetsTableItem[] {
  if (!Array.isArray(incoming)) return current

  const merged = [...incoming, ...current]
  const sorted = merged.sort(
    (a, b) => new Date(b.create_dt).getTime() - new Date(a.create_dt).getTime()
  )
  return sorted.slice(0, MAX_ITEMS)
}

export function useLastWins(): IBetsTableItem[] {
  const { data: restData } = useFetchLastWins()
  const socketData = useSocketData<IBetsTableItem[]>('lastWins', [], processLastWins)

  useEffect(() => {
    if (restData?.length) {
      setSocketData('lastWins', restData)
    }
  }, [restData])

  return socketData
}
