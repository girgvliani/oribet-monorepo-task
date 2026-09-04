import { useLogout } from '@oribet/core/hooks/user/useLogout'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconLogOut } from '@oribet/assets/icons/IconLogOut'
import { IconPreferences } from '@oribet/assets/icons/IconPreferences'
import { IconSettings } from '@oribet/assets/icons/IconSettings'
import { IconTransaction } from '@oribet/assets/icons/IconTransaction'
import { IconVerification } from '@oribet/assets/icons/IconVerification'
import { IconWallet } from '@oribet/assets/icons/IconWallet'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { resolveAvatarUrl } from '@oribet/core/util/resolveAvatarUrl'
import { CustomModal } from '@oribet/ui'
import { MobileContainer } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { UserProfileHeader } from '@oribet/modules/user-profile'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import {
  changeGlobalDepositModal,
  changeUserProfileInfo,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'

const MobileAccountInfoContainer = () => {
  const isMobile = useIsMobile()
  const userInfo = useAppSelector(state => state.user.playerInfo)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet
  const onlyCrypto = systemSettings?.multi_currency?.only_crypto
  const dispatch = useAppDispatch()
  const logout = useLogout()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()

  const [showPopover, setShowPopover] = useState(false)
  const [openLogOutModal, setOpenLogOutModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = () => {
    setShowPopover(true)
  }

  const handleClose = () => {
    setShowPopover(false)
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
          <ProfileImage src={resolveAvatarUrl(userInfo.player.avatar)} />
        </ProfileButton>

        <MobileContainer open={showPopover} setOpen={setShowPopover} trackBottomClick>
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
            <MenuItem
              data-testid={NAV_TEST_IDS.accountMenu.wallet}
              onClick={() => {
                navigate(AppRoutePath.WALLET_MOBILE_PAGE())
                handleClose()
              }}
            >
              <IconWallet />
              <MenuItemText>{t('account.wallet')}</MenuItemText>
            </MenuItem>
            {!onlyCrypto && (
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.depositFiat}
                onClick={() => {
                  dispatch(changeGlobalDepositModal(true))
                  handleClose()
                }}
              >
                <IconDeposit />
                <MenuItemText>{t('interkasa.depositFiat')}</MenuItemText>
              </MenuItem>
            )}
            {hasCryptoWallet && (
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.depositCrypto}
                onClick={() => {
                  navigate(AppRoutePath.DEPOSIT())
                  handleClose()
                }}
              >
                <IconDeposit />
                <MenuItemText>{t('account.depositCrypto')}</MenuItemText>
              </MenuItem>
            )}
            {hasCryptoWallet && (
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.withdraw}
                onClick={() => {
                  navigate(AppRoutePath.WITHDRAWCRYPTO())
                  handleClose()
                }}
              >
                <IconWithdraw />
                <MenuItemText>{t('account.withdrawCrypto')}</MenuItemText>
              </MenuItem>
            )}
            {hasCryptoWallet && (
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.buyCrypto}
                onClick={() => {
                  navigate(AppRoutePath.BUYCRYPTO())
                  handleClose()
                }}
              >
                <IconDeposit />
                <MenuItemText>{t('account.buyCrypto')}</MenuItemText>
              </MenuItem>
            )}
            <MenuItem
              data-testid={NAV_TEST_IDS.accountMenu.transactions}
              onClick={() => {
                navigate(AppRoutePath.TRANSACTIONS())
                handleClose()
              }}
            >
              <IconTransaction />
              <MenuItemText>{t('account.transactions')}</MenuItemText>
            </MenuItem>
            {!isMobile && (
              <MenuItem
                data-testid={NAV_TEST_IDS.accountMenu.settings}
                onClick={() => {
                  navigate(AppRoutePath.ACCOUNT_INFO())
                  handleClose()
                }}
              >
                <IconSettings />
                <MenuItemText>{t('account.settings')}</MenuItemText>
              </MenuItem>
            )}
            {isMobile && (
              <>
                <MenuItem
                  data-testid={NAV_TEST_IDS.accountMenu.settings}
                  onClick={() => {
                    navigate(AppRoutePath.ACCOUNT_INFO())
                    handleClose()
                  }}
                >
                  <IconWallet size={16} style={{ color: theme.colors.text.secondary }} />
                  <MenuItemText>{t('account.accountInfo')}</MenuItemText>
                </MenuItem>
                <MenuItem
                  data-testid={NAV_TEST_IDS.accountMenu.security}
                  onClick={() => {
                    navigate(AppRoutePath.SECURITY())
                    handleClose()
                  }}
                >
                  <IconSettings />
                  <MenuItemText>{t('account.security')}</MenuItemText>
                </MenuItem>
                <MenuItem
                  data-testid={NAV_TEST_IDS.accountMenu.preferences}
                  onClick={() => {
                    navigate(AppRoutePath.PREFERENCES())
                    handleClose()
                  }}
                >
                  <IconPreferences size={16} style={{ color: theme.colors.text.secondary }} />
                  <MenuItemText>{t('account.preferences')}</MenuItemText>
                </MenuItem>
                <MenuItem
                  data-testid={NAV_TEST_IDS.accountMenu.verification}
                  onClick={() => {
                    navigate(AppRoutePath.VERIFICATION())
                    handleClose()
                  }}
                >
                  <IconVerification size={16} style={{ color: theme.colors.text.secondary }} />
                  <MenuItemText>{t('settings.personalVerification')}</MenuItemText>
                </MenuItem>
              </>
            )}
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
        </MobileContainer>

        {/* idmap-ignore: structural modal wrapper — logout confirm/cancel buttons inside are tagged */}
        <CustomModal open={openLogOutModal} onClose={() => setOpenLogOutModal(false)}>
          <SignOutContainer>
            <ModalTitle>{t('account.logOut')}</ModalTitle>
            <ModalText>{t('account.logOutConfirmation')}</ModalText>
            <LogOutButton
              data-testid={NAV_TEST_IDS.accountMenu.logoutConfirm}
              onClick={() => onLogOut()}
            >
              {loading ? <LoadingSpinner /> : <span>{t('account.yesSignOut')}</span>}
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

export default MobileAccountInfoContainer

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
  width: 100%;
  height: 100%;
  border-radius: 100%;
`

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0px;
  box-sizing: border-box;
  padding: 8px;
`

const UserInfoContainer = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  border-radius: 8px;
`

const MenuItem = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
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
  transition: border-color 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.secondary};
    border-color: ${({ theme }) => theme.colors.surface.hover};

    span {
      color: ${({ theme }) => theme.colors.text.primary} !important;
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

const ModalTitle = styled.span`
  font-size: ${fontSize['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0px 16px;
`

const ModalText = styled.span`
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

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-radius: 50%;
  border-top: 3px solid ${({ theme }) => theme.colors.accent.brand};
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
