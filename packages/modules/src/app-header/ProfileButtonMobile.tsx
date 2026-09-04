import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { resolveAvatarUrl } from '@oribet/core/util/resolveAvatarUrl'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const ProfileButtonMobile = () => {
  const userInfo = useAppSelector(state => state.user.playerInfo)
  const navigate = useNavigate()

  return (
    <ProfileButton
      data-testid={NAV_TEST_IDS.header.accountTrigger}
      onClick={() => navigate(AppRoutePath.ACCOUNT_MOBILE_PAGE())}
    >
      <ProfileImage src={resolveAvatarUrl(userInfo.player.avatar)} />
    </ProfileButton>
  )
}

export default ProfileButtonMobile

const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface.border};
  width: 24px;
  height: 24px;
  border-radius: 48px;

  @media (min-width: 768px) {
    display: none;
  }
`

const ProfileImage = styled.img`
  width: 16px;
  height: 16px;
`
