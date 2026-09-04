import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { CustomMinimalButton } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { fontSize } from '@oribet/ui'
import styled, { useTheme } from 'styled-components'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

interface LobbyCardProps {
  img: string
  desc: string
  label: string
  title: string
  altText: string
  redirectLink: string
  linearGradient: string
  labelColor: string
  labelBgColor: string
}

const LobbyCard = ({
  img,
  desc,
  label,
  title,
  altText,
  redirectLink,
  linearGradient,
  labelColor,
  labelBgColor,
}: LobbyCardProps) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useIsMobile()

  const redirectBtn = {
    height: '40px',
    minWidth: '0px',
    width: '40px',
    background: theme.colors.surface.hover,
    padding: '0px',
    justifyContent: 'center',
  }

  const handleClick = () => {
    navigate(redirectLink)
  }

  // Stable key derived from the destination route (e.g. casino / sport),
  // independent of the i18n-translated title/label.
  const cardKey = redirectLink.split('/').filter(Boolean).pop() ?? redirectLink

  return (
    <Root $isMobile={isMobile}>
      <Item
        $isMobile={isMobile}
        style={{ background: linearGradient }}
        onClick={handleClick}
        data-testid={`${DISCOVERY_TEST_IDS.banner.lobbyCard}.${cardKey}`}
      >
        <img src={img} alt={altText} width={'56px'} />
        <Content>
          <TextButtonContainer>
            <ItemTitle $isMobile={isMobile}>{title}</ItemTitle>
            <LabelContainer style={{ backgroundColor: labelBgColor }}>
              <Label style={{ color: labelColor }}>{label}</Label>
            </LabelContainer>
          </TextButtonContainer>
          <Description>{desc}</Description>
        </Content>
        {/* idmap-ignore: decorative chevron; card Item handles the click */}
        <CustomMinimalButton style={redirectBtn} onClick={() => {}}>
          <RedirectBtnSpan>
            <IconChevronRight />
          </RedirectBtnSpan>
        </CustomMinimalButton>
      </Item>
    </Root>
  )
}

export default React.memo(LobbyCard)

const Root = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '24px')};
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
  height: 132px;

  &:last-child {
    width: 100%;
  }

  @media (max-width: 1100px) {
    flex-direction: column;
    height: 64px;
    width: 100%;
  }
`

const Item = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
  gap: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
  cursor: pointer;

  @media (max-width: 1100px) {
    img {
      width: 32px;
    }

    .redirectBtn {
      width: 28px;
      height: 28px;

      button {
        width: 28px !important;
        height: 28px !important;
        padding: 4px;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  gap: 8px;
`

const ItemTitle = styled.h2<{ $isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? '19px' : fontSize.xl)};
  font-weight: 700;
  line-height: 24px;
  text-transform: uppercase;

  @media (max-width: 1100px) {
    font-size: ${fontSize.base};
  }
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 400;
  font-size: ${fontSize.base};
  line-height: 24px;
  letter-spacing: 0.5px;

  @media (max-width: 1100px) {
    display: none;
  }
`

const RedirectBtnSpan = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
`

const Label = styled.h4`
  font-size: ${fontSize.sm};
  font-weight: 700;
  line-height: 12px;
  text-transform: uppercase;
  max-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LabelContainer = styled.div`
  border-radius: 8px;
  padding: 8px 8px;
  max-height: 28px;

  @media (max-width: 1100px) {
    width: 91px;
  }
`

const TextButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: left;
  align-items: center;

  @media (max-width: 1100px) {
    flex-grow: 1;
    justify-content: space-between;
  }
`
