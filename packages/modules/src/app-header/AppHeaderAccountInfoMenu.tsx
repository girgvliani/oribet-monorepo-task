import { useLogout } from '@oribet/core/hooks/user/useLogout'
import { resolveAvatarUrl } from '@oribet/core/util/resolveAvatarUrl'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconLogOut } from '@oribet/assets/icons/IconLogOut'
import { IconSettings } from '@oribet/assets/icons/IconSettings'
import { IconTransaction } from '@oribet/assets/icons/IconTransaction'
import { IconWallet } from '@oribet/assets/icons/IconWallet'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { CustomModal } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { Popover } from '@oribet/ui'
import { UserProfileHeader } from '@oribet/modules/user-profile'
import { Spinner } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import {
  changeGlobalDepositModal,
  changeUserProfileInfo,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'

const AppHeaderAccountInfoMenu = () => {
  const userInfo = useAppSelector(state => state.user.playerInfo)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet
  const onlyCrypto = systemSettings?.multi_currency?.only_crypto
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useLogout()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openLogOutModal, setOpenLogOutModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = (event: any) => {
    // Toggle: if already open, close; otherwise open
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onLogOut = async () => {
    setLoading(true)
    try {
      await logout()
      setOpenLogOutModal(false)
      navigate(AppRoutePath.HOME())
    } finally {
      setLoading(false)
    }
  }

  const onClickProfile = () => {
    dispatch(
      changeUserProfileInfo({
        open: true,
        isCurrentUser: true,
        id: userInfo.player.id,
        username: userInfo.player.username,
        totalWins: userInfo.player.total_win,
        totalBets: userInfo.player.total_bet,
        avatar: userInfo.player.avatar,
        rank: userInfo.player.rank,
      })
    )
    handleClose()
  }

  return (
    userInfo.player &&
    userInfo.player.id && (
      <>
        <ProfileButton onClick={handleClick} data-testid={NAV_TEST_IDS.header.accountTrigger}>
          <img
            alt={'profile img'}
            src={resolveAvatarUrl(userInfo.player.avatar)}
            style={{
              maxWidth: '40px',
              maxHeight: '40px',
              borderRadius: '100%',
            }}
          />
        </ProfileButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          marginTop={8}
        >
          <PopoverPaper>
            <MenuContainer>
              <UserInfoContainer>
                <UserProfileHeader
                  userId={String(userInfo.player.id)}
                  username={userInfo.player.username}
                  img={userInfo.player.avatar}
                  stage={'DEFAULT'}
                  onClickProfile={() => onClickProfile()}
                />
              </UserInfoContainer>

              {/* Logout only — every other destination is a page this build does not ship. */}
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.logout}
                onClick={() => {
                  handleClose()
                  setOpenLogOutModal(true)
                }}
              >
                <IconLogOut />
                <MenuItemText>{t('account.logOut')}</MenuItemText>
              </MenuItem>
            </MenuContainer>
          </PopoverPaper>
        </Popover>

        {/* idmap-ignore: structural modal wrapper — logout confirm/cancel buttons inside are tagged */}
        <CustomModal open={openLogOutModal} onClose={() => setOpenLogOutModal(false)}>
          <SignOutContainer>
            <SignOutTitle>{t('account.logOut')}</SignOutTitle>
            <SignOutMessage>{t('account.logOutConfirmation')}</SignOutMessage>
            <LogOutButton
              data-testid={NAV_TEST_IDS.accountMenu.logoutConfirm}
              onClick={() => onLogOut()}
            >
              {loading ? <Spinner size={24} /> : <span>{t('account.yesSignOut')}</span>}
            </LogOutButton>
            <LogOutButton
              data-testid={NAV_TEST_IDS.accountMenu.logoutCancel}
              onClick={() => setOpenLogOutModal(false)}
            >
              <span>{t('common.cancel')}</span>
            </LogOutButton>
          </SignOutContainer>
        </CustomModal>
      </>
    )
  )
}

export default AppHeaderAccountInfoMenu

const ProfileButton = styled.div`
  background: ${({ theme }) => theme.colors.surface.border};
  width: 40px;
  height: 40px;
  max-height: 40px;
  max-width: 40px;
  border-radius: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PopoverPaper = styled.div`
  width: 272px;
  max-height: 80vh;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0px;
  box-sizing: border-box;
`

const MenuItem = styled.div`
  display: flex;
  padding: 7px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  width: 100%;
  min-width: 0px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.bg.secondary};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: border-color 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.secondary};
    border-color: ${({ theme }) => theme.colors.surface.hover};

    span {
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`

const MenuItemText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
  transition: color 0.3s ease;
`

const UserInfoContainer = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  height: 56px;
  border-radius: 8px;
  width: 100%;
`

const SignOutContainer = styled.div`
  width: 364px;
  height: 239px;
  background: ${({ theme }) => theme.colors.bg.primary};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 10px;
  gap: 8px;
`

const SignOutTitle = styled.span`
  font-size: ${fontSize['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0px 16px;
`

const SignOutMessage = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 16px;
  padding: 0px 16px;
  margin-bottom: 16px;
`

const LogOutButton = styled.div`
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  padding: 8px 24px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  span {
    font-size: ${fontSize.base};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 24px;
    text-transform: uppercase;
  }
`
