import React from 'react'
import { useTranslation } from 'react-i18next'
import { fontSize, media } from '@oribet/ui'
import styled from 'styled-components'

const RankContainer = styled.div<{ background: string; fullWidth?: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  flex-direction: ${props => (props.fullWidth ? 'row' : 'column')};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-radius: 8px;
  padding: 16px;
  background: ${props => props.background};
  gap: ${props => (props.fullWidth ? '24px' : '0')};
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const RankImage = styled.img<{ fullWidth?: boolean }>`
  width: ${props => (props.fullWidth ? '108px' : '30%')};
  height: ${props => (props.fullWidth ? '108px' : 'auto')};

  ${media.sm} {
    width: 48px;
    height: 52px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  height: 100%;
`

const RankText = styled.span<{ isCurrentRank?: boolean }>`
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 24px;
  color: ${props =>
    props.isCurrentRank ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
`

const ProgressBarContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 8px;
  height: 8px;
  margin-top: 16px;
`

const ProgressBar = styled.div<{ width: string; progressStyle: any }>`
  height: 8px;
  border-radius: 8px;
  width: ${props => props.width};
  ${props => ({ ...props.progressStyle })};
`

const LevelInfoContainer = styled.div`
  margin-top: 16px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const CurrentLevel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`

interface IUserRank {
  currentRankName: string
  nextRankName: string
  level: number
  srcInfo: any
  progress: number
  maxLevel: number
  fullWidth?: boolean
  backgroundColor?: string
}

const UserRank: React.FC<IUserRank> = ({
  currentRankName,
  nextRankName,
  srcInfo,
  level,
  progress,
  maxLevel,
  fullWidth,
  backgroundColor,
}) => {
  const { t } = useTranslation()

  return (
    <RankContainer background={backgroundColor || srcInfo?.background} fullWidth={fullWidth}>
      <ImageContainer>
        <RankImage alt="rank img" src={`/imgs/rank/${srcInfo?.img ?? ''}`} fullWidth={fullWidth} />
      </ImageContainer>

      <ContentWrapper>
        <ContentHeader>
          <RankText isCurrentRank>{currentRankName}</RankText>
          <RankText>{nextRankName}</RankText>
        </ContentHeader>

        <ProgressBarContainer>
          <ProgressBar width={`${progress}%`} progressStyle={srcInfo?.progressStyle} />
        </ProgressBarContainer>

        <LevelInfoContainer>
          <span>{t('profile.nextLevel')}</span>
          <span>
            <CurrentLevel>{level}</CurrentLevel>/{maxLevel}
          </span>
        </LevelInfoContainer>
      </ContentWrapper>
    </RankContainer>
  )
}

export default UserRank
