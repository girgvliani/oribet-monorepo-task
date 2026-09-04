import { ReactNode } from 'react'
import styled from 'styled-components'
import { media, fontSize, fontWeight, lineHeight } from '../../tokens'

interface ICustomButton {
  children: ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  testId?: string
}

const DepositButton = ({ children, style, onClick, testId }: ICustomButton) => {
  return (
    <StyledButton style={style} onClick={onClick} data-testid={testId}>
      {children}
    </StyledButton>
  )
}

export default DepositButton

const StyledButton = styled.button`
  height: 32px;
  padding: 4px 16px 4px 8px;
  border-radius: 8px;
  gap: 6px;
  display: inline-flex;
  align-items: center;
  transition: background 0.3s, box-shadow 0.3s;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.success};
  box-shadow: 0px 2px 8px 0px ${({ theme }) => `${theme.colors.success}4D`};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.bold};
  line-height: ${lineHeight.normal};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 0px;
  cursor: pointer;

  ${media.md} {
    width: 44px;
    height: 44px;
    padding: 4px;
    justify-content: center;
  }

  &:hover {
    filter: brightness(0.85);
    box-shadow: 0px 2px 8px 0px ${({ theme }) => `${theme.colors.success}4D`};
  }

  &:active {
    filter: brightness(0.7);
    box-shadow: 0px 2px 8px 0px ${({ theme }) => `${theme.colors.success}4D`};
  }
`
