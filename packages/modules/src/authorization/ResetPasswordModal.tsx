import { IconClose } from '@oribet/assets/icons/IconClose'
import { CustomPrimaryButton } from '@oribet/ui'
import { CustomInput } from '@oribet/ui'
import { CustomModal } from '@oribet/ui'
import { CheckEmailValidation } from '@oribet/core/util/appUtil'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { AUTH_TEST_IDS } from '@oribet/test-ids'

interface ResetPasswordModalProps {
  setIsOpenResetPasswordModal: (isOpen: boolean) => void
  isOpenResetPasswordModal: boolean
  onResetPassword: (email: string) => void
}

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({
  setIsOpenResetPasswordModal,
  isOpenResetPasswordModal,
  onResetPassword,
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [email, setEmail] = useState<string>('')

  const handleResetPassword = () => {
    if (email.trim() === '') {
      enqueueSnackbar(t('auth.emailRequired'), { variant: 'error' })
    } else if (!CheckEmailValidation(email)) {
      enqueueSnackbar(t('auth.emailInvalid'), { variant: 'error' })
    } else {
      onResetPassword(email)
    }
  }

  return (
    <CustomModal
      open={isOpenResetPasswordModal}
      onClose={() => setIsOpenResetPasswordModal(false)}
      customStyle={{ width: isMobile ? '85%' : '' }}
      testId={AUTH_TEST_IDS.resetModal.root}
    >
      <Root $isMobile={isMobile}>
        <Header>
          <span>{t('auth.resetPassword')}</span>
          <CloseButton
            data-testid={AUTH_TEST_IDS.resetModal.close}
            onClick={() => setIsOpenResetPasswordModal(false)}
          >
            <IconClose />
          </CloseButton>
        </Header>

        <EmailPart>
          <EmailPartContainer>
            <CustomInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
              label={t('auth.email')}
              placeholder={t('auth.enterYourEmail')}
              onKeyPress={handleResetPassword}
              isGap
              testId={AUTH_TEST_IDS.resetModal.emailInput}
            />
          </EmailPartContainer>
        </EmailPart>

        <ButtonContainer>
          <CustomPrimaryButton
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={handleResetPassword}
            testId={AUTH_TEST_IDS.resetModal.submit}
          >
            {t('auth.resetPassword')}
          </CustomPrimaryButton>
        </ButtonContainer>
      </Root>
    </CustomModal>
  )
}

export default ResetPasswordModal

const Root = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '416px')};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: rgb(0 0 0 / 50%);
`

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;

  & span {
    line-height: 24px;
    font-weight: 600;
    font-size: ${fontSize.lg};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.secondary};
    width: 20px;
    height: 20px;
  }
`

const EmailPart = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
`

const EmailPartContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`

const ButtonContainer = styled.div`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
`
