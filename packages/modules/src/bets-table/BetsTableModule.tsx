import BetsTable from './BetsTable'
import { useLastBets } from '@oribet/core/hooks/socket/useLastBets'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const BetsTableModule = () => {
  const isMobile = useIsMobile()
  const tableHeader = isMobile
    ? ['Game', 'user', 'payout']
    : ['Game', 'user', 'bet', 'payout']

  const rootRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { bets, newBetIds } = useLastBets(isVisible)

  return (
    <Root ref={rootRef}>
      {bets.length > 0 && <BetsTable tableData={bets} newBetIds={newBetIds} tableHeader={tableHeader} />}
    </Root>
  )
}

export default BetsTableModule

const Root = styled.div`
  width: 100%;
`
