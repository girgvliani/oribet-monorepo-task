import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { zIndex, fontSize, media } from '@oribet/ui'
import { AtomDiamondOrange } from '@oribet/assets/atoms/AtomDiamondOrange'
import { IconChevronDown } from '@oribet/assets/icons/IconChevronDown'
import { IconPlusWithShadow } from '@oribet/assets/icons/IconPlusWithShadow'
import { LogoUSDT } from '@oribet/assets/logos/LogoUSDT'
import { isBonusPages } from '@oribet/core/util/appUtil'
import useFetchActiveBmBonus from './hooks/useFetchActiveBmBonus'
import useFetchUserInfo from './hooks/useFetchUserInfo'
import useFetchReadyToClaimBonuses from '@oribet/core/hooks/bonus/useFetchReadyToClaimBonuses'
import useChangeWallet from '@oribet/core/hooks/wallet/useChangeWallet'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { formatAmount } from '@oribet/core/util/appUtil'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'
import WalletCard from './WalletCard'

interface MultiWalletViewProps {
  balance: string
  onOpenDeposit: () => void
  onPlayWager: () => void
  refetchActiveBonus: () => void
  hideDeposit?: boolean
}

const MultiWalletView: React.FC<MultiWalletViewProps> = ({
  balance,
  onOpenDeposit,
  onPlayWager,
  refetchActiveBonus,
  hideDeposit,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const reduxWallets: IWallet[] = playerInfo?.player?.wallets || []
  const defaultWallet: IWallet | undefined = playerInfo?.player?.default_wallet

  const { data: activeBonus } = useFetchActiveBmBonus()
  const { data: userInfoData, refetch: refetchUserInfo } = useFetchUserInfo(isExpanded)
  const { data: readyToClaimData } = useFetchReadyToClaimBonuses(isExpanded)
  const claimableBonus = readyToClaimData?.data?.[0]

  // Use fresh wallets from refetch when available, fallback to redux
  const freshWallets: IWallet[] | undefined = userInfoData?.data?.data?.wallets
  const wallets = freshWallets?.length ? freshWallets : reduxWallets

  const { mutate: switchWallet, isPending: isSwitching } = useChangeWallet(() => {
    setIsExpanded(false)
  })

  const fullWidth = window.innerWidth - 16

  const handleBlur = (event: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.relatedTarget as Node)) {
      setIsExpanded(false)
    }
  }

  const inBonusMode = isBonusPages()

  const toggleExpand = () => {
    if (inBonusMode) return
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (isExpanded) {
      refetchUserInfo()
      refetchActiveBonus()
    }
  }, [isExpanded])

  const handleWalletSwitch = (walletId: number) => {
    switchWallet(walletId)
  }

  const currencySymbol = defaultWallet
    ? getActiveCurrencySymbol(defaultWallet.currency)
    : getActiveCurrencySymbol()

  return (
    <Container ref={containerRef} tabIndex={0} onBlur={handleBlur} $isExpanded={isExpanded}>
      <WalletSummaryBar>
        <BalancePill onClick={toggleExpand} data-testid={DEPOSIT_TEST_IDS.wallet.balancePill}>
          {isBonusPages() ? (
            <AtomDiamondOrange style={{ width: '16px' }} />
          ) : defaultWallet?.is_crypto ? (
            <LogoUSDT size={16} />
          ) : (
            <div style={{ width: 16, height: 16 }} />
          )}
          <BalanceText>
            {location.pathname.includes('/games/') || location.pathname.includes('/bonusgames/') ? (
              <InPlayText>(In Play)</InPlayText>
            ) : (
              <>
                {currencySymbol}
                {formatAmount(balance)}
              </>
            )}
          </BalanceText>
        </BalancePill>
      </WalletSummaryBar>
      <StyledRightSide $extraMargin={hideDeposit}>
        {!inBonusMode && (
          <ExpandIcon
            $isExpanded={isExpanded}
            onClick={toggleExpand}
            data-testid={DEPOSIT_TEST_IDS.wallet.expand}
          >
            <IconChevronDown size={12} style={{ color: theme.colors.text.primary }} />
          </ExpandIcon>
        )}
        {!hideDeposit && (
          <DepositButton onClick={onOpenDeposit} data-testid={`${DEPOSIT_TEST_IDS.open}.header`}>
            <IconPlusWithShadow style={{ color: 'currentColor' }} />
            <StylesButtonLabel>{t('header.deposit')}</StylesButtonLabel>
          </DepositButton>
        )}
      </StyledRightSide>

      {isExpanded && (
        <ExpandedPanel $fullWidth={fullWidth}>
          {[...wallets]
            .sort((a, b) => a.id - b.id)
            .map(wallet => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                isDefault={wallet.is_default}
                onSwitch={handleWalletSwitch}
                isSwitching={isSwitching}
                onOpenDeposit={onOpenDeposit}
                onPlayWager={onPlayWager}
                onCollapse={() => setIsExpanded(false)}
                activeBonus={wallet.is_default ? activeBonus?.data : null}
                claimableBonus={wallet.is_default ? claimableBonus || null : null}
              />
            ))}
        </ExpandedPanel>
      )}
    </Container>
  )
}

