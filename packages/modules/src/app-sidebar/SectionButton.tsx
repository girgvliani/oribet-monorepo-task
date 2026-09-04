import { AtomBonusBg } from '@oribet/assets/atoms/AtomBonusBg'
import { AtomCherryBg } from '@oribet/assets/atoms/AtomCherryBg'
import { AtomSportBg } from '@oribet/assets/atoms/AtomSportBg'
import React from 'react'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'

export enum SECTION_TYPE {
  CASINO = 'casino',
  SPORT = 'sports',
  BONUS = 'bonus',
}

interface SectionButtonProps {
  active?: boolean
  type?: SECTION_TYPE
  isSideBarOpen?: boolean
  onclick?: () => void
  icon?: React.ReactNode
  label: string
  testId?: string
}

const SectionButton: React.FC<SectionButtonProps> = ({
  active = false,
  type = SECTION_TYPE.CASINO,
  isSideBarOpen,
  onclick,
  icon,
  label,
  testId,
}) => {
  return (
    <StyledButton
      $active={active}
      $type={type}
      onClick={onclick}
      $isSideBarOpen={isSideBarOpen}
      data-testid={testId ? `${testId}.${type}` : undefined}
    >
      <StyledIcon $sectionType={type}>
        {type === SECTION_TYPE.CASINO && <AtomCherryBg />}
        {type === SECTION_TYPE.SPORT && <AtomSportBg />}
        {type === SECTION_TYPE.BONUS && <AtomBonusBg />}
      </StyledIcon>
      {icon}
      {isSideBarOpen && <StyledText>{label}</StyledText>}
    </StyledButton>
  )
}

export default SectionButton

const getActiveGradient = (type: SECTION_TYPE, theme: any) => {
  switch (type) {
    case SECTION_TYPE.CASINO:
      return theme.colors.gradient.sectionCasino
    case SECTION_TYPE.SPORT:
      return theme.colors.gradient.sectionSport
    case SECTION_TYPE.BONUS:
      return theme.colors.gradient.sectionBonus
    default:
      return `linear-gradient(95deg, ${theme.colors.surface.hover} 0%, ${theme.colors.bg.secondary} 100%)`
  }
}

const StyledButton = styled.button<{
  $active?: boolean
  $type: SECTION_TYPE
  $isSideBarOpen?: boolean
}>`
  position: relative;
  display: flex;
  padding: 11.38px;
  justify-content: center;
  align-items: center;
  width: ${({ $isSideBarOpen }) => ($isSideBarOpen ? '100%' : '40px')};
  height: ${({ $isSideBarOpen }) => ($isSideBarOpen ? 'auto' : '40px')};
  gap: 4px;
  border: 0;
  border-radius: 12px;
  box-shadow: ${({ $active }) =>
    $active
      ? 'inset rgba(255, 255, 255, 0.1) 0px 0px 0px 1px'
      : 'inset rgba(255, 255, 255, 0.05) 0px 0px 0px 1px'};

  background: ${({ $active, $type, theme }) =>
    $active
      ? getActiveGradient($type, theme)
      : `linear-gradient(95.02deg, ${theme.colors.surface.hover} 0%, ${theme.colors.bg.secondary} 100%)`};
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: ${({ $type, theme }) => getActiveGradient($type, theme)};
  }
`

const getIconPosition = (type: SECTION_TYPE) => {
  switch (type) {
    case SECTION_TYPE.SPORT:
      return { left: '18px', bottom: '-6px' }
    case SECTION_TYPE.BONUS:
      return { left: '12px', bottom: '-30px' }
    case SECTION_TYPE.CASINO:
    default:
      return { left: '12px', bottom: '-20px' }
  }
}

const StyledIcon = styled.div<{ $sectionType: SECTION_TYPE }>`
  position: absolute;
  left: ${({ $sectionType }) => getIconPosition($sectionType).left};
  bottom: ${({ $sectionType }) => getIconPosition($sectionType).bottom};
`

const StyledText = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  margin-right: 4px;
  text-transform: uppercase;
`
