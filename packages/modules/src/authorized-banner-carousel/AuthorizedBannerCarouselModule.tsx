import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { loadBanners } from '@oribet/core/api/services/Banners.api'
import { CustomMinimalButton } from '@oribet/ui'
import { Skeleton } from '@oribet/ui'
import BannerSkeleton from './BannerSkeleton'
import { IconChevronLeft } from '@oribet/assets/icons/IconChevronLeft'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { getUserLanguage, SupportedLanguage, supportedLanguages } from '@oribet/core/util/appUtil'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { media } from '@oribet/ui'
import styled from 'styled-components'
import SwiperCore from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { IBannerBlog } from '@oribet/core/types/common.type'
import { useShouldRender } from '../page-editor/useShouldRender'
import type { AuthVisibility } from '../page-editor/types'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

// test change

SwiperCore.use([Pagination])

interface IAuthorizedBannerCarousel {
  className?: string
  isChatAndSideOpen?: boolean
  visible?: AuthVisibility
}

const AuthorizedBannerCarouselModule: React.FC<IAuthorizedBannerCarousel> = ({
  isChatAndSideOpen = false,
  visible,
}) => {
  const swiperRef = useRef<any>(null)
  const isMobile = useIsMobile()
  const shouldRender = useShouldRender(visible)
  if (!shouldRender) return null
  const [slidePerView, setSlidePerView] = useState<number>(3)
  const [bannersLoading, setBannersLoading] = useState<boolean>(false)
  const [banners, setBanners] = useState<{ data: IBannerBlog; success: boolean } | undefined>()
  const [isInitialSkeleton, setIsInitialSkeleton] = useState<boolean>(true)
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  useEffect(() => {
    getBanners()
    setIsFirstRender(true)
  }, [])

  const getBanners = () => {
    setBannersLoading(true)
    loadBanners()
      .then(resp => {
        setBanners(resp.data)
      })
      .catch(() => {})
      .finally(() => {
        setBannersLoading(false)
      })
  }

  const handleLeftButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleRightButtonClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  useEffect(() => {
    const slidePerView =
      banners && banners.data && Array.isArray(banners.data) && banners.data.length < 3
        ? 2
        : window.innerWidth > 1200
          ? !isChatAndSideOpen
            ? 3
            : 2
          : window.innerWidth < 900
            ? isChatAndSideOpen
              ? 2
              : 1
            : 2

    setSlidePerView(slidePerView)
  }, [banners, isChatAndSideOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setSlidePerView(1)
      } else if (window.innerWidth < 1100) {
        setSlidePerView(2)
      } else {
        setSlidePerView(3)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const addLangRouteToTheUrl = (url = '') => {
    const userLang = getUserLanguage()
    if (url) {
      // First check if the URL already has the {lang} placeholder
      if (url?.includes('{lang}')) {
        return url.replace('{lang}', userLang)
      }

      try {
        // Parse the URL
        const urlObj = new URL(url)

        // Check if it's our domain
        if (urlObj.hostname.includes('oribet.io')) {
          // Get pathname without leading slash and split into parts
          const pathParts = urlObj.pathname.split('/').filter(Boolean)

          // Create a new clean path array
          const newPathParts = [...pathParts]
          let hasLanguageRoute = false

          // Check if any path part is a language code
          for (let i = 0; i < newPathParts.length; i++) {
            if (supportedLanguages.includes(newPathParts[i] as SupportedLanguage)) {
              // Found a language code
              if (newPathParts[i] !== userLang) {
                // Replace with user's language if different
                newPathParts[i] = userLang
              }
              hasLanguageRoute = true
              break // Only replace the first language code found
            }
          }

          // If no language route found, add user's language at the beginning
          if (!hasLanguageRoute) {
            newPathParts.unshift(userLang)
          }

          // Rebuild the URL with new path
          urlObj.pathname = '/' + newPathParts.join('/')
          return urlObj.toString()
        }

        // Return original URL if it's an external link
        return url
      } catch (e) {
        // If URL parsing fails, try basic string manipulation
        if (url.startsWith('http')) {
          // For absolute URLs
          const domainEndIndex = url.indexOf('/', 8) // Skip http:// or https://
          if (domainEndIndex !== -1) {
            const path = url.slice(domainEndIndex + 1)
            const pathParts = path.split('/').filter(Boolean)
            let hasLanguageRoute = false

            // Check if any path part is a language code
            for (let i = 0; i < pathParts.length; i++) {
              if (supportedLanguages.includes(pathParts[i] as SupportedLanguage)) {
                // Found a language code
                if (pathParts[i] !== userLang) {
                  // Replace with user's language if different
                  pathParts[i] = userLang
                }
                hasLanguageRoute = true
                break // Only replace the first language code found
              }
            }

            // If no language route found, add user's language at the beginning
            if (!hasLanguageRoute) {
              pathParts.unshift(userLang)
            }

            // Rebuild the URL with new path
            return url.slice(0, domainEndIndex) + '/' + pathParts.join('/')
          }
        } else if (url.startsWith('/')) {
          // For relative URLs
          const pathParts = url.split('/').filter(Boolean)
          let hasLanguageRoute = false

          // Check if any path part is a language code
          for (let i = 0; i < pathParts.length; i++) {
            if (supportedLanguages.includes(pathParts[i] as SupportedLanguage)) {
              // Found a language code
              if (pathParts[i] !== userLang) {
                // Replace with user's language if different
                pathParts[i] = userLang
              }
              hasLanguageRoute = true
              break // Only replace the first language code found
            }
          }

          // If no language route found, add user's language at the beginning
          if (!hasLanguageRoute) {
            pathParts.unshift(userLang)
          }

          // Rebuild the URL with new path
          return '/' + pathParts.join('/')
        }

        // If all else fails, return original URL
        return url
      }
    }
    return `/${userLang}`
  }

  const sortedData: IBannerBlog[] | undefined =
    banners && banners.data && Array.isArray(banners.data)
      ? [...banners.data].sort((a: IBannerBlog, b: IBannerBlog) => b.id - a.id)
      : undefined

  const pagination = {
    clickable: true,
    loop: true,
    dynamicBullets: true,
    dynamicMainBullets: 10,
  }

  return (
    <Container $isMobile={isMobile}>
      <NavButtonContainer $isMobile={isMobile}>
        {!isMobile && !bannersLoading && sortedData?.length !== 0 && (
          <CustomMinimalButton
            style={{
              padding: isMobile ? '6px' : '10px',
              height: isMobile ? '32px' : '40px',
              minWidth: '0px',
              width: isMobile ? '32px' : '40px',
              justifyContent: 'center',
              marginBottom: '110%',
            }}
            onClick={() => handleLeftButtonClick()}
            testId={`${DISCOVERY_TEST_IDS.swiper.prev}.promo-carousel`}
          >
            <span style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <IconChevronLeft />
            </span>
          </CustomMinimalButton>
        )}
        {bannersLoading && <BannerSkeleton slidePerView={slidePerView} />}
        {!bannersLoading && sortedData && (
          <SwiperContainer
            slidesPerView={isMobile ? 1.15 : slidePerView}
            spaceBetween={24}
            ref={swiperRef}
            autoplay
            loop
            pagination={pagination}
            modules={[Pagination, Autoplay]}
          >
            {isInitialSkeleton &&
              Array.from({ length: 3 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <StyledSkeleton key={index} variant="rectangular" />
                </SwiperSlide>
              ))}
            {sortedData.map((item: IBannerBlog, index: number) => {
              if (isFirstRender && index + 1 === sortedData.length) {
                setIsInitialSkeleton(false)
                setIsFirstRender(false)
              }
              return (
                <SwiperSlide key={item.id}>
                  <Link
                    to={addLangRouteToTheUrl(item.button_one_url)}
                    style={{ display: 'block' }}
                    data-testid={`${DISCOVERY_TEST_IDS.banner.carouselSlide}.${item.id ?? index}`}
                  >
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={getLocalizedString(item.title)}
                      style={{
                        width: '100%',
                        maxHeight: '220px',
                        borderRadius: '8px',
                      }}
                    />
                  </Link>
                </SwiperSlide>
              )
            })}
          </SwiperContainer>
        )}
        {!isMobile && !bannersLoading && sortedData?.length !== 0 && (
          <CustomMinimalButton
            style={{
              padding: isMobile ? '6px' : '10px',
              height: isMobile ? '32px' : '40px',
              minWidth: '0px',
              width: isMobile ? '32px' : '40px',
              marginBottom: '110%',
            }}
            onClick={() => handleRightButtonClick()}
            testId={`${DISCOVERY_TEST_IDS.swiper.next}.promo-carousel`}
          >
            <span style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <IconChevronRight />
            </span>
          </CustomMinimalButton>
        )}
      </NavButtonContainer>
      {!bannersLoading && (
        <BottomSection>
          <FlexCenter />
        </BottomSection>
      )}
      {isInitialSkeleton && <SkeletonSpacer $isMobile={isMobile} />}
    </Container>
  )
}

export default AuthorizedBannerCarouselModule

const Container = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  padding-top: ${({ $isMobile }) => ($isMobile ? '8px' : '24px')};
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '8px' : '16px')};
  padding-left: ${({ $isMobile }) => ($isMobile ? '0' : '16px')};
  padding-right: ${({ $isMobile }) => ($isMobile ? '0' : '16px')};
  box-sizing: border-box;
`

const NavButtonContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: center;
  max-height: ${({ $isMobile }) => ($isMobile ? '250px' : '300px')};
  height: 100%;

  & .swiper {
    padding-bottom: 34px;

    ${media.md} {
      padding-bottom: 22px;
    }
  }

  & .swiper-wrapper {
    height: ${({ $isMobile }) => ($isMobile ? '186px' : '100%')};
  }

  & .swiper-pagination-bullet {
    background-color: ${({ theme }) => `${theme.colors.text.primary}CC`};
  }

  & .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.text.primary};
  }
`

const SwiperContainer = styled(Swiper)`
  max-width: 1308px;
  margin-right: 20px;
  margin-left: 20px;
  width: 100%;
`

const StyledSkeleton = styled(Skeleton)`
  width: 100%;
  height: 220px;
  min-height: 220px;
  max-height: 220px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.tertiary};
`

const BottomSection = styled.div``

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: flex-end;
  width: auto !important;
`

const SkeletonSpacer = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? '38px' : '54px')};
`
