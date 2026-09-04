import { IconPlay } from '@oribet/assets/icons/IconPlay'
import React from 'react'
import styled, { useTheme } from 'styled-components'

interface IPlayButton {
  onClick?: () => void
  isMobile?: boolean
  testId?: string
}

const PlayButton = ({ onClick, testId }: IPlayButton) => {
  const theme = useTheme()
  return (
    <StyledButton onClick={onClick} data-testid={testId}>
      <IconPlay size={24} style={{ color: theme.colors.text.primary }} />
    </StyledButton>
  )
}

export default React.memo(PlayButton)

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ theme }) => theme.colors.button.primary.border};
  background: ${({ theme }) => theme.colors.button.primary.bg};
  width: 48px;
  height: 48px;
  border-radius: 48px;
  min-width: 0;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  transition:
    background 0.3s,
    box-shadow 0.3s,
    opacity 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.button.primary.bgHover};
    box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadow};
  }

  &:active {
    background: ${({ theme }) => theme.colors.button.primary.bgActive};
    box-shadow: ${({ theme }) => theme.colors.button.primary.boxShadowActive};
  }
`
