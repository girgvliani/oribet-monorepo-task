import { IconChevronLeft } from '@oribet/assets/icons/IconChevronLeft'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { IconProvider } from '@oribet/assets/icons/IconProvider'
import ProviderCardItem, { type ProviderCardVariant } from './ProviderCardItem'
import { CustomMinimalButton } from '@oribet/ui'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { IProvider } from '@oribet/core/types/Game.type'

export interface ProviderSwiperModuleProps {
  /** i18n key for the section title. Default `games.providers`. */
  titleKey?: string
  /** Show the provider icon next to the title. Default true. */
  showIcon?: boolean
  /** Show the "see all" link next to the title. Default true. */
  showSeeAll?: boolean
  /** Card style — `imageOnly` drops title/game-count. Default `full`. */
  cardVariant?: ProviderCardVariant
  /** Base path each provider card links to (`?provider=<id>` appended). Defaults to the slots list. */
  cardTo?: string
}

const ProviderSwiperModule = ({
  titleKey = 'games.providers',
  showIcon = true,
  showSeeAll = true,
  cardVariant = 'full',
  cardTo,
}: ProviderSwiperModuleProps = {}) => {
  const isMobile = useIsMobile()
  const providers = useAppSelector(state => state.game.providers)
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const swiperRef = useRef<any>(null)

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
    swiperInstance.on('slideChange', updateButtonStates)

    return () => {
      swiperInstance.off('slideChange', updateButtonStates)
    }
  }, [providers])

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
  }, [providers])

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
  }, [providers])

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
  }, [providers])

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
          {showIcon && <IconProvider style={{ color: theme.colors.text.secondary }} />}
          <HeaderContainerTitle $isMobile={isMobile}>{t(titleKey)}</HeaderContainerTitle>
          {showSeeAll && (
            <HeaderContainerSeeAll
              $isMobile={isMobile}
              data-testid={`${DISCOVERY_TEST_IDS.swiper.seeAll}.providers`}
              onClick={() => navigate(AppRoutePath.PROVIDER_LIST_PAGE())}
            >
              {t('common.seeAll')}
            </HeaderContainerSeeAll>
          )}
        </HeaderContainerLeftSide>
        <ButtonsContainer $isMobile={isMobile}>
          <CustomMinimalButton
            style={{
              minWidth: '0px',
              padding: isMobile ? '6px' : '10px',
              height: isMobile ? '32px' : '40px',
              width: isMobile ? '32px' : '40px',
            }}
            onClick={() => goLeft()}
            disabled={isAtBeginning}
            testId={`${DISCOVERY_TEST_IDS.swiper.prev}.providers`}
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
            testId={`${DISCOVERY_TEST_IDS.swiper.next}.providers`}
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
          {providers.map((provider: IProvider, index: number) => {
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
                  <ProviderCardItem provider={provider} variant={cardVariant} to={cardTo} />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </SwiperContainer>
    </Root>
  )
}
export default ProviderSwiperModule

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
  line-height: 24px;
  text-transform: uppercase;
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
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '16px')};
`

const SwiperContainer = styled.div``
