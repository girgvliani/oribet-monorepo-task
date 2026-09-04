import { IconDoubleChevron } from '@oribet/assets/icons/IconDoubleChevron'
import { IconSpin } from '@oribet/assets/icons/IconSpin'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

export enum BUTTON_TYPE {
  Spin = 'spin',
  Claim = 'claim',
  Wager = 'wager',
}

interface IBonusButtonProps {
  disabled?: boolean
  onConfirm?: () => void
  buttonType?: string
}

const BonusButton: FC<IBonusButtonProps> = ({ disabled, onConfirm, buttonType }) => {
  const { t } = useTranslation()
  return (
    <StyledButton
      onClick={onConfirm}
      disabled={disabled}
      data-testid={`${BONUSES_TEST_IDS.header.sidebarBonus}.${buttonType}`}
    >
      {buttonType === BUTTON_TYPE.Spin && t('sidebar.spin')}
      {buttonType === BUTTON_TYPE.Claim && t('sidebar.claim')}
      {buttonType === BUTTON_TYPE.Wager && t('wallet.playToWager')}
      {buttonType === BUTTON_TYPE.Claim && <IconDoubleChevron style={{ rotate: '90deg' }} />}
      {buttonType === BUTTON_TYPE.Wager && <IconDoubleChevron />}
      {buttonType === BUTTON_TYPE.Spin && <IconSpin />}
    </StyledButton>
  )
}

export default React.memo(BonusButton)

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  border-radius: 8px;
  border: none;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.xs};
  font-weight: 700;
  cursor: pointer;
`
