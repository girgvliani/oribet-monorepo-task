import { IconCheckmark } from '@oribet/assets/icons/IconCheckmark'
import { IconClock } from '@oribet/assets/icons/IconClock'
import { IconDoubleChevron } from '@oribet/assets/icons/IconDoubleChevron'
import { IconPlus } from '@oribet/assets/icons/IconPlus'
import { IconSpin } from '@oribet/assets/icons/IconSpin'
import React, { FC } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'
import { useBonusVariant } from '../app-header/components/bonusVariant'

type ButtonColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple'

export type ButtonState = 'inactive' | 'active' | 'hover' | 'pressed'

export enum BUTTON_TYPE {
  Spin = 'spin',
  Claim = 'claim',
  Wager = 'wager',
  Deposit = 'deposit',
  Expired = 'expired',
  Finished = 'finished',
}

interface StyledButtonProps {
  $color: ButtonColor
  $state: ButtonState
  $disabled?: boolean
  /** Redesign bonus dropdown: higher-contrast disabled label so it stays readable. */
  $redesign?: boolean
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor
  state?: ButtonState
  label?: string
  withIcon?: boolean
  buttonType?: BUTTON_TYPE | ''
}

const ActionButton: FC<ButtonProps> = ({
  color = 'blue',
  state = 'active',
  disabled,
  label = 'CLAIM',
  withIcon = true,
  buttonType = BUTTON_TYPE.Claim,
  ...props
}) => {
  const theme = useTheme()
  const redesign = useBonusVariant() === 'redesign'
  // If disabled is true, force the state to be inactive
  const buttonState = disabled ? 'inactive' : state

  return (
    <StyledButton
      $color={color}
      $state={buttonState}
      $disabled={disabled || buttonState === 'inactive'}
      $redesign={redesign}
      disabled={disabled}
      {...props}
    >
      {withIcon && buttonType === BUTTON_TYPE.Claim && (
        <IconDoubleChevron style={{ rotate: '90deg' }} />
      )}
      {withIcon && buttonType === BUTTON_TYPE.Wager && <IconDoubleChevron />}
      {withIcon && buttonType === BUTTON_TYPE.Spin && <IconSpin />}
      {withIcon && buttonType === BUTTON_TYPE.Deposit && <IconPlus />}
      {withIcon && buttonType === BUTTON_TYPE.Expired && (
        <IconClock style={{ color: theme.colors.icon.disabled }} />
      )}
      {withIcon && buttonType === BUTTON_TYPE.Finished && (
        <IconCheckmark style={{ color: theme.colors.icon.disabled }} />
      )}
      <span className="button__label">{label}</span>
    </StyledButton>
  )
}

export default React.memo(ActionButton)

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  border-radius: 8px;
  border: none;
  font-size: ${fontSize.xs};
  font-weight: 700;
  line-height: 16px;
  cursor: ${({ $state }) => ($state === 'inactive' ? 'auto' : 'pointer')};
  transition: background-color 0.2s ease;
  text-transform: uppercase;
  background-color: ${({ $color, $state, theme }) =>
    $state === 'inactive'
      ? theme.colors.surface.hover
      : theme.colors.button.action[$color][$state] || theme.colors.surface.hover};
  box-shadow: ${({ $color, $state, theme }) =>
    $state === 'inactive'
      ? theme.colors.button.action[$color].shadowInactive
      : theme.colors.button.action[$color].shadowActive};
  color: ${({ theme }) => theme.colors.text.actionButton};
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};

  ${({ $disabled, $redesign }) =>
    $disabled &&
    css`
      svg {
        opacity: ${$redesign ? 0.5 : 0.25};
      }
    `}

  .button__label {
    opacity: 0.92;
    margin-left: 4px;
    margin-right: 8px;
    font-size: ${fontSize.xs};
    white-space: nowrap;
    text-shadow: 0px 1px 0px #00000040;
  }

  ${({ $state, $redesign, theme }) =>
    $state === 'inactive' &&
    css`
      opacity: ${$redesign ? 1 : 0.7};
      &:hover,
      &:active {
        background-color: ${theme.colors.surface.hover};
      }
      .button__label {
        opacity: ${$redesign ? 0.65 : 0.25};
      }
    `}

  ${({ $state, $color, theme }) =>
    $state !== 'inactive' &&
    css`
      &:hover {
        background-color: ${theme.colors.button.action[$color].hover};
      }

      &:active {
        background-color: ${theme.colors.button.action[$color].pressed};
      }
    `}
`
