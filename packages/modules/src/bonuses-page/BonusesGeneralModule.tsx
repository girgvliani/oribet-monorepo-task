import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { UserRank } from '@oribet/modules/user-profile'
import { useAppSelector } from '@oribet/core/redux/hooks'
import useUserRankInfo from '@oribet/core/hooks/user/useUserRankInfo'

/**
 * "General" bonuses section — shows the user's rank progress card. Hidden when the user
 * has no rank yet (logged-out or fresh account).
 */
const BonusesGeneralModule = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const userInfo = useAppSelector(state => state.user.playerInfo)
  const ranksInfo = useAppSelector(state => state.user.ranksInfo)
  const rankInfo = useUserRankInfo(userInfo?.player?.rank, ranksInfo)

  if (!userInfo?.player?.rank) return null

  return (
    <Wrapper>
      <Heading>{t('bonus.general')}</Heading>
      <Grid>
        <Cell>
          <UserRank
            currentRankName={rankInfo.currentRankName}
            nextRankName={rankInfo.nextRankName}
            srcInfo={rankInfo.srcInfo}
            level={rankInfo.level}
            progress={rankInfo.progress}
            maxLevel={rankInfo.maxLevel}
            fullWidth
            backgroundColor={theme.colors.bg.secondary}
          />
        </Cell>
      </Grid>
    </Wrapper>
  )
}

export default BonusesGeneralModule

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Heading = styled.span`
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

const Cell = styled.div`
  width: 100%;
`
