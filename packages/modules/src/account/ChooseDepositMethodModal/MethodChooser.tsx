import { updateWantDepositBonus } from '@oribet/core/api/services/Settings.api'
import { CustomModal, CustomPrimaryButton, Spinner } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeWantDepositBonus } from '@oribet/core/redux/slices/userSlice'
import { enqueueSnackbar } from 'notistack'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface MethodChooserProps {
  showFiat: boolean
  showCrypto: boolean
  onSelectFiat: () => void
  onSelectTransferCrypto: () => void
  onSelectBuyCrypto: () => void
  onSelectAgentPay: () => void
  isFiatLoading: boolean
}

const MethodChooser: FC<MethodChooserProps> = ({
  showFiat,
  showCrypto,
  onSelectFiat,
  onSelectTransferCrypto,
  onSelectBuyCrypto,
  onSelectAgentPay,
  isFiatLoading,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const wantDepositBonus = useAppSelector(
    state => state.user.playerInfo?.player?.want_deposit_bonus ?? true
  )
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleToggleClick = () => {
    setConfirmModalOpen(true)
  }

  const handleConfirm = () => {
    const newValue = !wantDepositBonus
    setUpdating(true)
    updateWantDepositBonus(newValue)
      .then(() => {
        dispatch(changeWantDepositBonus(newValue))
        setConfirmModalOpen(false)
      })
      .catch(() => {
        enqueueSnackbar(t('common.error'), { variant: 'error' })
      })
      .finally(() => setUpdating(false))
  }

  return (
    <Root>
      <Title>{t('account.chooseDepositMethod')}</Title>

      {showFiat && (
        <Section>
          <SectionLabel>{t('account.fiat')}</SectionLabel>
          <ButtonRow>
            <MethodCard
              $disabled={isFiatLoading}
              onClick={() => !isFiatLoading && onSelectFiat()}
              data-testid={DEPOSIT_TEST_IDS.method.fiat}
            >
              <MethodLabel>{t('interkasa.depositFiat')}</MethodLabel>
              {isFiatLoading && <Spinner size={18} color={theme.colors.accent.brand} />}
            </MethodCard>
          </ButtonRow>
        </Section>
      )}

      {showCrypto && (
        <Section>
          <SectionLabel>{t('account.crypto')}</SectionLabel>
          <ButtonRow>
            <MethodCard onClick={onSelectTransferCrypto} data-testid={DEPOSIT_TEST_IDS.method.crypto}>
              <MethodLabel>{t('account.transferCrypto')}</MethodLabel>
            </MethodCard>
            <MethodCard onClick={onSelectBuyCrypto} data-testid={DEPOSIT_TEST_IDS.method.buyCrypto}>
              <MethodLabel>{t('account.buyCrypto')}</MethodLabel>
            </MethodCard>
          </ButtonRow>
        </Section>
      )}

      <Section>
        <SectionLabel>AgentPay</SectionLabel>
        <ButtonRow>
          <MethodCard onClick={onSelectAgentPay} data-testid={DEPOSIT_TEST_IDS.method.agentPay}>
            <MethodLabel>{t('account.depositAgentPay')}</MethodLabel>
          </MethodCard>
        </ButtonRow>
      </Section>

      <Section>
        <SectionLabel>{t('deposit.depositBonus')}</SectionLabel>
        <BonusToggleRow>
          <BonusToggleText>{t('deposit.wantDepositBonus')}</BonusToggleText>
          <ToggleTrack
            $isOn={wantDepositBonus}
            onClick={handleToggleClick}
            data-testid={DEPOSIT_TEST_IDS.method.bonusToggle}
          >
            <ToggleThumb $isOn={wantDepositBonus} />
          </ToggleTrack>
        </BonusToggleRow>
      </Section>

      {/* idmap-ignore: structural modal wrapper — confirm/cancel buttons carry testids */}
      <CustomModal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <ConfirmModalRoot>
          <ConfirmModalTitle>
            {wantDepositBonus
              ? t('deposit.disableAutoBonuses')
              : t('deposit.enableAutoBonuses')}
          </ConfirmModalTitle>
          <ConfirmModalDesc>
            {wantDepositBonus
              ? t('deposit.disableAutoBonusesDesc')
              : t('deposit.enableAutoBonusesDesc')}
          </ConfirmModalDesc>
          <ConfirmModalButtons>
            <CancelButton
              onClick={() => setConfirmModalOpen(false)}
              data-testid={DEPOSIT_TEST_IDS.method.bonusCancel}
            >
              {t('common.cancel')}
            </CancelButton>
            <CustomPrimaryButton
              onClick={handleConfirm}
              loading={updating}
              disabled={updating}
              testId={DEPOSIT_TEST_IDS.method.bonusConfirm}
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.h3`
  margin: 0;
  font-size: ${fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionLabel = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const MethodCard = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.accent.brand};
  transition: background 0.2s;

  &:hover {
    background: ${({ $disabled, theme }) =>
      $disabled ? theme.colors.bg.primary : theme.colors.surface.hover};
  }
`

const MethodLabel = styled.span`
  font-size: ${fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent.brand};
`

const BonusToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.primary};
`

const BonusToggleText = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ToggleTrack = styled.div<{ $isOn: boolean }>`
  width: 40px;
  height: 20px;
  background-color: ${({ $isOn, theme }) =>
    $isOn ? theme.colors.accent.brand : theme.colors.surface.hover};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  flex-shrink: 0;
`

const ToggleThumb = styled.div<{ $isOn: boolean }>`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 50%;
  top: 2px;
  left: ${({ $isOn }) => ($isOn ? 'calc(100% - 18px)' : '2px')};
  transition: left 0.3s ease-in-out;
`

const ConfirmModalRoot = styled.div`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  box-sizing: border-box;
`

const ConfirmModalTitle = styled.h3`
  margin: 0 0 16px;
  font-size: ${fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ConfirmModalDesc = styled.p`
  margin: 0 0 24px;
  font-size: ${fontSize.sm};
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ConfirmModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`
