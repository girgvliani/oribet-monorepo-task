import { CustomInput, CustomModal, CustomPrimaryButton, fontSize } from '@oribet/ui'
import { AUTH_TEST_IDS } from '@oribet/test-ids'
import { IconClose } from '@oribet/assets/icons/IconClose'
import type { IPassword } from '@oribet/core/types/Auth.type'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { ChangeEvent, FC } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

interface ResetPasswordPageProps {
  password: IPassword
  setPassword: (body: IPassword) => void
  onSubmit: () => void
}

const ResetPasswordPage: FC<ResetPasswordPageProps> = ({ password, setPassword, onSubmit }) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useTheme()

  const onChangeUpdateInfo = (key: string, value: string) => {
    setPassword({ ...password, [key]: value })
  }

  return (
    <div>
      <CustomModal
        open={true}
        onClose={() => navigate(AppRoutePath.HOME())}
        customStyle={{ width: isMobile ? '85%' : '' }}
        testId={AUTH_TEST_IDS.resetPage.root}
      >
        <Root $isMobile={isMobile}>
          <Header>
            <span>{t('auth.resetPassword')}</span>
            <button
              data-testid={AUTH_TEST_IDS.resetPage.close}
              onClick={() => navigate(AppRoutePath.HOME())}
              aria-label="Close"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <IconClose style={{ color: theme.colors.text.secondary }} />
            </button>
          </Header>

          <FormSection>
            <InputWrapper>
              <CustomInput
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChangeUpdateInfo('password', event.target.value)
                }
                label={t('passwordLabel')}
                placeholder={t('auth.password')}
                type={'password'}
                isGap
                testId={AUTH_TEST_IDS.resetPage.newPasswordInput}
              />
            </InputWrapper>

            <InputWrapper>
              <CustomInput
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChangeUpdateInfo('password_confirmation', event.target.value)
                }
                label={t('settings.repeatPassword')}
                placeholder={t('settings.repeatPassword')}
                type={'password'}
                isGap
                testId={AUTH_TEST_IDS.resetPage.confirmPasswordInput}
              />
            </InputWrapper>
          </FormSection>

          <ButtonSection $isMobile={isMobile}>
            <CustomPrimaryButton
              style={{ width: '100%', textTransform: 'uppercase' }}
              onClick={onSubmit}
              testId={AUTH_TEST_IDS.resetPage.change}
              disabled={
                !(password.password.trim() === password.password_confirmation.trim()) ||
                password.password.trim() === '' ||
                password.password_confirmation.trim() === ''
              }
            >
              {t('settings.change')}
            </CustomPrimaryButton>
          </ButtonSection>
        </Root>
      </CustomModal>
    </div>
  )
}

export default ResetPasswordPage

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

const FormSection = styled.div`
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

const InputWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`

const ButtonSection = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  margin-top: ${({ $isMobile }) => ($isMobile ? '64px' : '0px')};
  padding: 16px;
  box-sizing: border-box;
`
