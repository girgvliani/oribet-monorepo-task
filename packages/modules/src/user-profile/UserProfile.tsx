import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { CustomMinimalButton } from '@oribet/ui'
import { CustomInput } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'

interface IUserProfile {
  avatar: string | null
  username: string
  setStage: (stage: number) => void
  onClose: () => void
}

const UserProfile = ({ avatar, username, setStage, onClose }: IUserProfile) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <Root $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <HeaderLeft>
          <GoBackButton
            onClick={() => setStage(0)}
            data-testid={`${ACCOUNT_TEST_IDS.nav.back}.profile`}
          >
            <IconArrowBack />
          </GoBackButton>
          <HeaderText>{t('profile.myProfile')}</HeaderText>
        </HeaderLeft>
        <CloseButton onClick={() => onClose()} data-testid={ACCOUNT_TEST_IDS.profile.close}>
          <IconClose />
        </CloseButton>
      </Header>
      <Body>
        <ImgContainer>
          {avatar ? (
            <img
              src={resolveImageUrl(avatar)}
              alt={'user_profile_img'}
              width={'96px'}
              height={'96px'}
              style={{
                borderRadius: '100%',
              }}
            />
          ) : (
            <img
              src={`/imgs/avatars/default.png`}
              alt={'user_profile_img'}
              width={'96px'}
              height={'96px'}
              style={{
                borderRadius: '100%',
              }}
            />
          )}
        </ImgContainer>
        <CustomMinimalButton
          style={{
            textTransform: 'uppercase',
          }}
          onClick={() => setStage(2)}
          testId={ACCOUNT_TEST_IDS.profile.save}
        >
          {t('settings.editAvatar')}
        </CustomMinimalButton>
      </Body>
      <InputContainer>
        <CustomInput
          onChange={() => {}}
          value={username}
          label={t('auth.username')}
          disabled={true}
          testId={ACCOUNT_TEST_IDS.profile.username}
        />
      </InputContainer>
    </Root>
  )
}

export default UserProfile

const Root = styled.div<{ $isMobile: boolean }>`
  position: relative;
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '12px')};
  border: ${({ $isMobile, theme }) =>
    $isMobile ? 'none' : `1px solid ${theme.colors.surface.hover}`};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '426px')};
  height: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
`

const Header = styled.div<{ $isMobile: boolean }>`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.bg.input};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '12px 12px 0 0')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const HeaderText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 24px;
`

const GoBackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
    width: 16px;
    height: 16px;
  }
`

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
    width: 20px;
    height: 20px;
  }
`

const Body = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 184px;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const ImgContainer = styled.div`
  width: 96px;
  height: 96px;
`

const InputContainer = styled.div`
  padding: 16px;
`
