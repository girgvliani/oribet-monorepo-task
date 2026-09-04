import RecentWins from './RecentWins'
import { useLastWins } from '@oribet/core/hooks/socket/useLastWins'

const LastWinsContainer = () => {
  const data = useLastWins()
  return <RecentWins data={data} />
}

export default LastWinsContainer
