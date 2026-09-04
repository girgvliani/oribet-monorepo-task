import { useTranslation } from 'react-i18next'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'

const DescriptionBannerModule = () => {
  const { t } = useTranslation()

  return (
    <Root>
      <Header>{t('lobby.cryptoCasinoTitle')}</Header>
      <Description>{t('lobby.cryptoCasinoDescription1')}</Description>
      <Description>{t('lobby.cryptoCasinoDescription2')}</Description>
    </Root>
  )
}

export default DescriptionBannerModule

const Root = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bg.secondary};
`

const Header = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize['2xl']};
  font-weight: 700;
  line-height: 32px;
`

const Description = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 700;
  line-height: 32px;
`
