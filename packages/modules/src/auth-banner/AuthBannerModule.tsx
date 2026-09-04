import { redirectToGoogleAuth } from '@oribet/core/util/googleAuth'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { changeGlobalUserLoginModalOpen } from '@oribet/core/redux/slices/userSlice'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { IconGoogleAuth } from '@oribet/assets/icons/IconGoogleAuth'
import { CustomPrimaryButton, fontSize } from '@oribet/ui'
import { SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { useShouldRender } from '../page-editor/useShouldRender'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import type { ModuleProps } from '../page-editor/types'

const AuthBannerModule = ({ visible }: ModuleProps = {}) => {
  const isMobile = useIsMobile()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const shouldRender = useShouldRender(visible)
  if (!shouldRender) return null

  const isKorean = i18n.language?.toLowerCase().startsWith('ko')
  const bannerSrc = isKorean ? '/imgs/lobby/home-banner_kr.png' : '/imgs/lobby/home-banner.png'

  const openLoginPage = () => {
    dispatch(changeGlobalUserLoginModalOpen(true))
  }

  const onGoogleAuth = (event: SyntheticEvent): void => {
    event.preventDefault()
    // No currency on this entry; a new player gets the picker reactively when the
    // backend returns `error_type=player_not_registered_need_wallet`.
    redirectToGoogleAuth()
  }

  return (
    <BannerContainerWrapper $isMobile={isMobile}>
      <BannerDescriptionContainer $isMobile={isMobile}>
        <BannerContainerText>{t('auth.getStarted')}</BannerContainerText>
        <BannerDesc>{t('auth.experienceInnovation')}</BannerDesc>
        <CustomPrimaryButton
          style={{ textTransform: 'uppercase' }}
          onClick={openLoginPage}
          testId={DISCOVERY_TEST_IDS.banner.authLogin}
        >
          {t('auth.login')}
        </CustomPrimaryButton>
        <DirectlyJoin>{t('auth.directlyJoinWith')}</DirectlyJoin>
        <ExternalAuthBtnContainer>
          <ExternalAuthBtn
            onClick={onGoogleAuth}
            data-testid={DISCOVERY_TEST_IDS.banner.googleAuth}
          >
            <IconGoogleAuth style={{ color: theme.colors.text.primary }} />{' '}
            <span>{t('auth.google')}</span>
          </ExternalAuthBtn>
        </ExternalAuthBtnContainer>
      </BannerDescriptionContainer>
      <img
        src={bannerSrc}
        alt={'home_page_banner_Unauthorized'}
        style={{
          objectFit: 'cover',
          position: 'absolute',
          width: '100%',
          height: '424px',
          objectPosition: 'left',
        }}
      />
    </BannerContainerWrapper>
  )
}

export default AuthBannerModule

const BannerContainerText = styled.h1`
  font-size: ${fontSize['2xl']};
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0.5px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  margin-bottom: 8px;
`

const BannerDescriptionContainer = styled.div<{ $isMobile: boolean }>`
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 320px;
  align-items: center;
  margin-left: ${({ $isMobile }) => ($isMobile ? '0px' : '10%')};
`

const BannerDesc = styled.h1`
  font-size: ${fontSize.xl};
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0.5px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 32px;
`

const ExternalAuthBtnContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
`

const ExternalAuthBtn = styled.div`
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface.hover};
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.3s;
  gap: 16px;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.active};
  }

  & span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${fontSize.base};
    line-height: 24px;
    font-weight: 700;
    text-transform: uppercase;
  }
`

const DirectlyJoin = styled.span`
  margin: 16px 0px;
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const BannerContainerWrapper = styled.div<{ $isMobile: boolean }>`
  height: 424px;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: ${({ $isMobile }) => ($isMobile ? 'center' : 'left')};
  border-radius: 16px;
`
