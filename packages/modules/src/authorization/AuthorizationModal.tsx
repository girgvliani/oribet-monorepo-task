import { zIndex } from '@oribet/ui'
import { IconClose } from '@oribet/assets/icons/IconClose'
import AuthorizationContent from './AuthorizationContent'
import { CustomModal } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useMediaQuery } from '@oribet/core/hooks/useMediaQuery'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { AUTH_TEST_IDS } from '@oribet/test-ids'

interface IAuthorization {
  open: boolean
  onClose: () => void
  isRegistrationOpen: boolean
  setIsOpenResetPasswordModal: (isOpen: boolean) => void
}

const AuthorizationModal = ({
  open,
  onClose,
  isRegistrationOpen,
  setIsOpenResetPasswordModal,
}: IAuthorization) => {
  const isMobile = useIsMobile()
  const isShortScreen = useMediaQuery('(max-height:660px)')
  const theme = useTheme()
  const { i18n } = useTranslation()
  const isKorean = i18n.language?.toLowerCase().startsWith('ko')
  const bannerUrl = isKorean ? '/imgs/auth/log-in-banner_kr.png' : '/imgs/auth/login-banner.png'

  const getBody = () => {
    return (
      <Root
        $isMobile={isMobile}
        style={{
          height: isMobile ? '100vh' : isShortScreen ? '100%' : '660px',
        }}
      >
        {!isMobile && (
          <LeftSideContainer $bannerUrl={bannerUrl}>
            <CloseButton data-testid={AUTH_TEST_IDS.modal.closeDesktop} onClick={onClose}>
              <IconClose style={{ color: theme.colors.text.primary }} />
            </CloseButton>
          </LeftSideContainer>
        )}
        <AuthorizationContent
          onClose={onClose}
          isRegistrationOpen={isRegistrationOpen}
          setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
        />
      </Root>
    )
  }

  return isMobile ? (
    open && <MobileModal>{getBody()}</MobileModal>
  ) : (
    // idmap-ignore: structural wrapper — modal root id (auth.modal.root) is on the inner AuthorizationContent
    <CustomModal
      open={open}
      onClose={onClose}
      shouldBeScreenHeight={isShortScreen}
      customStyle={{ borderRadius: '0px' }}
    >
      {getBody()}
    </CustomModal>
  )
}

export default AuthorizationModal

const Root = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '888px')};
  border-radius: ${({ $isMobile }) => ($isMobile ? '0px' : '12px')};
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
`

const LeftSideContainer = styled.div<{ $bannerUrl: string }>`
  min-width: 360px;
  display: flex;
  justify-content: center;
  background-image: url(${({ $bannerUrl }) => $bannerUrl});
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const CloseButton = styled.span`
  position: absolute;
  cursor: pointer;
  z-index: 2;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 16px;
  top: 16px;

  & .MuiSvgIcon-root {
    color: ${({ theme }) => theme.colors.text.primary};
    width: 9px;
    height: 9px;
  }
`

const MobileModal = styled.div`
  position: fixed;
  width: 100%;
  z-index: ${zIndex.dropdown};
  top: 0;
`
