import { updateWantDepositBonus } from '@oribet/core/api/services/Settings.api'
import { CashierSession } from '@oribet/core/types/Cashier.type'
import { CustomModal, CustomPrimaryButton, Spinner } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeWantDepositBonus } from '@oribet/core/redux/slices/userSlice'
import { enqueueSnackbar } from 'notistack'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS, WALLET_TEST_IDS } from '@oribet/test-ids'
import { IconBuyCrypto } from '@oribet/assets/icons/IconBuyCrypto'
import { IconCard } from '@oribet/assets/icons/IconCard'
import { IconCheckmark } from '@oribet/assets/icons/IconCheckmark'
import { IconTether } from '@oribet/assets/icons/IconTether'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import BonusList, { formatBonusBadge } from './BonusList'
import MethodCard from './MethodCard'
import { WALLET_PALETTE as wp } from './palette'

// No Pencil frame exists for the Card or Buy Crypto methods (only Crypto and Bank were
// ever designed) — styled to match those two rather than left unstyled, plus dedicated
// glyphs (IconCard, IconBuyCrypto) instead of a generic wallet icon. Their accent colors
// live in WALLET_PALETTE alongside the rest of this file's palette.

// CustomPrimaryButton's colors come from the app's active theme (theme.colors.button.primary),
// which can be any of several unrelated theme presets (nord/dracula/gruvbox/...) — overridden
// inline here so it renders gold in line with the rest of this redesign's fixed palette.
const GOLD_BUTTON_STYLE = { background: wp.gold, color: wp.onGold, boxShadow: 'none' }

interface MethodChooserProps {
  /** §7.1: the method list is derived solely from the cashier session's `providers`. */
  providers: string[]
  onSelectFiat: () => void
  onSelectTransferCrypto: () => void
  onSelectBuyCrypto: () => void
  onSelectAgentPay: () => void
  session: CashierSession | null
  onBonusIdsChange: (bonusIds: number[]) => Promise<unknown>
  isBonusUpdating?: boolean
  /** Provider currently being locked onto the session (§7.1) — null when idle. */
  lockingProvider: string | null
  /** Cashier session is still being (re-)initialized for the selected wallet. */
  isLoading?: boolean
  /** Set when the last init attempt failed; null/undefined once it succeeds. */
  initErrorMessage?: string | null
  onRetryInit?: () => void
}

