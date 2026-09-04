import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { Spinner } from '../Spinner'
import { media, fontSize, fontWeight, lineHeight } from '../../tokens'

interface ICustomButton {
  children: ReactNode
  style?: object
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: string
  testId?: string
}

const CustomPrimaryButton: FC<ICustomButton> = ({
  children,
  style,
  onClick,
  disabled = false,
  loading = false,
  fullWidth,
  testId
}) => {
  return (
    <Wrapper $fullWidth={fullWidth}>
      <StyledButton
        data-testid={testId}
        style={style}
        onClick={() => onClick && onClick()}
        disabled={disabled || loading}
        $disabled={disabled || loading}
      >
        <div style={{ opacity: loading ? 0 : 1 }}>{children}</div>
      </StyledButton>
      {loading && (
        <Loader>
          <Spinner size={16} color="inherit" />
        </Loader>
      )}
    </Wrapper>
  )
}

export default CustomPrimaryButton

const Wrapper = styled.div<{ $fullWidth?: string }>`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: ${({ $fullWidth }) => $fullWidth || 'auto'};
`

const StyledButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  position: relative;
  padding: 7px 23px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  border: ${({ theme }) => theme.colors.button.primary.border};
  background: ${({ theme }) => theme.colors.button.primary.bg};
  box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  color: ${({ theme }) => theme.colors.button.primary.text};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.bold};
  line-height: ${lineHeight.normal};
  transition:
    background 0.3s,
    box-shadow 0.3s,
    opacity 0.3s;
  text-transform: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};

  ${media.md} {
    padding: 7px 16px;
    font-size: ${fontSize.sm};
    min-height: 44px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.button.primary.bgHover};
    box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.button.primary.bgActive};
    box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadowActive};
  }
`

const Loader = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.colors.text.primary};
  height: 16px;
`
