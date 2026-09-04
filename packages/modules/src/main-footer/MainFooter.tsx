import { fontSize } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { getStaticPages } from '@oribet/core/api/services/Policies.api'
import { IconEighteenPlus } from '@oribet/assets/icons/IconEighteenPlus'
import { LogoApplePay } from '@oribet/assets/logos/LogoApplePay'
import { LogoBitCoin } from '@oribet/assets/logos/LogoBitCoin'
import { LogoBitCoinCash } from '@oribet/assets/logos/LogoBitCoinCash'
import { LogoEthereum } from '@oribet/assets/logos/LogoEthereum'
import { LogoLiteCoin } from '@oribet/assets/logos/LogoLiteCoin'
import { LogoMain } from '@oribet/assets/logos/LogoMain'
import { LogoMasterCard } from '@oribet/assets/logos/LogoMasterCard'
import { LogoRipple } from '@oribet/assets/logos/LogoRipple'
import { LogoTether } from '@oribet/assets/logos/LogoTether'
import { LogoTron } from '@oribet/assets/logos/LogoTron'
import { LogoVisa } from '@oribet/assets/logos/LogoVisa'
import { useWidgetIsReady, useWidgetState } from '@livechat/widget-react'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { generalTermsOfServices } from '@oribet/core/redux/slices/settingsSlice'
import { useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

interface SocialIcon {
  icon: ReactElement
  link: string
  title: string
  isTwitter?: boolean
}

interface AboutUsItem {
  title: string
  url?: string | any
  isLiveSupport?: boolean
  isReactRoute?: boolean
}

interface IMainFooter {
  isMobile: boolean
  aboutUsItems: AboutUsItem[]
  socialIcons: SocialIcon[]
  customLogo?: string | ReactNode | undefined
}

const MainFooter = ({ isMobile, customLogo, aboutUsItems, socialIcons }: IMainFooter) => {
  const lang = useAppSelector(state => state.user.language)
  const termsOfServices = useAppSelector(state => state.settings.termsOfServices)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  const openNewTab = (link: string) => {
    window.open(link, '_blank')
  }

  const widgetState = useWidgetState()
  const isWidgetReady = useWidgetIsReady()

  const openLiveSupport = () => {
    if (window.LiveChatWidget) {
      window.LiveChatWidget.call('maximize')
    }
  }

  useEffect(() => {
    getStaticPages()
      .then(res => {
        dispatch(generalTermsOfServices(res.data.data))
      })
      .catch(err => {
        enqueueSnackbar(err?.data?.data?.message || '', {
          variant: 'error',
        })
      })
  }, [lang])

  return (
    <Root $isMobile={isMobile}>
      {isMobile && <div></div>}
      <Coins $isMobile={isMobile}>
        {isMobile ? (
          <>
            <div>
              <LogoLiteCoin />
              <LogoEthereum />
              <LogoBitCoin />
            </div>
            <div>
              <LogoTron />
              <LogoMasterCard />
              <LogoVisa />
              <LogoApplePay />
            </div>
            <div>
              <LogoRipple />
              <LogoBitCoinCash />
              <LogoTether />
            </div>
          </>
        ) : (
          <>
            <LogoLiteCoin />
            <LogoEthereum />
            <LogoBitCoin />
            <LogoTron />
            <LogoMasterCard />
            <LogoVisa style={{ color: theme.colors.surface.active }} />
            <LogoApplePay />
            <LogoRipple />
            <LogoBitCoinCash />
            <LogoTether />
          </>
        )}
      </Coins>
      <Main $isMobile={isMobile}>
        <Description>
          <div>
            {customLogo && typeof customLogo === 'string' ? (
              <img src={customLogo} alt="Logo" />
            ) : customLogo ? (
              customLogo
            ) : (
              <LogoMain style={{ color: theme.colors.text.primary }} />
            )}
          </div>
          <span>{t('footer.Description')}</span>
        </Description>
        <Info $isMobile={isMobile}>
          <div>
            <div>{t('footer.TermsOfServices')}</div>
            {termsOfServices.length &&
              termsOfServices.map((item: any) => (
                <span
                  key={item.id}
                  data-testid={`${NAV_TEST_IDS.footer.aboutLink}.${item.slug}`}
                  onClick={() => navigate(`/${lang}/policies/${item.slug}`)}
                >
                  {item.title}
                </span>
              ))}
          </div>

          <div>
            <div>{t('footer.AboutUs')}</div>
            {aboutUsItems.map(({ title, url, isReactRoute }) => (
              <span
                key={title}
                data-testid={`${NAV_TEST_IDS.footer.aboutLink}.${title.split('.').pop()}`}
                onClick={() =>
                  isReactRoute ? navigate(url) : !url ? openLiveSupport() : openNewTab(url)
                }
              >
                {t(title)}
              </span>
            ))}
          </div>

          <div>
            <div>{t('footer.Community')}</div>
            {socialIcons.map(({ link, icon, title, isTwitter }, index) => (
              <SocialIconItem
                key={index}
                data-testid={`${NAV_TEST_IDS.footer.socialLink}.${title.split('.').pop()}`}
                onClick={() => openNewTab(link)}
              >
                {icon}
                {isTwitter ? title : t(title)}
              </SocialIconItem>
            ))}
          </div>
        </Info>
      </Main>

      <License $isMobile={isMobile}>
        <div
          id="anj-d4ef436d-a7be-4740-b197-50713eecd288"
          data-anj-seal-id="d4ef436d-a7be-4740-b197-50713eecd288"
          data-anj-image-size="50"
          data-anj-image-type="basic-small"
          style={{ marginRight: isMobile ? '10px' : '54px' }}
        ></div>
        <IconEighteenPlus size={38} style={{ color: theme.colors.icon.subtle }} />
      </License>
    </Root>
  )
}

export default React.memo(MainFooter)

const Root = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? '0' : '24px')};
  border-top: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.bg.footer};
  color: ${({ theme }) => theme.colors.text.primary};
  box-sizing: border-box;
`

const Coins = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0 0 24px 0;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
  gap: ${({ $isMobile }) => ($isMobile ? '10px' : '0')};

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    width: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
  }

  & svg {
    color: ${({ theme }) => theme.colors.surface.active};
    cursor: pointer;

    & path {
      transition: fill 0.3s ease-in-out;
    }

    &:hover {
      & path {
        fill: ${({ theme }) => theme.colors.text.primary} !important;
      }
    }
  }
`

const Main = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? '30px' : '96px')};
  padding: 24px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 10px;
  }
`

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;

  & span {
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-size: ${fontSize.xs};
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }
`

const Info = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-grow: 1;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;

    & > div:first-child {
      color: ${({ theme }) => theme.colors.text.primary};
      font-size: ${fontSize.sm};
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      text-transform: uppercase;
    }

    & span {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${fontSize.base};
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      opacity: 0.92;
      cursor: pointer;
    }
  }

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 10px;
  }
`

const SocialIconItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

const License = styled.div<{ $isMobile: boolean }>`
  display: flex;
  padding-top: 24px;
  padding-left: 16px;
  align-items: center;

  & .iFrame {
    border: none;
    overflow: hidden;
  }
`