const MethodChooser: FC<MethodChooserProps> = ({
  providers,
  onSelectFiat,
  onSelectTransferCrypto,
  onSelectBuyCrypto,
  onSelectAgentPay,
  session,
  onBonusIdsChange,
  isBonusUpdating,
  lockingProvider,
  isLoading,
  initErrorMessage,
  onRetryInit,
}) => {
  const showCard = providers.includes('omno')
  const showCrypto = providers.includes('nowpayments')
  const showBuyCrypto = providers.includes('changelly')
  const showBank = providers.includes('agentpay')
  const hasNoMethods =
    !isLoading && !initErrorMessage && !showCard && !showCrypto && !showBuyCrypto && !showBank
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const wantDepositBonus = useAppSelector(
    state => state.user.playerInfo?.player?.want_deposit_bonus ?? true
  )
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  // The picked bonus is server-authoritative — always read off the live session, never
  // local state, so a re-init that drops a no-longer-offered bonus is reflected for free.
  const selectedBonusId = wantDepositBonus ? (session?.chosen_bonuses?.[0]?.id ?? null) : null
  const selectedBonus = session?.available_bonuses.find(b => b.id === selectedBonusId)
  const selectedBonusBadge = selectedBonus
    ? formatBonusBadge(selectedBonus, session?.wallet.currency ?? '')
    : ''

  const handleSelectBonus = async (bonusId: number | null) => {
    if (bonusId === null) {
      if (wantDepositBonus) {
        // Disabling auto-bonuses needs an explicit confirm; don't touch the session yet.
        setConfirmModalOpen(true)
        return
      }
      await onBonusIdsChange([])
      return
    }

    await onBonusIdsChange([bonusId])
    if (!wantDepositBonus) {
      // Picking a real bonus while the global preference is off re-enables it silently.
      try {
        await updateWantDepositBonus(true)
        dispatch(changeWantDepositBonus(true))
      } catch {
        enqueueSnackbar(t('common.error'), { variant: 'error' })
      }
    }
  }

  const handleConfirmDisable = () => {
    setUpdating(true)
    updateWantDepositBonus(false)
      .then(async () => {
        dispatch(changeWantDepositBonus(false))
        setConfirmModalOpen(false)
        await onBonusIdsChange([])
      })
      .catch(() => {
        enqueueSnackbar(t('common.error'), { variant: 'error' })
      })
      .finally(() => setUpdating(false))
  }

  return (
    <Root>
      <Title>{t('account.chooseDepositMethod')}</Title>

      {/*
        Buy Crypto (changelly) and Card (omno) have no §7.1 mapping test on this account
        (testuser000's wallets only ever return "nowpayments"/"omno") and no Pencil design
        frame — styled to match Crypto/Bank instead. Card's click still routes to the
        existing legacy /transactions/deposit flow (Omno.api.ts) rather than a
        cashier-session-aware one — acceptable per §12 (downstream flow is out of scope).
      */}

      {isLoading && (
        <StateWrapper>
          <Spinner size={24} color={wp.gold} />
        </StateWrapper>
      )}

      {!isLoading && initErrorMessage && (
        <StateWrapper>
          <StateMessage>{initErrorMessage}</StateMessage>
          <CustomPrimaryButton
            onClick={onRetryInit}
            testId={DEPOSIT_TEST_IDS.method.retry}
            style={GOLD_BUTTON_STYLE}
          >
            {t('common.tryAgain')}
          </CustomPrimaryButton>
        </StateWrapper>
      )}

      {hasNoMethods && (
        <StateWrapper>
          <StateMessage>{t('wallet.noMethods')}</StateMessage>
        </StateWrapper>
      )}

      {!isLoading && !initErrorMessage && (
        <>
          {showCard && (
            <MethodCard
              icon={<IconCard size={23} />}
              accent={wp.cardAccent}
              tileBackground={wp.cardAccent}
              tileShadowColor={wp.cardAccent}
              tileIconColor={wp.textPrimary}
              title={t('wallet.card')}
              subtitle={t('wallet.cardDesc')}
              onClick={onSelectFiat}
              testId={DEPOSIT_TEST_IDS.method.fiat}
            />
          )}

          {showCrypto && (
            <MethodCard
              icon={<IconTether size={23} />}
              accent={wp.cryptoAccent}
              tileBackground={wp.cryptoAccent}
              tileShadowColor={wp.cryptoAccent}
              tileIconColor={wp.textPrimary}
              title={t('account.transferCrypto')}
              subtitle={t('wallet.depositWithCrypto')}
              onClick={onSelectTransferCrypto}
              loading={lockingProvider === 'nowpayments'}
              disabled={lockingProvider !== null}
              testId={DEPOSIT_TEST_IDS.method.crypto}
            />
          )}

          {showBuyCrypto && (
            <MethodCard
              icon={<IconBuyCrypto size={23} />}
              accent={wp.buyCryptoAccent}
              tileBackground={wp.buyCryptoAccent}
              tileShadowColor={wp.buyCryptoAccent}
              tileIconColor={wp.textPrimary}
              title={t('account.buyCrypto')}
              subtitle={t('wallet.buyCryptoDesc')}
              onClick={onSelectBuyCrypto}
              loading={lockingProvider === 'changelly'}
              disabled={lockingProvider !== null}
              testId={DEPOSIT_TEST_IDS.method.buyCrypto}
            />
          )}

          {showBank && (
            <MethodCard
              icon="₩"
              accent={wp.gold}
              tileBackground={wp.goldGradient}
              tileShadowColor={wp.goldGradientShadow}
              tileIconColor={wp.onGold}
              title={t('wallet.bank')}
              subtitle={t('wallet.bankTransfer')}
              onClick={onSelectAgentPay}
              loading={lockingProvider === 'agentpay'}
              disabled={lockingProvider !== null}
              testId={DEPOSIT_TEST_IDS.method.agentPay}
            />
          )}
        </>
      )}

      {!isLoading && !initErrorMessage && !hasNoMethods && (
        <Section>
          <BonusHeader>
            <BonusSectionLabel>{t('deposit.depositBonus')}</BonusSectionLabel>
            {selectedBonus && (
              <BonusApplied>
                <IconCheckmark size={12} />
                {t('wallet.bonusApplied', {
                  bonus: getLocalizedString(selectedBonus.name),
                  amount: selectedBonusBadge,
                })}
              </BonusApplied>
            )}
          </BonusHeader>
          <BonusList
            walletCurrency={session?.wallet.currency ?? ''}
            bonuses={session?.available_bonuses ?? []}
            selectedBonusId={selectedBonusId}
            onSelect={handleSelectBonus}
            disabled={isBonusUpdating}
          />
        </Section>
      )}

      {/* idmap-ignore: structural modal wrapper — confirm/cancel buttons carry testids */}
      <CustomModal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <ConfirmModalRoot>
          <ConfirmModalTitle>{t('deposit.disableAutoBonuses')}</ConfirmModalTitle>
          <ConfirmModalDesc>{t('deposit.disableAutoBonusesDesc')}</ConfirmModalDesc>
          <ConfirmModalButtons>
            <CancelButton
              onClick={() => setConfirmModalOpen(false)}
              data-testid={WALLET_TEST_IDS.bonus.disableCancel}
            >
              {t('common.cancel')}
            </CancelButton>
            <CustomPrimaryButton
              onClick={handleConfirmDisable}
              loading={updating}
              disabled={updating}
              testId={WALLET_TEST_IDS.bonus.disableConfirm}
              style={GOLD_BUTTON_STYLE}
            >
              {t('common.confirm')}
            </CustomPrimaryButton>
          </ConfirmModalButtons>
        </ConfirmModalRoot>
      </CustomModal>
    </Root>
  )
}

export default MethodChooser

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Title = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${wp.textPrimary};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
`

const BonusHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const BonusSectionLabel = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${wp.textPrimary};
`

const BonusApplied = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
`

const StateWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 16px;
`

const StateMessage = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${wp.textSecondary};
  text-align: center;
`

// WALLET_PALETTE (not the app's generic theme.colors.bg/text/surface) so this dialog
// matches the rest of this redesign's fixed dark/gold palette regardless of which of the
// app's several theme presets (nord/dracula/gruvbox/...) happens to be active.
const ConfirmModalRoot = styled.div`
  background: ${wp.bgPane};
  border: 1px solid ${wp.border};
  border-radius: 18px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  box-sizing: border-box;
`

const ConfirmModalTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  color: ${wp.textPrimary};
`

const ConfirmModalDesc = styled.p`
  margin: 0 0 24px;
  font-size: ${fontSize.sm};
  font-weight: 400;
  line-height: 20px;
  color: ${wp.textSecondary};
`

const ConfirmModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid ${wp.textPrimary}17;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${wp.textSecondary};
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: ${wp.textPrimary}0d;
    border-color: ${wp.textPrimary}33;
  }
`
