import { IconChevronLeft } from '@oribet/assets/icons/IconChevronLeft'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { IconSportAmericanFootball } from '@oribet/assets/icons/IconSportAmericanFootball'
import { IconSportBaseball } from '@oribet/assets/icons/IconSportBaseball'
import { IconSportBasketball } from '@oribet/assets/icons/IconSportBasketball'
import { IconSportCricket } from '@oribet/assets/icons/IconSportCricket'
import { IconSportHandball } from '@oribet/assets/icons/IconSportHandball'
import { IconSportIceHockey } from '@oribet/assets/icons/IconSportIceHockey'
import { IconSportLive } from '@oribet/assets/icons/IconSportLive'
import { IconSportSoccer } from '@oribet/assets/icons/IconSportSoccer'
import { IconSportTennis } from '@oribet/assets/icons/IconSportTennis'
import { IconStar } from '@oribet/assets/icons/IconStar'
import SportCardItem from './SportCardItem'
import { CustomMinimalButton } from '@oribet/ui'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface sportSwiperData {
  text: string
  icon: any
  link: string
}

const SportSwiperModule = () => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useTheme()
  const swiperRef = useRef<any>(null)

  const [isAtBeginning, setIsAtBeginning] = useState(false)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [visibleSlidesCount, setVisibleSlidesCount] = useState(0)
  const [partiallyVisibleSlides, setPartiallyVisibleSlides] = useState(new Set<number>())

  const sportsData: sportSwiperData[] = [
    {
      icon: IconSportLive,
      link: '2Flive',
      text: 'betBy.live',
    },
    {
      icon: IconSportSoccer,
      link: '2Fsoccer-1',
      text: 'betBy.soccer',
    },
    {
      icon: IconSportTennis,
      link: '2Ftennis-5',
      text: 'betBy.tennis',
    },
    {
      icon: IconSportBasketball,
      link: '2Fbasketball-2',
      text: 'betBy.basketball',
    },
    {
      icon: IconSportCricket,
      link: '2Fcricket-21',
      text: 'betBy.cricket',
    },
    {
      icon: IconSportAmericanFootball,
      link: '2Famerican-football-16',
      text: 'betBy.americanFootball',
    },
    {
      icon: IconSportIceHockey,
      link: '2Fice-hockey-4',
      text: 'betBy.iceHockey',
    },
    {
      icon: IconSportBaseball,
      link: '2Fbaseball-3',
      text: 'betBy.baseball',
    },
    {
      icon: IconSportHandball,
      link: '2Fhandball-6',
      text: 'betBy.handball',
    },
  ]

  useEffect(() => {
    const updateButtonStates = () => {
      if (swiperRef.current) {
        setIsAtEnd(swiperRef.current.isEnd)
        setIsAtBeginning(swiperRef.current.isBeginning)
      }
    }

    updateButtonStates()

    const swiperInstance = swiperRef.current
    swiperInstance.on('slideChange', updateButtonStates)

    return () => {
      swiperInstance.off('slideChange', updateButtonStates)
    }
  }, [])

  useEffect(() => {
    const swiperInstance = swiperRef.current
    if (swiperInstance) {
      swiperInstance.on('slideChangeTransitionEnd', updateSlideVisibility)
      swiperInstance.on('init', updateSlideVisibility)
    }
    updateSlideVisibility()
    return () => {
      if (swiperInstance) {
        swiperInstance.off('slideChangeTransitionEnd', updateSlideVisibility)
        swiperInstance.off('init', updateSlideVisibility)
      }
    }
  }, [])

  useEffect(() => {
    const updateSlideVisibility = () => {
      const swiper = swiperRef.current
      if (!swiper || !swiper.slides) return

      const newPartiallyVisibleSlides = new Set<number>()
      swiper.slides.forEach((slide: HTMLElement, index: number) => {
        const slideRect = slide.getBoundingClientRect()
        const swiperRect = swiper.el.getBoundingClientRect()

        const isPartiallyVisible =
          slideRect.left < swiperRect.left || slideRect.right > swiperRect.right

        if (isPartiallyVisible) {
          newPartiallyVisibleSlides.add(index)
        }
      })

      setPartiallyVisibleSlides(newPartiallyVisibleSlides)
    }

    const swiperInstance = swiperRef.current
    if (swiperInstance) {
      swiperInstance.on('init', updateSlideVisibility)
      swiperInstance.on('slideChangeTransitionEnd', updateSlideVisibility)

      updateSlideVisibility()
    }

    window.addEventListener('resize', updateSlideVisibility)

    return () => {
      if (swiperInstance) {
        swiperInstance.off('init', updateSlideVisibility)
        swiperInstance.off('slideChangeTransitionEnd', updateSlideVisibility)
        window.removeEventListener('resize', updateSlideVisibility)
      }
    }
  }, [])

  useEffect(() => {
    const handleResizeOrInit = () => {
      const swiper = swiperRef.current
      if (swiper) {
        swiper.update() // Make sure Swiper updates its internal state
        updateVisibleSlidesCount(swiper)
      }
    }

    const swiperInstance = swiperRef.current
    if (swiperInstance) {
      swiperInstance.on('init', handleResizeOrInit)
    }
    window.addEventListener('resize', handleResizeOrInit)

    // Initial calculation
    if (swiperInstance) {
      handleResizeOrInit()
    }

    return () => {
      window.removeEventListener('resize', handleResizeOrInit)
      if (swiperInstance) {
        swiperInstance.off('init', handleResizeOrInit)
      }
    }
  }, [])

  const updateVisibleSlidesCount = (swiper: any) => {
    if (!swiper || !swiper.slides.length || !swiper.slides[0]) return

    // Assuming swiper.slides[0] exists and has uniform width across all slides
    const slideWidth = swiper.slides[0].offsetWidth + swiper.params.spaceBetween
    const count = Math.floor(swiper.width / slideWidth)
    setVisibleSlidesCount(count)
  }

  const updateSlideVisibility = () => {
    const swiper = swiperRef.current
    if (!swiper) return

    const newPartiallyVisibleSlides = new Set<number>()
    swiper.slides.forEach((slide: HTMLElement, index: number) => {
      const slideLeftEdge = slide.offsetLeft
      const slideRightEdge = slideLeftEdge + slide.offsetWidth
      const swiperVisibleLeftEdge = swiper.translate
      const swiperVisibleRightEdge = swiperVisibleLeftEdge + swiper.width

      if (slideLeftEdge < swiperVisibleLeftEdge || slideRightEdge > swiperVisibleRightEdge) {
        newPartiallyVisibleSlides.add(index)
      }
    })

    setPartiallyVisibleSlides(newPartiallyVisibleSlides)
  }

  const goLeft = () => {
    if (!swiperRef.current) return
    const swiper = swiperRef.current
    const currentIndex = swiper.activeIndex
    const newIndex = Math.max(currentIndex - visibleSlidesCount, 0)
    swiper.slideTo(newIndex)
  }

  const goRight = () => {
    if (!swiperRef.current) return
    const swiper = swiperRef.current
    const currentIndex = swiper.activeIndex
    const slidesCount = swiper.slides.length
    const newIndex = Math.min(currentIndex + visibleSlidesCount, slidesCount - visibleSlidesCount)
    swiper.slideTo(newIndex)
  }

  return (
    <Root $isMobile={isMobile}>
      <HeaderContainer $isMobile={isMobile}>
        <HeaderContainerLeftSide>
          <IconStar style={{ color: theme.colors.text.secondary }} size={16} />
          <HeaderContainerTitle $isMobile={isMobile}>{t('oribetMenu.sports')}</HeaderContainerTitle>
          <HeaderContainerSeeAll
            $isMobile={isMobile}
            data-testid={`${DISCOVERY_TEST_IDS.swiper.seeAll}.sports`}
            onClick={() => navigate(AppRoutePath.PROVIDER_LIST_PAGE())}
          >
            {t('lobby.goToSports')}
          </HeaderContainerSeeAll>
        </HeaderContainerLeftSide>
        <ButtonsContainer $isMobile={isMobile}>
          <CustomMinimalButton
            style={{
              minWidth: '0px',
              width: isMobile ? '32px' : '40px',
              padding: isMobile ? '6px' : '10px',
              height: isMobile ? '32px' : '40px',
            }}
            onClick={() => goLeft()}
            disabled={isAtBeginning}
            testId={`${DISCOVERY_TEST_IDS.swiper.prev}.sports`}
          >
            <span
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconChevronLeft />
            </span>
          </CustomMinimalButton>
          <CustomMinimalButton
            style={{
              padding: isMobile ? '6px' : '10px',
              height: isMobile ? '32px' : '40px',
              minWidth: '0px',
              width: isMobile ? '32px' : '40px',
            }}
            onClick={() => goRight()}
            disabled={isAtEnd}
            testId={`${DISCOVERY_TEST_IDS.swiper.next}.sports`}
          >
            <span
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconChevronRight />
            </span>
          </CustomMinimalButton>
        </ButtonsContainer>
      </HeaderContainer>

      <SwiperContainer>
        <Swiper
          spaceBetween={isMobile ? 8 : 12}
          slidesPerView={'auto'}
          onSlideChange={() => {}}
          onSwiper={swiper => (swiperRef.current = swiper)}
          style={{
            paddingTop: '10px',
          }}
          speed={500}
        >
          {sportsData.map((sport: sportSwiperData, index: number) => {
            const isPartiallyVisible = partiallyVisibleSlides.has(index)
            return (
              <SwiperSlide
                style={{
                  color: theme.colors.text.primary,
                  minWidth: '0px',
                  width: 'fit-content',
                  transition: 'opacity 0.2s ease-in-out',
                  opacity: isPartiallyVisible ? 0.1 : 1,
                }}
                key={index}
              >
                <div key={index}>
                  <SportCardItem sport={sport} />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </SwiperContainer>
    </Root>
  )
}

export default SportSwiperModule

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

const HeaderContainerTitle = styled.h2<{ $isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  text-transform: uppercase;
  line-height: 24px;
  margin: 0;
`

const HeaderContainerSeeAll = styled.span<{ $isMobile: boolean }>`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  cursor: pointer;
`

const ButtonsContainer = styled.div<{ $isMobile: boolean }>`
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '16px')};
  display: flex;
`

const SwiperContainer = styled.div``
