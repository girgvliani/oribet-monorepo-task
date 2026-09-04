import { socket, useNotificationUpdates } from '@oribet/core/api/oribet.socket'
import { MarkAllAsRead } from '@oribet/core/api/services/Notification.api'
import AppHeaderAccountInfoMenu from './AppHeaderAccountInfoMenu'
import useFetchActiveBmBonus from './components/hooks/useFetchActiveBmBonus'
import { useQueryClient } from '@tanstack/react-query'
import { ActionButton } from '@oribet/modules/app-sidebar'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsChatEnabled } from '@oribet/core/redux/selectors'
import { updateWalletBalance, syncDefaultWallet, setBmBonusReadyToClaim, clearBmBonusReadyToClaim, clearDefaultWalletBmBalance } from '@oribet/core/redux/slices/userSlice'
import { cancelBmBonus, claimBmBonusById } from '@oribet/core/api/services/BmBonus.api'
import {
  useCheckCancelBonusAmount,
  getCancelRefundAmount,
} from '@oribet/core/hooks/bonus/useCheckCancelBonusAmount'
import { CustomModal } from '@oribet/ui'
import { NAV_TEST_IDS, PLAY_TEST_IDS } from '@oribet/test-ids'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import {
  firstDepositGoogleManagerHelper,
  formatAmount,
  generalDepositGoogleManagerHelper,
  isBonusPages,
} from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import throttle from 'lodash/throttle'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fontSize, media } from '@oribet/ui'
import styled, { useTheme } from 'styled-components'
import WalletView from './components/DepositView'
import MultiWalletView from './components/MultiWalletView'
import useFetchCashBacks from './components/hooks/useFetchCashBacks'
import useFetchRakeBacks from './components/hooks/useFetchRakeBacks'
// import ProfileButtonMobile from './ProfileButtonMobile';
import MobileAccoutInfoContainer from './MobileAccoutInfoContainer'

interface IAppHeaderAuthorizedContent {
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
  isNotificationOpen: boolean
  setIsNotificationOpen: (isOpen: boolean) => void
  isThemeSwitcherOpen: boolean
  setIsThemeSwitcherOpen: (isOpen: boolean) => void
  setIsOpenDepositModal: (isOpen: boolean) => void
}

