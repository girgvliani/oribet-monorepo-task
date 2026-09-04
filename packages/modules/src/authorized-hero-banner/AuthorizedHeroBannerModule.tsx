import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { loadBanners } from '@oribet/core/api/services/Banners.api'
import { Skeleton } from '@oribet/ui'
import { getUserLanguage, SupportedLanguage, supportedLanguages } from '@oribet/core/util/appUtil'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import SwiperCore from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { IBannerBlog } from '@oribet/core/types/common.type'
import { useShouldRender } from '../page-editor/useShouldRender'
import type { AuthVisibility } from '../page-editor/types'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

SwiperCore.use([Pagination, Autoplay])

interface IAuthorizedHeroBanner {
  className?: string
  visible?: AuthVisibility
}

const AuthorizedHeroBannerModule: React.FC<IAuthorizedHeroBanner> = ({ visible }) => {
  const shouldRender = useShouldRender(visible)
  const [bannersLoading, setBannersLoading] = useState<boolean>(true)
  const [banners, setBanners] = useState<{ data: IBannerBlog; success: boolean } | undefined>()

  useEffect(() => {
    if (!shouldRender) return
    setBannersLoading(true)
    loadBanners()
      .then(resp => setBanners(resp.data))
      .catch(() => {})
      .finally(() => setBannersLoading(false))
  }, [shouldRender])

  if (!shouldRender) return null

  const addLangRouteToTheUrl = (url = '') => {
    const userLang = getUserLanguage()
    if (!url) return `/${userLang}`
    if (url.includes('{lang}')) return url.replace('{lang}', userLang)
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes('oribet.io')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean)
        let hasLang = false
        for (let i = 0; i < pathParts.length; i++) {
          if (supportedLanguages.includes(pathParts[i] as SupportedLanguage)) {
            if (pathParts[i] !== userLang) pathParts[i] = userLang
            hasLang = true
            break
          }
        }
        if (!hasLang) pathParts.unshift(userLang)
        urlObj.pathname = '/' + pathParts.join('/')
        return urlObj.toString()
      }
      return url
    } catch {
      return url
    }
  }

  const sortedData: IBannerBlog[] | undefined =
    banners && banners.data && Array.isArray(banners.data)
      ? [...banners.data].sort((a: IBannerBlog, b: IBannerBlog) => b.id - a.id)
      : undefined

  return (
    <Container>
      {bannersLoading && <StyledSkeleton variant="rectangular" />}
      {!bannersLoading && sortedData && sortedData.length > 0 && (
        <StyledSwiper
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={sortedData.length > 1}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
        >
          {sortedData.map((item: IBannerBlog) => (
            <SwiperSlide key={item.id}>
              <SlideLink
                to={addLangRouteToTheUrl(item.button_one_url)}
                data-testid={`${DISCOVERY_TEST_IDS.banner.heroSlide}.${item.id}`}
              >
                <SlideImage
                  src={resolveImageUrl(item.image)}
                  alt={getLocalizedString(item.title)}
                />
              </SlideLink>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      )}
    </Container>
  )
}

export default AuthorizedHeroBannerModule

const Container = styled.div`
  width: 100%;
`

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: clamp(180px, 30vw, 424px);

  & .swiper-pagination-bullet {
    background-color: ${({ theme }) => `${theme.colors.text.primary}CC`};
  }

  & .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.text.primary};
  }
`

const SlideLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 16px;
`

const StyledSkeleton = styled(Skeleton)`
  width: 100%;
  height: clamp(180px, 30vw, 424px);
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bg.tertiary};
`
