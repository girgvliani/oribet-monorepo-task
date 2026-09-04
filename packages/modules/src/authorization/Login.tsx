import { CustomPrimaryButton } from '@oribet/ui'
import { CustomInput } from '@oribet/ui'
import { IconAccountInfo } from '@oribet/assets/icons/IconAccountInfo'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { AUTH_TEST_IDS } from '@oribet/test-ids'

interface ILogin {
  onChangeLoginInfo: (key: string, value: string) => void
  disableLogin: boolean
  onSignIn: () => void
  loading: boolean
  error: string
  onClose: () => void
  setIsOpenResetPasswordModal: (isOpen: boolean) => void
  handleSetEmail: (email: string) => void
}

const Login: FC<ILogin> = ({
  onChangeLoginInfo,
  disableLogin,
  onSignIn,
  loading,
  onClose,
  error,
  setIsOpenResetPasswordModal,
  handleSetEmail,
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    if (storedEmail) {
      setEmail(storedEmail)
      handleSetEmail(storedEmail)
    }
  }, [])

  return (
    <Wrapper $isMobile={isMobile}>
      <ContentWrapper>
        <InputWrapper noMargin={false}>
          <CustomInput
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value)
              onChangeLoginInfo('email', event.target.value)
            }}
            label={t('auth.username')}
            isRequired={true}
            placeholder={t('auth.username')}
            type="text"
            startAdornment={<IconAccountInfo size={18} />}
            value={email}
            error={error}
            testId={AUTH_TEST_IDS.login.emailInput}
          />
        </InputWrapper>
        <InputWrapper noMargin={true}>
          <CustomInput
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeLoginInfo('password', event.target.value)
            }
            label={t('auth.password')}
            isRequired={true}
            placeholder={t('auth.passwordPlaceholder')}
            type={'password'}
            onKeyPress={onSignIn}
            testId={AUTH_TEST_IDS.login.passwordInput}
          />
        </InputWrapper>
        <ForgotPasswordWrapper>
          <ForgotPasswordText
            data-testid={AUTH_TEST_IDS.login.forgotPassword}
            onClick={() => {
              onClose()
              setIsOpenResetPasswordModal(true)
            }}
          >
            {t('auth.forgotPassword')}
          </ForgotPasswordText>
        </ForgotPasswordWrapper>
      </ContentWrapper>
      <ButtonWrapper $isMobile={isMobile}>
        <CustomPrimaryButton
          style={{ width: '100%', textTransform: 'uppercase' }}
          disabled={disableLogin}
          onClick={onSignIn}
          loading={loading}
          testId={AUTH_TEST_IDS.login.submit}
        >
          {t('auth.login')}
        </CustomPrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default Login

const Wrapper = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ $isMobile }) => ($isMobile ? 'fit-content' : '100%')};
  justify-content: ${({ $isMobile }) => ($isMobile ? 'initial' : 'space-between')};
`

const ContentWrapper = styled.div``

const InputWrapper = styled.div<{ noMargin: boolean }>`
  margin-bottom: ${({ noMargin }) => (noMargin ? '0px' : '24px')};
`

const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: end;
  margin: 8px 16px;
`

const ForgotPasswordText = styled.button`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
`

const ButtonWrapper = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  margin-top: ${({ $isMobile }) => ($isMobile ? '64px' : '0px')};
`
