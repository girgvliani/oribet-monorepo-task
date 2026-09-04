import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { fontSize } from '@oribet/ui'
import { getRanksSystem } from '@oribet/core/util/UserProfileHelper'

import { lang } from '@oribet/core/util/appRoutePath'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes, useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import RecentWinsImage from './RecentWinsImage'
import {
  GAME_CARD_ASPECT_RATIOS,
  useGameCardAspectRatio,
  type GameCardAspectRatio,
} from '../game-card'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

interface IRecentWins {
  data: any[]
}

const RecentWins = ({ data }: IRecentWins) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const ranksSystem = getRanksSystem(theme)
  const ref = useRef<any>(null)
  const navigate = useNavigate()
  const aspectRatio = useGameCardAspectRatio()

  const handleResize = () => {
    ref.current?.scrollTo({
      left: 0,
    })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    handleResize()
  }, [data])

  const getImgUrl = (player: any): string => {
    const rank = player?.player_rank?.rank
    if (!rank) return 'newcomer.png'
    const imgName = ranksSystem.find((item: any) => item.name.toLowerCase() === rank.toLowerCase())
    return imgName?.img || 'newcomer.png'
  }

  return (
    <Root>
      <Header>
        <PulseCircle />
        <Title>{t('profile.recentWins')}</Title>
      </Header>
      <Body ref={ref}>
        {data.map((item, index) => (
          <Card
            key={uuidv4()}
            onClick={() => navigate(`/${lang()}/games/${item.slug}`)}
            data-testid={`${DISCOVERY_TEST_IDS.liveFeed.winCard}.${index}`}
          >
            <ImageContainer $aspectRatio={aspectRatio}>
              <RecentWinsImage url={item.image} />
            </ImageContainer>
            <Info>
              <Player>
                <img width="16px" src={`/imgs/rank/${getImgUrl(item)}`} alt="rank" />
                <PlayerName>{item.player_name}</PlayerName>
              </Player>
              <WinAmount>
                {getActiveCurrencySymbol(item.currency)}
                {Number(item.win).toFixed(2)}
              </WinAmount>
            </Info>
          </Card>
        ))}
      </Body>
    </Root>
  )
}

export default RecentWins

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(2);
  }
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 16px;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const PulseCircle = styled.span`
  background: #a3e635;
  width: 4px;
  height: 4px;
  border-radius: 100%;
  animation: ${pulse} 1s infinite alternate;
`

const Body = styled.div`
  display: flex;
  box-sizing: border-box;
  overflow: auto;
  gap: 16px;
  position: relative;
  scroll-behavior: smooth;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: opacity 0.5s ease-in-out;
  cursor: pointer;
`

const ImageContainer = styled.div<{ $aspectRatio: GameCardAspectRatio }>`
  border-radius: 8px;
  height: 86px;
  aspect-ratio: ${({ $aspectRatio }) => GAME_CARD_ASPECT_RATIOS[$aspectRatio]};
  box-sizing: border-box;
  flex-shrink: 0;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const PlayerName = styled.span`
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const WinAmount = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`