const AppHeaderAuthorizedContent = ({
  isChatOpen,
  setIsChatOpen,
  isNotificationOpen,
  setIsNotificationOpen,
  isThemeSwitcherOpen,
  setIsThemeSwitcherOpen,
  setIsOpenDepositModal,
}: IAppHeaderAuthorizedContent) => {
  const dispatch = useAppDispatch()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const isChatEnabled = useAppSelector(selectIsChatEnabled)
  const { t } = useTranslation()
  const theme = useTheme()
  const socketNotification = useNotificationUpdates()
  const [newNotification, setNewNotification] = useState<boolean>(false)
  const [openGlobalSearch, setOpenGlobalSearch] = useState<boolean>(false)
  const [openCancelBonusModal, setOpenCancelBonusModal] = useState(false)
  const [cancellingBonus, setCancellingBonus] = useState(false)
  const [claimingBonus, setClaimingBonus] = useState(false)
  const bmBonusReadyToClaim = useAppSelector(state => state.user.bmBonusReadyToClaim)
  const queryClient = useQueryClient()

  const balanceRef = useRef<number | null>(null)
  const [balance, setBalance] = useState<any>(null)

  const bonusBalanceRef = useRef<string | null>(null)
  const [bonusBalance, setBonusBalance] = useState<string | null>(null)

  const navigate = useNavigate()
  const { data: CashBacks } = useFetchCashBacks()
  const { data: RakeBacks } = useFetchRakeBacks()
  const { data: activeBonusBalance, refetch: refetchActiveBonus } = useFetchActiveBmBonus()
  // Refund preview shown in the cancel-confirmation modal (fetched when it opens).
  const { data: cancelPreview, loading: cancelPreviewLoading } = useCheckCancelBonusAmount(
    activeBonusBalance?.data?.id,
    openCancelBonusModal
  )

  const updateBalanceThrottled = useMemo(
    () =>
      throttle((newBalance: number) => {
        balanceRef.current = newBalance
        setBalance(newBalance)
      }, 200),
    []
  )

  const updateBonusBalanceThrottled = useMemo(
    () =>
      throttle((newBonusBalance: string) => {
        bonusBalanceRef.current = newBonusBalance
        setBonusBalance(newBonusBalance)
      }, 200),
    []
  )

  useEffect(() => {
    socket.on('balance', handleBalanceUpdate)

    const handleWalletBalanceUpdated = (data: any) => {
      if (data?.wallet) dispatch(updateWalletBalance(data))
    }
    socket.on('walletBalanceUpdated', handleWalletBalanceUpdated)

    const handleDefaultWalletChanged = (data: any) => {
      if (data?.wallets) dispatch(syncDefaultWallet(data))
    }
    socket.on('defaultWalletChanged', handleDefaultWalletChanged)

    const handleBmBonusWagerUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
    }
    socket.on('bmBonusWagerUpdated', handleBmBonusWagerUpdated)

    const handleBmBonusReadyToClaim = (data: { bonus_id: number; wallet_id: number }) => {
      dispatch(setBmBonusReadyToClaim(data))
      Defaults.modals.bonusReadyToClaimModal?.open()
    }
    socket.on('bmBonusReadyToClaim', handleBmBonusReadyToClaim)

    return () => {
      socket.off('balance', handleBalanceUpdate)
      socket.off('walletBalanceUpdated', handleWalletBalanceUpdated)
      socket.off('defaultWalletChanged', handleDefaultWalletChanged)
      socket.off('bmBonusWagerUpdated', handleBmBonusWagerUpdated)
      socket.off('bmBonusReadyToClaim', handleBmBonusReadyToClaim)
    }
  }, [])

  useEffect(() => {
    if (playerInfo?.player) {
      const playerBalance = playerInfo.player.default_wallet?.balance != null
        ? Number(playerInfo.player.default_wallet.balance)
        : playerInfo.player.balance
      if (balanceRef.current !== playerBalance) {
        balanceRef.current = playerBalance
        setBalance(playerBalance)
      }
    }

    if (isBonusPages() && activeBonusBalance?.data) {
      const bonus = activeBonusBalance.data.amount
      bonusBalanceRef.current = bonus
      setBonusBalance(bonus)
    }

    if (activeBonusBalance && !activeBonusBalance.data) {
      dispatch(clearDefaultWalletBmBalance())
    }
  }, [playerInfo, activeBonusBalance, location.pathname])

  const handleBalanceUpdate = (balance: any) => {
    if (balance) {
      if (balance.type === 'deposit') {
        if (playerInfo.player.deposit_count === 0) {
          firstDepositGoogleManagerHelper(
            playerInfo.player.id,
            playerInfo.player.register_country,
            balance.amount
          )
        } else {
          generalDepositGoogleManagerHelper(
            playerInfo.player.id,
            playerInfo.player.register_country,
            balance.amount
          )
        }
      }

      if (isBonusPages()) {
        if (bonusBalanceRef.current !== balance.bonus_balance) {
          updateBonusBalanceThrottled(balance.bonus_balance)
        }
      } else {
        if (balanceRef.current !== balance.balance) {
          updateBalanceThrottled(balance.balance)
        }
      }
    }
  }

  useEffect(() => {
    if (socketNotification && !isNotificationOpen) {
      setNewNotification(true)
    }
  }, [socketNotification])

  const readAll = () => {
    MarkAllAsRead()
      .then(() => {
        setNewNotification(false)
      })
      .catch(() => {})
  }

  const moveToRealBalance = () => {
    if (activeBonusBalance?.data?.is_wagered) {
      Defaults.modals.moveToMainBalanceModal?.open()
    }
  }

  const onPlayWager = () => {
    navigate(AppRoutePath.BONUSMODE())
  }

  const handleCancelBonus = () => {
    setCancellingBonus(true)
    cancelBmBonus(activeBonusBalance?.data?.id)
      .then(() => {
        setOpenCancelBonusModal(false)
        queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
        navigate(AppRoutePath.HOME())
      })
      .catch(() => {})
      .finally(() => setCancellingBonus(false))
  }

  const handleClaimAndExit = () => {
    if (!bmBonusReadyToClaim) return
    setClaimingBonus(true)
    claimBmBonusById(bmBonusReadyToClaim.bonus_id)
      .then(res => {
        if (res.success) {
          dispatch(clearBmBonusReadyToClaim())
          window.location.href = AppRoutePath.HOME()
        }
      })
      .catch(() => {})
      .finally(() => setClaimingBonus(false))
  }

  // Determine if mobile view using media query for icon sizing
  const isMobile = window.matchMedia('(max-width: 600px)').matches

  return (
    <Container>
      <HeaderSpacer />
      {playerInfo?.player?.wallets?.length > 1 ? (
        <MultiWalletView
          balance={isBonusPages() ? bonusBalance : balance}
          onPlayWager={onPlayWager}
          onOpenDeposit={() => setIsOpenDepositModal(true)}
          refetchActiveBonus={refetchActiveBonus}
          hideDeposit={isBonusPages()}
        />
      ) : (
        <WalletView
          balance={isBonusPages() ? bonusBalance : balance}
          onPlayWager={onPlayWager}
          onOpenDeposit={() => setIsOpenDepositModal(true)}
          refetchActiveBonus={refetchActiveBonus}
          hideDeposit={isBonusPages()}
        />
      )}

      {!isBonusPages() ? (
        <ButtonGroup>
          <UserAccountBtn>
            <AppHeaderAccountInfoMenu />
          </UserAccountBtn>
          <AccountButtonMobile>
            {/* <ProfileButtonMobile /> */}
            <MobileAccoutInfoContainer />
          </AccountButtonMobile>
        </ButtonGroup>
      ) : (
        <BonusModeActions>
          {bmBonusReadyToClaim ? (
            <ExitBonusModeBtn
              onClick={handleClaimAndExit}
              disabled={claimingBonus}
              data-testid={PLAY_TEST_IDS.bonus.claimExit}
            >
              {t('bonus.claimAndExitBonusMode')}
            </ExitBonusModeBtn>
          ) : (
            <>
              <CancelBonusBtn
                onClick={() => setOpenCancelBonusModal(true)}
                data-testid={PLAY_TEST_IDS.bonus.cancel}
              >
                {t('bonus.cancelBonus')}
              </CancelBonusBtn>
              <ExitBonusModeBtn
                onClick={() => navigate(AppRoutePath.HOME())}
                data-testid={PLAY_TEST_IDS.bonus.exit}
              >
                {t('bonus.exitBonusMode')}
              </ExitBonusModeBtn>
            </>
          )}
        </BonusModeActions>
      )}


      {/* idmap-ignore: structural modal wrapper */}
      <CustomModal open={openCancelBonusModal} onClose={() => setOpenCancelBonusModal(false)}>
        <CancelModalRoot>
          <CancelModalHeader>
            <CancelModalBgImg src="/imgs/bonus/layer.svg" alt="" />
            <CancelModalImg src="/imgs/bonus/welcome-icon.png" alt="" />
          </CancelModalHeader>
          <CancelModalParagraph>
            {t('bonus.cancelBonusConfirmTitle')}
            <br />
            {t('bonus.cancelBonusConfirmDesc')}
          </CancelModalParagraph>
          <CancelRefundLine data-testid={`${PLAY_TEST_IDS.bonus.cancel}.refund`}>
            {t('bonus.cancelRefundLabel', { defaultValue: "You'll get back" })}:{' '}
            <strong>
              {cancelPreviewLoading
                ? '…'
                : getCancelRefundAmount(cancelPreview) != null
                  ? `${getActiveCurrencySymbol()}${formatAmount(getCancelRefundAmount(cancelPreview))}`
                  : '—'}
            </strong>
          </CancelRefundLine>
          <CancelModalBtnContainer>
            <ActionButton
              color="green"
              buttonType=""
              withIcon={false}
              label={t('bonus.continueWagering')}
              data-testid={PLAY_TEST_IDS.bonus.continueWagering}
              style={{ height: '32px' }}
              onClick={() => setOpenCancelBonusModal(false)}
            />
          </CancelModalBtnContainer>
          <CancelModalBtnContainer style={{ padding: '0px 8px 8px 8px' }}>
            <ActionButton
              color="blue"
              buttonType=""
              withIcon={false}
              disabled={cancellingBonus}
              label={t('bonus.cancelBonus')}
              data-testid={PLAY_TEST_IDS.bonus.cancel}
              style={{ height: '32px' }}
              onClick={handleCancelBonus}
            />
          </CancelModalBtnContainer>
        </CancelModalRoot>
      </CustomModal>
    </Container>
  )
}

