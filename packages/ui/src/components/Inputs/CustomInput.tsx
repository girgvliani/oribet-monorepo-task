import { IconEye } from '../../icons'
import { ChangeEvent, ReactNode, useId, useState } from 'react'
import styled, { css } from 'styled-components'
import { fontSize, fontWeight, lineHeight } from '../../tokens'

interface ICustomInput {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  defaultValue?: string
  isRequired?: boolean
  type?: string
  value?: string | number | null
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  secondary?: boolean
  size?: string
  disabled?: boolean
  onKeyPress?: () => void
  isGap?: boolean
  onBlur?: () => void
  autoFocus?: boolean
  style?: React.CSSProperties
  error?: string
  testId?: string
}

const CustomInput = ({
  onChange,
  defaultValue,
  placeholder,
  label,
  isRequired,
  type,
  value,
  startAdornment,
  endAdornment,
  secondary = false,
  size,
  disabled = false,
  onKeyPress,
  isGap,
  onBlur,
  autoFocus = false,
  style = {},
  error,
  testId
}: ICustomInput) => {
  const inputId = useId()
  const errorId = useId()
  // Only password fields get a reveal toggle. The rendered type is ALWAYS derived
  // from the `type` prop (never cached in state) so a non-password field — e.g. the
  // email field — can never get stuck rendering as a password when React reuses this
  // instance at the same tree position.
  const [revealPassword, setRevealPassword] = useState(false)
  const inputType = type === 'password' && revealPassword ? 'text' : type

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onKeyPress) {
      event.preventDefault()
      onKeyPress()
    }
  }

  const showPassword = () => setRevealPassword(prev => !prev)

  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {isRequired && <RequiredMark aria-hidden="true">*</RequiredMark>}
      <InputContainer $isGap={isGap}>
        <StyledInputGroup
          $secondary={secondary}
          $hasStartAdornment={!!startAdornment}
          $size={size}
          $disabled={disabled}
          style={style}
        >
          {startAdornment && <Adornment $position="start">{startAdornment}</Adornment>}
          <StyledInput
            id={inputId}
            data-testid={testId}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
            defaultValue={defaultValue}
            onChange={onChange}
            type={inputType}
            autoComplete="off"
            value={value ?? undefined}
            disabled={disabled}
            onBlur={() => onBlur && onBlur()}
            autoFocus={autoFocus}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-required={isRequired}
            $hasStartAdornment={!!startAdornment}
            $hasEndAdornment={!!endAdornment || type === 'password'}
            $secondary={secondary}
            $size={size}
          />
          {endAdornment && <Adornment $position="end">{endAdornment}</Adornment>}
        </StyledInputGroup>

        {type === 'password' && (
          <EyeIcon
            data-testid={testId ? `${testId}.visibility-toggle` : undefined}
            role="button"
            tabIndex={0}
            aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
            onClick={showPassword}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPassword() } }}
          >
            <IconEye size={16} type={inputType} />
          </EyeIcon>
        )}
      </InputContainer>

      {error && (
        <ErrorContainer id={errorId} role="alert" data-testid={testId ? `${testId}-error` : undefined}>
          <InputError error={error} />
        </ErrorContainer>
      )}
    </InputWrapper>
  )
}

export default CustomInput

const InputError = ({ error }: { error: string }) => {
  return (
    <ErrorWrapper>
      <ErrorText>{error}</ErrorText>
    </ErrorWrapper>
  )
}

const InputWrapper = styled.div`
  width: 100%;

  & input[type='number']::-webkit-inner-spin-button,
  & input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const Label = styled.label`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
  letter-spacing: 0px;
  text-align: left;
  padding-left: 16px;
  padding-bottom: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
`

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
  margin-left: 4px;
`

const InputContainer = styled.div<{ $isGap?: boolean }>`
  margin-top: ${({ $isGap }) => ($isGap ? '5px' : '')};
  position: relative;
`

const StyledInputGroup = styled.div<{
  $secondary?: boolean
  $hasStartAdornment?: boolean
  $size?: string
  $disabled?: boolean
}>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;

  ${({ $secondary }) =>
    $secondary &&
    css`
      background: ${({ theme }) => theme.colors.bg.tertiary};
      border-radius: 12px;
      border: 1px solid ${({ theme }) => theme.colors.surface.hover};
    `}
`

const StyledInput = styled.input<{
  $hasStartAdornment?: boolean
  $hasEndAdornment?: boolean
  $secondary?: boolean
  $size?: string
}>`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;

  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
  letter-spacing: 0px;
  text-align: left;
  padding: 12px 16px;
  width: 100%;
  box-sizing: border-box;

  ${({ $secondary }) =>
    $secondary &&
    css`
      padding-top: 11px;
      padding-bottom: 11px;
    `}

  ${({ $size }) =>
    $size === 'small' &&
    css`
      padding: 8px 12px;
    `}

  ${({ $hasStartAdornment, $size }) =>
    $hasStartAdornment &&
    css`
      padding-left: 0;
      padding-right: ${$size === 'small' ? '12px' : '16px'};
    `}

  ${({ $hasEndAdornment }) =>
    $hasEndAdornment &&
    css`
      padding-right: 40px;
    `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text.primary};
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text.primary};
  }
`

const Adornment = styled.div<{ $position: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  padding: ${({ $position }) => ($position === 'start' ? '0 8px 0 16px' : '0 16px 0 8px')};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EyeIcon = styled.div`
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  right: 16px;
  cursor: pointer;
  height: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 2;
`

const ErrorContainer = styled.div`
  margin-top: 8px;
`

const ErrorWrapper = styled.div`
  display: block;
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
`

const ErrorText = styled.p`
  font-size: ${fontSize.sm};
  line-height: ${lineHeight.normal};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`
