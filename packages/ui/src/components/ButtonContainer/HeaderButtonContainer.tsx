import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { media } from '../../tokens'

interface IHeaderButtonContainer extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  testId?: string
  'data-testid'?: string
}

const ButtonContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  &:active {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  ${media.md} {
    width: 44px;
    height: 44px;
  }
`

const HeaderButtonContainer = ({
  children,
  onClick,
  testId,
  'data-testid': dataTestId,
  ...props
}: IHeaderButtonContainer) => {
  return (
    <ButtonContainer {...props} onClick={onClick} data-testid={testId ?? dataTestId}>
      {children}
    </ButtonContainer>
  )
}

export default HeaderButtonContainer
