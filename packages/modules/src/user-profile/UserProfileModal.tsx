import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { fontSize, zIndex } from '@oribet/ui'
import { IconArrowForward } from '@oribet/assets/icons/IconArrowForward'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { IconFavorite } from '@oribet/assets/icons/IconFavorite'
import { IconStatistic } from '@oribet/assets/icons/IconStatistic'
import { GameCard } from '@oribet/modules/game-card'
import { MobileContainer } from '@oribet/ui'
import UserProfile from './UserProfile'
import UserProfileChangeImg from './UserProfileChangeImg'
import UserProfileHeader from './UserProfileHeader'
import UserRank from './UserRank'
import { CustomModal } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeUserProfileInfo } from '@oribet/core/redux/slices/userSlice'
import { IUserProfileInfo } from '@oribet/core/util/UserProfileHelper'
import useUserRankInfo from '@oribet/core/hooks/user/useUserRankInfo'
import { AppRoutePath, lang } from '@oribet/core/util/appRoutePath'
import { useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { IGameSchema } from '@oribet/core/types/Game.type'

const UserProfileModal = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const userProfileInfo = useAppSelector(
    state => state.user.userProfileInformation
  ) as IUserProfileInfo
  const ranksInfo = useAppSelector(state => state.user.ranksInfo)
  const favouriteGames = useAppSelector(state => state.game.favourite)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [stage, setStage] = useState<number>(0)
  const rankInfo = useUserRankInfo(userProfileInfo.rank, ranksInfo)

  const open = !!userProfileInfo.open

  const onClose = () => {
    dispatch(
      changeUserProfileInfo({
        open: false,
        isCurrentUser: true,
        id: 0,
        username: '',
        totalBets: 0,
        totalWins: 0,
        avatar: null,
        rank: {
          rank: '',
          progress: 0,
          level: 0,
        },
      })
    )
    setStage(0)
  }

  const content = (
    <>
      {open && (
        <div style={{ height: '100%' }}>
          {stage === 0 && (
            <Root $isMobile={isMobile}>
              <Header $isMobile={isMobile}>
                <HeaderText>{t('profile.userInformation')}</HeaderText>
                <CloseButton
                  onClick={() => onClose()}
                  data-testid={ACCOUNT_TEST_IDS.profile.close}
                >
                  <IconClose />
                </CloseButton>
              </Header>
              <UserAndRankContainer>
                <UserProfileHeader
                  username={userProfileInfo.username}
                  userId={String(userProfileInfo.id)}
                  img={userProfileInfo.avatar}
                  stage={'EDIT'}
                  onClickProfile={() => setStage(1)}
                />
                <UserRank
                  currentRankName={rankInfo.currentRankName}
                  nextRankName={rankInfo.nextRankName}
                  level={rankInfo.level}
                  srcInfo={rankInfo.srcInfo}
                  progress={rankInfo.progress}
                  maxLevel={rankInfo.maxLevel}
                />
              </UserAndRankContainer>
              <LearnRankContainer
                onClick={() => {
                  onClose()
                  navigate(AppRoutePath.RANKSYSTEM())
                }}
                data-testid={ACCOUNT_TEST_IDS.profile.learnRank}
              >
                <LearnRankText>{t('profile.learnAboutRanks')}</LearnRankText>
                <ArrowWrapper>
                  <IconArrowForward
                    size={16}
                    style={{
                      color: theme.colors.text.tertiary,
                      cursor: 'pointer',
                      transition: 'color 0.3s ease-in-out',
                    }}
                  />
                </ArrowWrapper>
              </LearnRankContainer>
              <StatisticsContainer>
                <StatisticsHeader>
                  <IconStatistic />
                  <StatisticText>{t('profile.statistic')}</StatisticText>
                </StatisticsHeader>
                <StatisticsItems>
                  <StatisticItem>
                    <StatisticItemName>{t('profile.totalWins')}</StatisticItemName>{' '}
                    <StatisticItemCount>{userProfileInfo.totalWins}</StatisticItemCount>
                  </StatisticItem>
                  <StatisticItem>
                    <StatisticItemName>{t('profile.totalWager')}</StatisticItemName>{' '}
                    <StatisticItemCount>{userProfileInfo.totalBets}</StatisticItemCount>
                  </StatisticItem>
                </StatisticsItems>
              </StatisticsContainer>
              {userProfileInfo.isCurrentUser && (
                <FavouriteContainer>
                  <FavouriteHeader>
                    <FavouriteTitleWrapper>
                      <IconFavorite />
                      <FavouriteTitle>{t('oribetMenu.favourites')}</FavouriteTitle>
                    </FavouriteTitleWrapper>
                    <SeeAll
                      onClick={() => {
                        onClose()
                        navigate(AppRoutePath.FAVORITE_LIST_PATE())
                      }}
                      data-testid={ACCOUNT_TEST_IDS.profile.seeAll}
                    >
                      {t('common.seeAll')}
                    </SeeAll>
                  </FavouriteHeader>
                  <GamesWrapper>
                    {favouriteGames.slice(0, 4).map((game: IGameSchema) => {
                      return (
                        <div key={game.game_id}>
                          <GameCard
                            gameName={game.game_title}
                            gameProvider={game.provider}
                            backgroundImageUrl={game.image || ''}
                            isFavorite={true}
                            isAvailable={!game.coming_soon && !game.is_restricted}
                            comingSoon={!!game.coming_soon}
                            addToFavorites={() => {}}
                            removeFromFavorite={() => {}}
                            startPlaying={() => {
                              navigate(`/${lang()}/games/${game.slug}`)
                              onClose()
                            }}
                            isMobile={isMobile}
                            agregator_image={game.agregator_image}
                            gameCardStyle={{
                              width: '84px',
                              height: '112px',
                            }}
                            hideActions={true}
                            gameId={game.game_id}
                          />
                        </div>
                      )
                    })}
                  </GamesWrapper>
                </FavouriteContainer>
              )}
            </Root>
          )}
          {stage === 1 && (
            <UserProfile
              setStage={setStage}
              username={userProfileInfo.username}
              avatar={userProfileInfo.avatar}
              onClose={() => onClose()}
            />
          )}
          {stage === 2 && (
            <UserProfileChangeImg
              setStage={setStage}
              onClose={() => onClose()}
              avatar={userProfileInfo.avatar}
            />
          )}
        </div>
      )}
    </>
  )

  return isMobile ? (
    <MobileContainer open={open} setOpen={() => onClose()}>
      {content}
    </MobileContainer>
  ) : (
    /* idmap-ignore: structural modal wrapper */
    <CustomModal open={open} onClose={() => onClose()}>
      {content}
    </CustomModal>
  )
}

