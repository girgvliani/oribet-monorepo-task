import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { IconArrowForward } from '@oribet/assets/icons/IconArrowForward'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { CustomMinimalButton } from '@oribet/ui'
import { resolveAvatarUrl } from '@oribet/core/util/resolveAvatarUrl'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'

interface IUserProfileHeader {
  username: string
  userId: string
  img: string | null
  onClickProfile?: () => void
  stage: 'DEFAULT' | 'TIP' | 'EDIT'
  open?: boolean
  setOpen?: (open: boolean) => void
}

const UserProfileHeader = ({
  username,
  userId,
  img,
  stage,
  onClickProfile,
}: IUserProfileHeader) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <Root
      $isMobile={isMobile}
      onClick={() => onClickProfile && onClickProfile()}
      data-testid={ACCOUNT_TEST_IDS.profile.trigger}
    >
      <LeftSection>
        <ImgWrapper>
          <img
            src={resolveAvatarUrl(img)}
            alt={'user_profile_img'}
            width={'40px'}
            height={'40px'}
            style={{
              borderRadius: '100%',
            }}
          />
        </ImgWrapper>
        <UserInfo>
          <Username>{username}</Username>
          <UserId>
            {t('profile.userId')} {userId}
          </UserId>
        </UserInfo>
      </LeftSection>
      <RightSection>
        {stage === 'DEFAULT' &&
          (!isMobile ? (
            <ArrowIcon as={IconArrowForward} />
          ) : (
            <ArrowIconMobile as={IconChevronRight} />
          ))}
        {stage === 'EDIT' && (
          <CustomMinimalButton
            style={{
              textTransform: 'uppercase',
            }}
            testId={ACCOUNT_TEST_IDS.avatar.open}
          >
            {t('common.edit')}
          </CustomMinimalButton>
        )}
      </RightSection>
    </Root>
  )
}

export default UserProfileHeader

const Root = styled.div<{ $isMobile: boolean }>`
  display: flex;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? '72px' : '100%')};
  box-sizing: border-box;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '8px')};
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '8px')};
  background: ${({ theme }) => theme.colors.bg.primary};
  border: ${({ $isMobile }) => ($isMobile ? 'none' : '1px solid transparent')};
  border-bottom: ${({ $isMobile }) => ($isMobile ? '1px solid #FFFFFF0D' : 'none')};
  transition:
    background 0.3s ease-in-out,
    border-color 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.secondary};
    border-color: ${({ theme }) => theme.colors.surface.hover};
  }
`

const LeftSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const ImgWrapper = styled.div`
  width: 40px;
  height: 40px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Username = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 24px;
  max-width: 150px;
  overflow: hidden;
`

const UserId = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 16px;
`

const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ArrowIcon = styled.span`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`

const ArrowIconMobile = styled.span`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`
