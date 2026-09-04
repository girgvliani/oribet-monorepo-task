import { CustomMinimalButton } from '@oribet/ui'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import GameCard from '../game-card/GameCard'
import GameCardSkeleton from '../game-card/GameCardSkeleton'
import { useGameSwiperSlidesPerView } from '../game-card/GameCardConfig'
import { IconChevronLeft } from '@oribet/assets/icons/IconChevronLeft'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { selectFavourite } from '@oribet/core/redux/selectors'
import { addGameToFavourite, removeGameFromFavourite } from '@oribet/core/redux/slices/gameSlice'
import { lang } from '@oribet/core/util/appRoutePath'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { IGameSchema } from '@oribet/core/types/Game.type'

interface IGameSwiper {
  /** Optional leading icon. Hidden when omitted. */
  icon?: React.ReactNode
  title: string
  /** Optional second word of the title, rendered in `accent.primary` (gold). */
  accentTitle?: string
  seeAllLink: string
  /** Place the "View All" link next to the title (left) or next to the nav buttons (right). Default `left`. */
  seeAllPosition?: 'left' | 'right'
  games: IGameSchema[]
  loading?: boolean
  otherSyle?: React.CSSProperties
  /** Stable identifier used to namespace swiper test-ids per instance. */
  swiperKey?: string
}

