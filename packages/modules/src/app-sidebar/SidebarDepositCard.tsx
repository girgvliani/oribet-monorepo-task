import { LogoApplePay } from '@oribet/assets/logos/LogoApplePay'
import { LogoGooglePayWhite } from '@oribet/assets/logos/LogoGooglePayWhite'
import { LogoMasterCard } from '@oribet/assets/logos/LogoMasterCard'
import { LogoVisa } from '@oribet/assets/logos/LogoVisa'
import { CustomPrimaryButton } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeGlobalDepositModal, changeGlobalUserLoginModalOpen } from '@oribet/core/redux/slices/userSlice'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const SidebarDepositCard = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isUserAuthenticated = useAppSelector(state => !!state.user.isUserAuthorized)

  const handleClick = () => {
    if (!isUserAuthenticated) {
      dispatch(changeGlobalUserLoginModalOpen(true))
    } else {
      dispatch(changeGlobalDepositModal(true))
    }
  }

  return (
    <Root>
      <LogosRow>
        <LogoVisa />
        <LogoMasterCard />
        <LogoApplePay />
        <LogoGooglePayWhite />
      </LogosRow>
      <CustomPrimaryButton
        fullWidth="100%"
        style={{ textTransform: 'uppercase', width: '100%' }}
        onClick={handleClick}
        testId={NAV_TEST_IDS.sidebar.depositCard}
      >
        {t('account.deposit')}
      </CustomPrimaryButton>
    </Root>
  )
}

export default SidebarDepositCard

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
`

const LogosRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 8px;
  width: 100%;
  box-sizing: border-box;

  & svg {
    height: 16px;
    width: auto;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`
