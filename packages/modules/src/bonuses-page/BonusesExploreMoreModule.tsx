import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { IconTelegram } from '@oribet/assets/icons/IconTelegram'
import { Defaults } from '@oribet/core/util/defaults'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

/**
 * "Explore More Bonuses" CTA at the bottom of the page — Telegram link.
 */
const BonusesExploreMoreModule = () => {
  const { t } = useTranslation()
  const onTelegramClick = () => {
    window.open(Defaults.telegramLink, '_blank')
  }

  return (
    <Root>
      <TextWrapper>
        <StyledText>{t('bonus.exploreMore')}</StyledText>
        <StyledSubText>{t('bonus.exploreMoreDesc')}</StyledSubText>
      </TextWrapper>
      <LogoWrapper>
        <TelegramButton onClick={onTelegramClick} data-testid={BONUSES_TEST_IDS.list.telegram}>
          <IconTelegram size={24} />
        </TelegramButton>
      </LogoWrapper>
    </Root>
  )
}

export default BonusesExploreMoreModule

const Root = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  justify-content: space-between;

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledText = styled.span`
  font-size: ${fontSize.sm};
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const StyledSubText = styled.span`
  font-size: ${fontSize.xs};
  line-height: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  white-space: nowrap;
`

const LogoWrapper = styled.div`
  justify-content: flex-end;
  display: flex;
  width: 100%;
  gap: 8px;
`

const TelegramButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #28a7e8;
  color: ${({ theme }) => theme.colors.text.actionButton};
  height: 32px;
  border-radius: 8px;
  outline: none;
  border: none;
  min-width: 248px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    background: #2085b9;
  }

  ${media.sm} {
    min-width: 0;
    width: 100%;
  }
`
