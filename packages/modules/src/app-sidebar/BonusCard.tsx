import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { useBonusVariant } from '../app-header/components/bonusVariant'

interface IBonusCardProps {
  icon?: ReactNode
  iconImgUrl?: string
  children?: ReactNode
  title?: string
  infoText?: string
  footerContent?: ReactNode
  inactive?: boolean
  backgroundColor?: string
  fullWidth?: boolean
  partialBorder?: boolean
  isForWelcomeBonus?: boolean
  rightText?: ReactNode
  testId?: string
}

const BonusCard: FC<IBonusCardProps> = ({
  icon,
  iconImgUrl,
  children,
  title,
  infoText,
  footerContent,
  inactive,
  fullWidth,
  rightText,
  backgroundColor,
  isForWelcomeBonus,
  partialBorder = false,
  testId,
}) => {
  const flat = useBonusVariant() === 'redesign'
  return (
    <Outher $isForWelcomeBonus={!!isForWelcomeBonus} $fullWidth={fullWidth} data-testid={testId}>
      <BonusContainer
        $backgroundColor={backgroundColor}
        $partialBorder={partialBorder}
        $isForWelcomeBonus={!!isForWelcomeBonus}
        $flat={flat}
      >
        <CardTopContainer>
          <TopLeftContent>
            {iconImgUrl ? <IconImgUrl alt="Gift Box Icon" src={iconImgUrl} /> : icon ? icon : null}
            <StyledTitle>{title}</StyledTitle>
            {rightText && <RightText>{rightText}</RightText>}
          </TopLeftContent>
          <StyledInfoText $inactive={inactive}>{infoText}</StyledInfoText>
        </CardTopContainer>
        {children}
        {footerContent ? footerContent : null}
      </BonusContainer>
    </Outher>
  )
}

export default BonusCard

const Outher = styled.div<{
  $isForWelcomeBonus: boolean
  $fullWidth?: boolean
}>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  padding: 1px;
  background: ${({ theme }) => theme.colors.gradient.bonusCardOuter};
  border-radius: 12px;
  display: inline-block;

  ${({ $isForWelcomeBonus }) =>
    !$isForWelcomeBonus
      ? 'padding: 0; background: initial; border-radius: initial; display: initial'
      : ''}
`

const BonusContainer = styled.div<{
  $backgroundColor?: string
  $partialBorder?: boolean
  $isForWelcomeBonus?: boolean
  $flat?: boolean
}>`
  display: flex;
  padding: 4px;
  flex-direction: column;
  position: relative;
  background: ${({ $backgroundColor, theme }) =>
    $backgroundColor ? $backgroundColor : (theme.colors.surface.card ?? theme.colors.bg.primary)};
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 12px;
  height: 100%;

  /* Theme-driven masked card border — brand themes set gradient.cardBorder
     (oribet subtle, korea gold). Falls back to the legacy surface.hover border. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: ${({ theme }) => theme.colors.gradient.cardBorder ?? theme.colors.surface.hover};
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  ${({ $isForWelcomeBonus }) =>
    $isForWelcomeBonus ? 'padding: 3px; &::before { display: none; }' : ''}

  ${({ $flat, theme }) =>
    $flat ? `background: ${theme.colors.bg.primary}; &::before { display: none; }` : ''}
`

const CardTopContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  flex-grow: 1;
  max-height: 42px;
`

const TopLeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`
const StyledTitle = styled.span`
  font-size: ${fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 16px;
  letter-spacing: 0px;
  font-weight: 600;
`
const StyledInfoText = styled.span<{ $inactive?: boolean }>`
  font-size: ${fontSize.sm};
  color: ${({ $inactive, theme }) =>
    $inactive ? theme.colors.text.tertiary : theme.colors.text.primary};
  line-height: 16px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: capitalize;
`

const RightText = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
`

const IconImgUrl = styled.img`
  width: 20px;
  height: 20px;
`
