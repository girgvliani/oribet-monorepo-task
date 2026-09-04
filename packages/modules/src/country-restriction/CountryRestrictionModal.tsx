import { fontSize, zIndex } from '@oribet/ui'
import { LogoMain } from '@oribet/assets/logos/LogoMain'
import { CustomPrimaryButton } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface ICountryRestrictionModal {
  open: boolean
}

const CountryRestrictionModal = ({ open }: ICountryRestrictionModal) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  const handleButtonClick = () => {
    window.open('https://t.me/oribetofficial', '_blank')
  }

  return (
    <>
      {open && (
        <>
          {!isMobile && (
            <DesktopRoot data-testid={NAV_TEST_IDS.countryRestriction.root}>
              <LogoMain
                style={{
                  marginTop: '48px',
                  marginBottom: '48px',
                  flexShrink: 0,
                }}
                width={125}
                height={32}
              />
              <ContentWrapper>
                <Title>{t('vpn.header').toUpperCase()}</Title>
                <Description>
                  <DescWhite>{t('vpn.desc1').toUpperCase()}</DescWhite>
                  <DescBlue>{t('vpn.desc2').toUpperCase()}</DescBlue>
                  <DescWhite>{t('vpn.desc3').toUpperCase()}</DescWhite>
                </Description>
                <ButtonWrapper>
                  <CustomPrimaryButton
                    onClick={handleButtonClick}
                    testId={NAV_TEST_IDS.countryRestriction.support}
                  >
                    {t('vpn.button').toUpperCase()}
                  </CustomPrimaryButton>
                </ButtonWrapper>
              </ContentWrapper>
            </DesktopRoot>
          )}
          {isMobile && (
            <MobileRoot data-testid={NAV_TEST_IDS.countryRestriction.root}>
              <BackgroundImage src="/imgs/vpn/background.png" />
              <LogoMain
                style={{
                  marginTop: '48px',
                  marginBottom: '48px',
                  flexShrink: 0,
                }}
                width={78}
                height={20}
              />
              <MobileContentWrapper>
                <MobileTitle>{t('vpn.header').toUpperCase()}</MobileTitle>
                <MobileDescription>
                  <DescWhite>{t('vpn.desc1').toUpperCase()}</DescWhite>
                  <DescBlue>{t('vpn.desc2').toUpperCase()}</DescBlue>
                  <DescWhite>{t('vpn.desc3').toUpperCase()}</DescWhite>
                </MobileDescription>
              </MobileContentWrapper>
              <MobileButtonWrapper>
                <CustomPrimaryButton
                  onClick={handleButtonClick}
                  testId={NAV_TEST_IDS.countryRestriction.support}
                >
                  {t('vpn.button').toUpperCase()}
                </CustomPrimaryButton>
              </MobileButtonWrapper>
            </MobileRoot>
          )}
        </>
      )}
    </>
  )
}

export default CountryRestrictionModal

const DesktopRoot = styled.div`
  position: fixed;
  z-index: ${zIndex.max};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('/public/imgs/vpn/background.png');
  background-size: cover;
  background-position: center;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: center;
  height: 100%;
`

const Title = styled.h1`
  font-family: 'Titillium Web', sans-serif;
  font-size: 58px;
  font-weight: 700;
  line-height: 56px;
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 750px;
  text-align: center;
`

const Description = styled.p`
  font-size: 34px;
  margin-top: 16px;
  text-align: center;
`

const DescWhite = styled.span`
  font-family: 'Dela Gothic One', cursive;
  color: ${({ theme }) => theme.colors.text.primary};
`

const DescBlue = styled.span`
  font-family: 'Dela Gothic One', cursive;
  color: ${({ theme }) => theme.colors.accent.brand};
`

const ButtonWrapper = styled.div`
  margin-top: 40px;
`

const MobileRoot = styled.div`
  position: fixed;
  z-index: ${zIndex.max};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BackgroundImage = styled.img`
  width: 180%;
  height: 60%;
  position: absolute;
  top: -30%;
`

const MobileContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30%;
  align-self: center;
  height: 100%;
  z-index: ${zIndex.max};
`

const MobileTitle = styled.h1`
  font-family: 'Titillium Web', sans-serif;
  font-size: ${fontSize['2xl']};
  font-weight: 700;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 340px;
  text-align: center;
`

const MobileDescription = styled.p`
  font-size: ${fontSize.sm};
  margin-top: 16px;
  text-align: center;
`

const MobileButtonWrapper = styled.div`
  margin-bottom: 40px;
`