const GameSwiper = ({
  title,
  accentTitle,
  icon,
  seeAllLink,
  seeAllPosition = 'left',
  games,
  loading = false,
  otherSyle,
  swiperKey,
}: IGameSwiper) => {
  const sKey = swiperKey ?? seeAllLink ?? title ?? 'default'
  const isMobile = useIsMobile()
  const theme = useTheme()
  const { t } = useTranslation()
  const slidesPerViewConfig = useGameSwiperSlidesPerView()
  const slidesPerView = isMobile ? slidesPerViewConfig.mobile : slidesPerViewConfig.desktop
  const favourite = useAppSelector(selectFavourite)
  const dispatch = useAppDispatch()
  const addToFavoriteGameList = (gameId: string) => dispatch(addGameToFavourite(gameId))
  const removeFromFavoriteGameList = (gameId: string) => dispatch(removeGameFromFavourite(gameId))
  const navigate = useNavigate()
  const swiperRef = useRef<SwiperType | null>(null)

  const [isAtBeginning, setIsAtBeginning] = useState(false)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [partiallyVisibleSlides, setPartiallyVisibleSlides] = useState(new Set<number>())
  const [visibleSlidesCount, setVisibleSlidesCount] = useState(0)

  useEffect(() => {
    const updateButtonStates = () => {
      if (swiperRef.current) {
        setIsAtBeginning(swiperRef.current.isBeginning)
        setIsAtEnd(swiperRef.current.isEnd)
      }
    }

    updateButtonStates()

    const swiperInstance = swiperRef.current
    if (!swiperInstance) return

    swiperInstance.on('slideChange', updateButtonStates)

    return () => {
      swiperInstance.off('slideChange', updateButtonStates)
    }
  }, [games])

  // Consolidated: slide visibility + visible count + resize into single effect
  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const updateSlideVisibility = () => {
      if (!swiper.slides) return
      const newPartiallyVisible = new Set<number>()
      const swiperRect = swiper.el.getBoundingClientRect()

      swiper.slides.forEach((slide: HTMLElement, index: number) => {
        const slideRect = slide.getBoundingClientRect()
        if (slideRect.left < swiperRect.left || slideRect.right > swiperRect.right) {
          newPartiallyVisible.add(index)
        }
      })

      setPartiallyVisibleSlides(newPartiallyVisible)
    }

    const updateVisibleCount = () => {
      if (!swiper.slides?.length || !swiper.slides[0]) return
      const slideWidth = swiper.slides[0].offsetWidth + (swiper.params.spaceBetween as number)
      setVisibleSlidesCount(Math.floor(swiper.width / slideWidth))
    }

    const handleUpdate = () => {
      swiper.update()
      updateSlideVisibility()
      updateVisibleCount()
    }

    swiper.on('slideChangeTransitionEnd', updateSlideVisibility)
    swiper.on('init', handleUpdate)
    window.addEventListener('resize', handleUpdate)
    handleUpdate()

    return () => {
      swiper.off('slideChangeTransitionEnd', updateSlideVisibility)
      swiper.off('init', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [games])

  // Memoized style objects to avoid recreating on every render
  const navButtonStyleLeft = useMemo(
    () => ({
      padding: isMobile ? '6px' : '10px',
      height: isMobile ? '44px' : '40px',
      minWidth: '0px',
      width: isMobile ? '44px' : '40px',
    }),
    []
  )

  const swiperStyle = useMemo(
    () => ({
      paddingTop: '10px',
    }),
    []
  )

  const slideBaseStyle = useMemo(
    () => ({
      color: theme.colors.text.primary,
      minWidth: '0px',
      transition: 'opacity 0.2s ease-in-out',
    }),
    [theme.colors.text.primary]
  )

  const fillSlideStyle = useMemo(() => ({ width: '100%' }), [])

  const goLeft = useCallback(() => {
    if (!swiperRef.current) return
    const swiper = swiperRef.current
    const currentIndex = swiper.activeIndex
    const newIndex = Math.max(currentIndex - visibleSlidesCount, 0)
    swiper.slideTo(newIndex)
  }, [visibleSlidesCount])

  const goRight = useCallback(() => {
    if (!swiperRef.current) return
    const swiper = swiperRef.current
    const currentIndex = swiper.activeIndex
    const slidesCount = swiper.slides.length
    const newIndex = Math.min(currentIndex + visibleSlidesCount, slidesCount - visibleSlidesCount)
    swiper.slideTo(newIndex)
  }, [visibleSlidesCount])

  return (
    <Root $isMobile={isMobile} style={otherSyle}>
      {title && (
        <HeaderContainer $isMobile={isMobile}>
          <HeaderContainerLeftSide>
            {icon}
            <HeaderContainerTitle $isMobile={isMobile}>
              {title}
              {accentTitle && <TitleAccent> {accentTitle}</TitleAccent>}
            </HeaderContainerTitle>
            {seeAllPosition === 'left' && (
              <HeaderContainerSeeAll
                $isMobile={isMobile}
                data-testid={`${DISCOVERY_TEST_IDS.swiper.seeAll}.${sKey}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate(seeAllLink)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(seeAllLink)
                  }
                }}
              >
                {t('common.seeAll')}
              </HeaderContainerSeeAll>
            )}
          </HeaderContainerLeftSide>
          <ButtonsContainer $isMobile={isMobile}>
            {seeAllPosition === 'right' && (
              <HeaderContainerSeeAll
                $isMobile={isMobile}
                $accent
                data-testid={`${DISCOVERY_TEST_IDS.swiper.seeAll}.${sKey}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate(seeAllLink)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(seeAllLink)
                  }
                }}
              >
                {t('common.viewAll')}
              </HeaderContainerSeeAll>
            )}
            <CustomMinimalButton
              style={navButtonStyleLeft}
              onClick={goLeft}
              disabled={isAtBeginning}
              testId={`${DISCOVERY_TEST_IDS.swiper.prev}.${sKey}`}
            >
              <IconWrapper>
                <IconChevronLeft />
              </IconWrapper>
            </CustomMinimalButton>
            <CustomMinimalButton
              style={navButtonStyleLeft}
              onClick={goRight}
              disabled={isAtEnd}
              testId={`${DISCOVERY_TEST_IDS.swiper.next}.${sKey}`}
            >
              <IconWrapper>
                <IconChevronRight />
              </IconWrapper>
            </CustomMinimalButton>
          </ButtonsContainer>
        </HeaderContainer>
      )}
      <SwiperContainer>
        {loading ? (
          <LoadingContainer $isMobile={isMobile}>
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </LoadingContainer>
        ) : (
          <Swiper
            spaceBetween={isMobile ? 8 : 12}
            slidesPerView={slidesPerView}
            onSlideChange={() => {}}
            onSwiper={swiper => (swiperRef.current = swiper)}
            style={swiperStyle}
            speed={isMobile ? 200 : 500}
          >
            {games.map((game: IGameSchema, index: number) => {
              const isPartiallyVisible = partiallyVisibleSlides.has(index)
              return (
                <SwiperSlide
                  style={{
                    ...slideBaseStyle,
                    opacity: isPartiallyVisible ? 0.1 : 1,
                  }}
                  key={index}
                >
                  <GameCard
                    gameName={game.game_title}
                    gameProvider={game.provider}
                    isFavorite={!!favourite.find((item: IGameSchema) => item.id === game.id)}
                    backgroundImageUrl={game.image || ''}
                    isAvailable={!game.coming_soon && !game.is_restricted}
                    comingSoon={!!game.coming_soon}
                    addToFavorites={() => {
                      addToFavoriteGameList(String(game.id))
                    }}
                    removeFromFavorite={() => removeFromFavoriteGameList(String(game.id))}
                    startPlaying={() => navigate(`/${lang()}/games/${game.slug}`)}
                    isMobile={isMobile}
                    agregator_image={game.agregator_image}
                    gameId={game.game_id}
                    gameCardStyle={fillSlideStyle}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </SwiperContainer>
    </Root>
  )
}

export default GameSwiper

const Root = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0px;
  gap: 6px;
`

const HeaderContainer = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '0px' : '0px 16px')};
  display: flex;
  justify-content: space-between;
`

const HeaderContainerLeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const HeaderContainerTitle = styled.span<{ $isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  margin: 0;
`

const TitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.accent.primary};
`

const HeaderContainerSeeAll = styled.span<{ $isMobile: boolean; $accent?: boolean }>`
  margin-left: 8px;
  color: ${({ $accent, theme }) => ($accent ? theme.colors.accent.primary : theme.colors.success)};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  cursor: pointer;
`

const ButtonsContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '16px')};
`

const SwiperContainer = styled.div``

const LoadingContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
  overflow: hidden;
  max-height: 200px;
`

const IconWrapper = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
`
