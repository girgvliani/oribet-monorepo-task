import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'

/**
 * Branded banner at the top of the bonuses page. Pure presentation.
 */
const BonusesHeader = () => {
  const { t } = useTranslation()
  return (
    <Card>
      <BonusIcon src="/imgs/bonus/banner-icon.png" alt="" />
      <Flex>
        <Label>{t('bonus.bonuses')}</Label>
        <Desc>{t('oribetMenu.marketplaceDesc')}</Desc>
      </Flex>
    </Card>
  )
}

export default BonusesHeader

const Card = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 12px;
  padding: 16px 40px 16px 24px;
  background: radial-gradient(
    48.31% 477.05% at 69.48% -109.78%,
    ${({ theme }) => theme.colors.bg.primary} 0%,
    ${({ theme }) => theme.colors.bg.secondary} 100%
  );
  border-top: 1px solid ${({ theme }) => theme.colors.surface.hover};
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
`

const BonusIcon = styled.img`
  width: 32px;
  height: 32px;
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Label = styled.div`
  font-family: Titillium Web;
  font-weight: 600;
  font-size: ${fontSize['2xl']};
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Desc = styled.div`
  font-family: Titillium Web;
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`
