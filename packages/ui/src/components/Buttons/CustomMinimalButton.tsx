import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, lineHeight } from '../../tokens'
import { Spinner } from '../Spinner'

interface ICustomButton {
  children: ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  alignContentOverride?: string
  testId?: string
}

const CustomMinimalButton = ({
  children,
  style,
  onClick,
  disabled = false,
  loading = false,
  alignContentOverride,
  testId
}: ICustomButton) => {
  return (
    <ButtonWrapper style={{ justifyContent: alignContentOverride || 'center' }}>
      <StyledButton
        onClick={onClick}
        disabled={disabled || loading}
        data-testid={testId}
        style={{
          ...style,
          opacity: disabled || loading ? 0.3 : 1
        }}
      >
        <ContentWrapper $loading={loading}>{children}</ContentWrapper>
      </StyledButton>
      {loading && (
        <LoaderWrapper>
          <Spinner size={16} color="inherit" />
        </LoaderWrapper>
      )}
    </ButtonWrapper>
  )
}

export default CustomMinimalButton

const ButtonWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`

const StyledButton = styled.button`
  display: flex;
  position: relative;
  padding: 7px 23px;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.bold};
  line-height: ${lineHeight.normal};
  transition:
    background 0.3s,
    box-shadow 0.3s,
    opacity 0.3s;
  text-transform: none;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surface.hover};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.bg.secondary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const ContentWrapper = styled.div<{ $loading: boolean }>`
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  letter-spacing: 0.4px;
`

const LoaderWrapper = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.colors.text.primary};
  height: 16px;
  display: flex;
  align-items: center;
`