export default AppHeaderAuthorizedContent

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
  background-color: ${({ theme }) => theme.colors.bg.header};

  ${media.sm} {
    padding-right: 0px;
  }
`

/**
 * Balances HeaderSpacer: both sides take an equal share of the free space, which puts the
 * wallet pill between them at the header's true centre. Without this the pill hugged the
 * sidebar, because `space-between` on two children pushes the first hard left.
 */
const ButtonGroup = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 0px 24px;
  margin-left: 0px;

  ${media.sm} {
    flex: 0 0 auto;
    gap: 4px;
    margin: 0px;
    margin-left: 8px;
  }
`

/** Desktop-only counterweight — mobile keeps the pill left, where the space is tight. */
const HeaderSpacer = styled.div`
  flex: 1 1 0;

  ${media.sm} {
    display: none;
  }
`

const NotificationWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NewNotificationIndicator = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.success};
  width: 6px;
  height: 6px;
  border-radius: 100%;
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? '4px' : '0px')};
  right: ${({ $isMobile }) => ($isMobile ? '4px' : '0px')};
`

const UserAccountBtn = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 8px;

  ${media.sm} {
    display: none;
  }
`

const DesktopChatButton = styled.div`
  display: flex;

  @media (max-width: 600px) {
    display: none;
  }
`

