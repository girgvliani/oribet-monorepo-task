import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { claimBmBonusById } from '@oribet/core/api/services/BmBonus.api'
import { AtomDiamondOrange } from '@oribet/assets/atoms/AtomDiamondOrange'
import { LogoUSDT } from '@oribet/assets/logos/LogoUSDT'
import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { BonusCard } from '@oribet/modules/app-sidebar'
import WagerProgressBar from './WagerProgressBar'
import { formatAmount, getBonusProgress, getWagerMultiplier } from '@oribet/core/util/appUtil'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { Defaults } from '@oribet/core/util/defaults'
import { fontSize } from '@oribet/ui'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import type { IPlayBonusMoney } from '@oribet/core/types/BonusMode.type'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface IWalletCardProps {
  wallet: IWallet
  isDefault: boolean
  onSwitch: (walletId: number) => void
  isSwitching: boolean
  onOpenDeposit: () => void
  onPlayWager: () => void
  onCollapse: () => void
  activeBonus?: IPlayBonusMoney | null
  claimableBonus?: any
}

const WalletCard: React.FC<IWalletCardProps> = ({
  wallet,
  isDefault,
  onSwitch,
  isSwitching,
  onOpenDeposit,
  onPlayWager,
  onCollapse,
  activeBonus,
  claimableBonus,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const currencySymbol = getActiveCurrencySymbol(wallet.currency)
  const [claimingReadyBonus, setClaimingReadyBonus] = useState(false)

  const isBonusPage =
    location.pathname.includes('/bonus-mode') || location.pathname.includes('/bonusgames')

  const handleCardClick = () => {
    if (!isDefault && !isSwitching) {
      onSwitch(wallet.id)
    }
  }

  const onMoveToBalance = () => {
    Defaults.modals.moveToMainBalanceModal?.open()
  }

  const handleClaimAndWager = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!claimableBonus) return
    setClaimingReadyBonus(true)
    claimBmBonusById(claimableBonus.id)
      .then((res: any) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
          queryClient.invalidateQueries({ queryKey: ['ready-to-claim-bonuses'] })
        }
      })
      .catch(() => {})
      .finally(() => setClaimingReadyBonus(false))
  }

  return (
    <CardContainer
      $isDefault={isDefault}
      $isSwitching={isSwitching}
      $clickable={!isDefault}
      onClick={handleCardClick}
      data-testid={`${DEPOSIT_TEST_IDS.wallet.switchCard}.${wallet.currency}`}
    >
      <CardsRow>
        {/* Balance card — same as DepositView */}
        <BonusCard
          icon={
            wallet.is_crypto ? (
              <LogoUSDT size={24} />
            ) : (
              <DropdownCurrencySymbol>{currencySymbol}</DropdownCurrencySymbol>
            )
          }
          title={`${wallet.currency} ${t('wallet.balance')}`}
          infoText={`${currencySymbol}${formatAmount(wallet.balance)}`}
          footerContent={
            isDefault && !isBonusPage ? (
              <ActionButton
                withIcon
                label={t('header.deposit')}
                buttonType={BUTTON_TYPE.Deposit}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onCollapse()
                  onOpenDeposit()
                }}
                data-testid={`${DEPOSIT_TEST_IDS.open}.wallet-card.${wallet.currency}`}
              />
            ) : undefined
          }
        />

        {/* Bonus balance card — same as DepositView */}
        {isDefault && activeBonus?.amount ? (
          <BonusCard
            icon={<AtomDiamondOrange />}
            title={`${wallet.currency} ${t('wallet.bonusBalance')}`}
            infoText={`${currencySymbol}${formatAmount(activeBonus.amount)}`}
            footerContent={
              isBonusPage
                ? undefined
                : activeBonus.is_wagered
                  ? (
                      <ActionButton
                        color="orange"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          onMoveToBalance()
                        }}
                        data-testid={`${DEPOSIT_TEST_IDS.wallet.bonusMove}.${wallet.currency}`}
                      />
                    )
                  : claimableBonus
                    ? (
                        <ActionButton
                          color="orange"
                          buttonType=""
                          withIcon={false}
                          disabled={claimingReadyBonus}
                          label={t('wallet.claimBonusToWager')}
                          onClick={handleClaimAndWager}
                          style={{ marginTop: '4px' }}
                          data-testid={`${DEPOSIT_TEST_IDS.wallet.bonusClaim}.${wallet.currency}`}
                        />
                      )
                    : (
                        <ActionButton
                          buttonType={BUTTON_TYPE.Wager}
                          label={t('wallet.playToWager')}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            onPlayWager()
                            onCollapse()
                          }}
                          style={{ marginTop: '4px' }}
                          data-testid={`${DEPOSIT_TEST_IDS.wallet.bonusWager}.${wallet.currency}`}
                        />
                      )
            }
          >
            <WagerProgressBar
              wager={claimableBonus ? undefined : getWagerMultiplier(activeBonus)}
              progress={claimableBonus ? 100 : getBonusProgress(activeBonus)}
              color="orange"
              totalSegments={5}
              label={t('wallet.wagerProgress')}
            />
          </BonusCard>
        ) : (
          <BonusCard
            icon={<AtomDiamondOrange />}
            title={`${wallet.currency} ${t('wallet.bonusBalance')}`}
            infoText={`${currencySymbol}${formatAmount(claimableBonus ? claimableBonus.amount : wallet.bm_balance)}`}
            inactive={!claimableBonus && Number(wallet.bm_balance) === 0}
            footerContent={
              isDefault && !isBonusPage ? (
                claimableBonus ? (
                  <ActionButton
                    color="orange"
                    buttonType=""
                    withIcon={false}
                    disabled={claimingReadyBonus}
                    label={t('wallet.claimBonusToWager')}
                    onClick={handleClaimAndWager}
                    style={{ marginTop: '4px' }}
                    data-testid={`${DEPOSIT_TEST_IDS.wallet.bonusClaim}.${wallet.currency}`}
                  />
                ) : (
                  <ActionButton
                    disabled
                    buttonType={BUTTON_TYPE.Wager}
                    label={t('wallet.playToWager')}
                    onClick={() => {}}
                    style={{ marginTop: '4px' }}
                    data-testid={`${DEPOSIT_TEST_IDS.wallet.bonusWager}.${wallet.currency}`}
                  />
                )
              ) : undefined
            }
          >
            {isDefault && (
              <WagerProgressBar
                progress={0}
                color="orange"
                totalSegments={5}
                label={t('wallet.wagerProgress')}
              />
            )}
          </BonusCard>
        )}
      </CardsRow>
    </CardContainer>
  )
}

export default WalletCard

const CardContainer = styled.div<{
  $isDefault: boolean
  $isSwitching: boolean
  $clickable: boolean
}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  outline: ${({ $isDefault, theme }) =>
    $isDefault ? `2px solid ${theme.colors.button.primary.bg}` : 'none'};
  outline-offset: -1px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  opacity: ${({ $isSwitching }) => ($isSwitching ? 0.5 : 1)};
  pointer-events: ${({ $isSwitching }) => ($isSwitching ? 'none' : 'auto')};
  transition: all 0.2s ease;

  &:hover {
    ${({ $clickable, theme }) =>
      $clickable &&
      `
      border-color: ${theme.colors.text.tertiary};
    `}
  }
`

const CardsRow = styled.div`
  display: flex;
  gap: 8px;

  > * {
    flex: 1;
    min-width: 0;
  }
`

const DropdownCurrencySymbol = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 20px;
  background: ${({ theme }) => theme.colors.icon.brand};
  color: ${({ theme }) => theme.colors.button.primary.text};
  border-radius: 6px;
`
