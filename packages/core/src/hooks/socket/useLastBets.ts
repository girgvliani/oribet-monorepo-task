import useFetchLastBets from '../socket/useFetchLastBets'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IBetsTableItem } from '../../types/common.type'

const MAX_ITEMS = 99
const INITIAL_COUNT = 12
const DRAIN_MIN = 500
const DRAIN_MAX = 1500

function normalizeBet(item: any): IBetsTableItem {
  if (item.bet !== undefined) return item
  return {
    ...item,
    bet: String(item.amount ?? 0),
    win: String((item.amount ?? 0) * (item.multiplier ?? 0)),
  }
}

function betKey(b: IBetsTableItem): string {
  return `${b.player_id}-${b.game_id}-${b.create_dt}`
}

function randomDelay(): number {
  return Math.floor(Math.random() * (DRAIN_MAX - DRAIN_MIN + 1)) + DRAIN_MIN
}

export function useLastBets(isVisible: boolean): { bets: IBetsTableItem[]; newBetIds: Set<string> } {
  const { data: restData } = useFetchLastBets(isVisible)

  const [displayed, setDisplayed] = useState<IBetsTableItem[]>([])
  const [newBetIds, setNewBetIds] = useState<Set<string>>(new Set())

  const displayedRef = useRef<IBetsTableItem[]>([])
  const queueRef = useRef<IBetsTableItem[]>([])
  const drainingRef = useRef(false)
  const initializedRef = useRef(false)

  const scheduleNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      drainingRef.current = false
      return
    }

    drainingRef.current = true

    setTimeout(() => {
      const bet = queueRef.current.shift()
      if (!bet) {
        drainingRef.current = false
        return
      }

      const id = betKey(bet)
      const next = [bet, ...displayedRef.current].slice(0, MAX_ITEMS)
      displayedRef.current = next
      setDisplayed(next)
      setNewBetIds(prev => new Set(prev).add(id))

      setTimeout(() => {
        setNewBetIds(prev => {
          const copy = new Set(prev)
          copy.delete(id)
          return copy
        })
      }, 400)

      scheduleNext()
    }, randomDelay())
  }, [])

  useEffect(() => {
    if (!restData?.length) return

    const normalized = restData.map(normalizeBet)

    if (!initializedRef.current) {
      initializedRef.current = true
      // Show first batch immediately, queue the rest for animation
      const initial = normalized.slice(-INITIAL_COUNT)
      const rest = normalized.slice(0, -INITIAL_COUNT)
      displayedRef.current = initial
      setDisplayed(initial)
      queueRef.current.push(...rest.reverse())
      if (rest.length > 0 && !drainingRef.current) {
        scheduleNext()
      }
      return
    }

    const knownKeys = new Set(displayedRef.current.map(betKey))
    const queueKeys = new Set(queueRef.current.map(betKey))
    const fresh = normalized.filter(b => {
      const k = betKey(b)
      return !knownKeys.has(k) && !queueKeys.has(k)
    })

    if (fresh.length === 0) return

    queueRef.current.push(...fresh)

    if (!drainingRef.current) {
      scheduleNext()
    }
  }, [restData, scheduleNext])

  return { bets: displayed, newBetIds }
}