const AccountButtonMobile = styled.div`
  display: none;

  ${media.sm} {
    display: flex;
  }
`

const ButtonContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  &:active {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  ${media.md} {
    width: 24px;
    height: 24px;
    background-color: transparent;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`

const FakeBonusCounter = styled.div`
  width: 142.5px;
  height: 2px;
  margin-left: 24px;
`

const BonusModeActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;

  ${media.sm} {
    margin-right: 0px;
    gap: 4px;
  }
`

const CancelBonusBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.xs};
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    border-color: ${({ theme }) => theme.colors.error};
  }

  ${media.sm} {
    padding: 0 8px;
    font-size: 10px;
  }
`

const ExitBonusModeBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: ${({ theme }) => theme.colors.button.primary.border};
  background: ${({ theme }) => theme.colors.button.primary.bg};
  box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  color: ${({ theme }) => theme.colors.button.primary.text};
  font-size: ${fontSize.xs};
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.button.primary.bgHover};
  }

  ${media.sm} {
    padding: 0 8px;
    font-size: 10px;
  }
`

const CancelModalRoot = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  overflow: hidden;
  width: 340px;
`

const CancelModalHeader = styled.div`
  position: relative;
  height: 112px;
  background: ${({ theme }) => theme.colors.gradient.bonusModalHeader};

  ${media.sm} {
    height: 136px;
  }
`

const CancelModalBgImg = styled.img`
  mix-blend-mode: overlay;

  ${media.sm} {
    width: 100%;
  }
`

const CancelModalImg = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CancelModalParagraph = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const CancelRefundLine = styled.div`
  padding: 0 16px 8px;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};

  strong {
    color: ${({ theme }) => theme.colors.accent.primary};
    font-weight: 700;
  }
`

const CancelModalBtnContainer = styled.div`
  padding: 8px;

  .button__label {
    font-size: ${fontSize.sm} !important;
  }
`
