import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { AtomDiamondOrange } from '@oribet/assets/atoms/AtomDiamondOrange'
import { ActionButton, BUTTON_TYPE, BonusCard } from '@oribet/modules/app-sidebar'
import { useFetchActiveBmBonus, WagerProgressBar } from '@oribet/modules/app-header'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { Defaults } from '@oribet/core/util/defaults'
import { formatAmount, getBonusProgress, getWagerMultiplier } from '@oribet/core/util/appUtil'
import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { useBonusesPageData } from '@oribet/core/hooks/bonus/useBonusesPageData'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import ClaimableBonusCard from './ClaimableBonusCard'
import QueuedBonusCard from './QueuedBonusCard'

/**
 * Two-column "Bonus Money" section: active/queued bonuses on the left, claimable bonuses on
 * the right. Owns the claim-and-wager flow for the first claimable bonus.
 */
const BonusesBonusMoneyModule = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const userInfo = useAppSelector(state => state.user.playerInfo)
  const walletCurrency = userInfo?.player?.default_wallet?.currency
  const { data: activeBmBonus } = useFetchActiveBmBonus()
  const activeBonus = activeBmBonus?.data ?? null
  const { queuedBonuses, claimableBonuses, claimBonus, onBonusClaimed } = useBonusesPageData()
  const [claimingReadyBonus, setClaimingReadyBonus] = useState(false)

  const firstClaimableBonus = claimableBonuses.length > 0 ? claimableBonuses[0] : null

  const handleClaimAndWager = async () => {
    if (!firstClaimableBonus) return
    setClaimingReadyBonus(true)
    try {
      await claimBonus(firstClaimableBonus.id)
    } finally {
      setClaimingReadyBonus(false)
    }
  }

  const onMoveToBalance = () => {
    Defaults.modals.moveToMainBalanceModal?.open()
  }

  return (
    <Wrapper>
      <Heading>
        {t('bonus.bonusMoney')}
        {walletCurrency && <WalletBadge>{walletCurrency}</WalletBadge>}
      </Heading>
      <Columns>
        <Column>
          <ColumnHeader>{t('bonus.activeBonus')}</ColumnHeader>
          <BonusCard
            testId={`${BONUSES_TEST_IDS.list.card}.${firstClaimableBonus?.id ?? activeBonus?.id ?? 'bonus-money'}`}
            icon={<AtomDiamondOrange />}
            title={`${walletCurrency || ''} ${t('wallet.bonusBalance')}`}
            infoText={`${getActiveCurrencySymbol()}${formatAmount(firstClaimableBonus ? firstClaimableBonus.amount : activeBonus?.amount)}`}
            rightText={activeBonus ? <ActiveBadge>{t('bonus.active')}</ActiveBadge> : null}
            footerContent={
              activeBonus?.is_wagered ? (
                <ActionButton
                  color="orange"
                  onClick={onMoveToBalance}
                  data-testid={`${BONUSES_TEST_IDS.list.action}.bonus-money.move`}
                />
              ) : firstClaimableBonus ? (
                <ActionButton
                  color="orange"
                  buttonType=""
                  withIcon={false}
                  disabled={claimingReadyBonus}
                  label={t('wallet.claimBonusToWager')}
                  onClick={handleClaimAndWager}
                  style={{ marginTop: '4px' }}
                  data-testid={`${BONUSES_TEST_IDS.list.action}.bonus-money.claim`}
                />
              ) : (
                <ActionButton
                  disabled={!activeBonus}
                  buttonType={BUTTON_TYPE.Wager}
                  label={t('wallet.playToWager')}
                  onClick={() => navigate(AppRoutePath.BONUSMODE())}
                  style={{ marginTop: '4px' }}
                  data-testid={`${BONUSES_TEST_IDS.list.action}.bonus-money.wager`}
                />
              )
            }
            backgroundColor={theme.colors.bg.secondary}
            partialBorder
            fullWidth
          >
            <WagerProgressBar
              wager={firstClaimableBonus ? undefined : getWagerMultiplier(activeBonus)}
              progress={firstClaimableBonus ? 100 : getBonusProgress(activeBonus)}
              color="orange"
              totalSegments={5}
              label={t('wallet.wagerProgress')}
              backgroundColor={theme.colors.bg.primary}
              shouldBeThin
            />
          </BonusCard>
          {queuedBonuses.length > 0 && <ColumnHeader>{t('bonus.queuedBonuses')}</ColumnHeader>}
          {queuedBonuses.map(bonus => (
            <QueuedBonusCard key={bonus.id} bonus={bonus} />
          ))}
        </Column>
        <Column>
          <ColumnHeader>{t('bonus.claimableBonuses')}</ColumnHeader>
          {claimableBonuses.length > 0 ? (
            claimableBonuses.map(bonus => (
              <ClaimableBonusCard key={bonus.id} bonus={bonus} onClaimed={onBonusClaimed} />
            ))
          ) : (
            <EmptyState>{t('bonus.noClaimableBonuses')}</EmptyState>
          )}
        </Column>
      </Columns>
    </Wrapper>
  )
}

export default BonusesBonusMoneyModule

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Heading = styled.span`
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 16px;
`

const WalletBadge = styled.span`
  font-size: ${fontSize.xs};
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text.tertiary};
  background: ${({ theme }) => theme.colors.surface.hover};
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  vertical-align: middle;
`

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ColumnHeader = styled.span`
  margin-left: 16px;
  font-weight: 600;
  font-size: ${fontSize.sm};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyState = styled.div`
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 16px;
  text-align: center;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
`

const ActiveBadge = styled.span`
  font-size: ${fontSize.xs};
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.surface.hover};
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
`
