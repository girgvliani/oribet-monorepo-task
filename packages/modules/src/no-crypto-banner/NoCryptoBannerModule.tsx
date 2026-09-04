import { fontSize, media } from '@oribet/ui'
import { LogoApplePay } from '@oribet/assets/logos/LogoApplePay'
import { LogoMasterCard } from '@oribet/assets/logos/LogoMasterCard'
import { LogoVisa } from '@oribet/assets/logos/LogoVisa'
import { CustomPrimaryButton } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsUserAuthorized } from '@oribet/core/redux/selectors'
import { changeGlobalUserLoginModalOpen } from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

const NoCryptoBannerModule = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isUserAuthenticated = useAppSelector(selectIsUserAuthorized)

  return (
    <Root>
      <div className="left-side">
        <div className="title-group">
          <NoCrypto>{t('lobby.noCrypto')}</NoCrypto>
          <NoProblem>{t('lobby.noProblem')}</NoProblem>
        </div>
        <div className="cards-container">
          <LogoMasterCard style={{ color: theme.colors.text.primary }} />
          <LogoVisa style={{ color: theme.colors.text.primary }} />
          <LogoApplePay style={{ color: theme.colors.text.primary }} />
          <Divider />
        </div>
      </div>

      <CustomPrimaryButton
        style={{ textTransform: 'uppercase' }}
        testId={DISCOVERY_TEST_IDS.banner.noCryptoCta}
        onClick={() =>
          !isUserAuthenticated
            ? dispatch(changeGlobalUserLoginModalOpen(true))
            : navigate(AppRoutePath.DEPOSIT())
        }
      >
        {t('lobby.buyNow')}
      </CustomPrimaryButton>
    </Root>
  )
}

export default NoCryptoBannerModule

// Styled Components

const Root = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-width: 0px;
  height: 82px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.gradient.noCryptoBanner};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 32px;
  padding-right: 20px;

  .left-side {
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-right: 32px;
  }

  .title-group {
    display: flex;
    align-items: center;
  }

  .cards-container {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  ${media.md} {
    margin: 24px 0;
    padding: 18px 16px;
    flex-direction: row;

    .left-side {
      flex-direction: column;
      align-items: flex-start;
      flex-grow: initial;
    }

    h2 {
      font-size: ${fontSize.base};
      line-height: 24px;
      margin-bottom: 8px;
    }

    svg {
      height: 14px;
      width: auto;
    }

    .cards-container {
      gap: 12px;
    }
  }
`

const NoCrypto = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: ${fontSize.xl};
  line-height: 32px;
  text-transform: uppercase;
`

const NoProblem = styled.h2`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.xl};
  line-height: 32px;
  text-transform: uppercase;
`

const Divider = styled.div`
  background: rgba(255, 255, 255, 0.1);
  width: 1px;
  height: 32px;

  ${media.md} {
    display: none;
  }
`