export default MultiWalletView

const Container = styled.div<{ $isExpanded: boolean }>`
  @media (min-width: 600px) {
    margin-left: 0;
  }

  height: 40px;
  min-width: 100px;
  position: relative;
  background-color: ${({ $isExpanded, theme }) =>
    $isExpanded ? theme.colors.bg.secondary : theme.colors.bg.tertiary};
  border-radius: 12px;
  padding: 4px 4px 4px 8px;
  outline-offset: -1px;
  outline: ${({ $isExpanded, theme }) =>
    $isExpanded ? `1px solid ${theme.colors.surface.hover}` : '1px solid transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 12px;
  box-sizing: border-box;
  transition: all 0.3s;
`

const WalletSummaryBar = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  ${media.sm} {
    svg {
      width: 14px;
      height: 14px;
    }
  }
`

const BalancePill = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  gap: 8px;

  ${media.sm} {
    gap: 4px;
  }
`

const BalanceText = styled.div`
  font-size: ${fontSize.lg};
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0px;
  width: 84px;
  text-align: center;

  ${media.sm} {
    font-size: ${fontSize.sm};
    width: 70px;
  }
`

const InPlayText = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 700;
  white-space: nowrap;
`

const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  transform: ${props => (props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
  font-size: ${fontSize.sm};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: 4px;
`

const ExpandedPanel = styled.div<{ $fullWidth: number }>`
  position: absolute;
  top: 34px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 560px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  border-radius: 18px;
  padding: 8px;
  margin-top: 10px;
  overflow: hidden;
  display: grid;
  gap: 8px;
  z-index: ${zIndex.raised};

  ${media.sm} {
    min-width: ${({ $fullWidth }) => `${$fullWidth}px`};
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
  }
`

const DepositButton = styled.button<{ isMobile?: boolean }>`
  padding: 8px 16px 8px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.3s,
    box-shadow 0.3s;
  border: ${({ theme }) => theme.colors.button.primary.border};
  background: ${({ theme }) => theme.colors.button.primary.bg};
  box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  color: ${({ theme }) => theme.colors.button.primary.text};
  min-width: 0px;
  cursor: pointer;
  box-sizing: border-box;
  column-gap: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.button.primary.bgHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.button.primary.bgActive};
    box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadowActive};
  }

  ${media.sm} {
    width: 24px;
    height: 24px;
    padding: 4px;
    justify-content: center;
  }
`

const StylesButtonLabel = styled.span`
  font-weight: 700;
  font-size: ${fontSize.xs};
  line-height: 16px;
  letter-spacing: 0px;
  text-transform: uppercase;
  text-shadow: 0px 1px 0px #00000040;
  color: inherit;

  ${media.sm} {
    display: none;
  }
`

const StyledRightSide = styled.div<{ $extraMargin?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  ${({ $extraMargin }) => $extraMargin && 'margin-right: 8px;'}

  ${media.sm} {
    gap: 8px;
  }
`