export default UserProfileModal

const Root = styled.div<{ $isMobile: boolean }>`
  position: relative;
  border: ${({ $isMobile, theme }) =>
    $isMobile ? 'none' : `1px solid ${theme.colors.surface.hover}`};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '426px')};
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '12px')};
  overflow-y: auto;
  height: 100%;
`

const Header = styled.div<{ $isMobile: boolean }>`
  z-index: ${zIndex.dropdown};
  position: sticky;
  top: 0;
  background: ${({ $isMobile, theme }) =>
    $isMobile ? theme.colors.bg.primary : theme.colors.bg.input};
  padding: 16px;
  border-bottom: ${({ $isMobile, theme }) =>
    $isMobile ? 'none' : `1px solid ${theme.colors.surface.hover}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`

const HeaderText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 24px;
`

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
    width: 20px;
    height: 20px;
  }
`

const UserAndRankContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`

const LearnRankContainer = styled.div`
  padding: 0px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    & span {
      color: ${({ theme }) => theme.colors.text.primary};
    }

    & svg {
      color: ${({ theme }) => theme.colors.text.primary} !important;
    }
  }
`

const LearnRankText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
  transition: color 0.3s ease-in-out;
`

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const StatisticsContainer = styled.div`
  padding: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`

const StatisticsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
`

const StatisticText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
`

const StatisticsItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StatisticItem = styled.div`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
`

const StatisticItemName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 24px;
`

const StatisticItemCount = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  line-height: 24px;
  font-size: ${fontSize.lg};
`

const FavouriteContainer = styled.div`
  padding: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  & path {
    fill: ${({ theme }) => theme.colors.text.secondary};
  }
`

const FavouriteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
`

const FavouriteTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FavouriteTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
`

const SeeAll = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;
`

const GamesWrapper = styled.div`
  display: flex;
  gap: 19px;
`
