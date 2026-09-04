import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import LobbyCard from './LobbyCard'
import { useShouldRender } from '../page-editor/useShouldRender'
import type { ModuleProps } from '../page-editor/types'

const CategoryBannersModule = ({ visible }: ModuleProps = {}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()
  const shouldRender = useShouldRender(visible)
  if (!shouldRender) return null

  return (
    <BannersContainer $isMobile={isMobile}>
      <LobbyCard
        labelColor={theme.colors.accent.primary}
        labelBgColor={`${theme.colors.accent.primary}40`}
        title={t('lobby.casino')}
        desc={t('lobby.casinoBannerText')}
        img="/imgs/lobby/roulette.png"
        altText="roulette img"
        label={t('lobby.moreThan9KGames')}
        redirectLink={AppRoutePath.CASINO()}
        linearGradient={`linear-gradient(287.43deg, ${theme.colors.bg.secondary} -8.98%, ${theme.colors.bg.secondary} 53.91%, ${theme.colors.accent.primary} 129.42%)`}
      />
      <LobbyCard
        title={t('header.sport')}
        desc={t('lobby.sportsBannerText')}
        img="/imgs/lobby/sport.png"
        altText="sport img"
        label={t('lobby.epic')}
        redirectLink={AppRoutePath.SPORT()}
        labelColor={theme.colors.accent.brand}
        labelBgColor={`${theme.colors.accent.brand}40`}
        linearGradient={`linear-gradient(287.43deg, ${theme.colors.bg.secondary} -8.98%, ${theme.colors.bg.secondary} 53.91%, ${theme.colors.accent.brand} 129.42%)`}
      />
    </BannersContainer>
  )
}

export default CategoryBannersModule

const BannersContainer = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr' : '1fr 1fr')};
  gap: 16px;
  width: 100%;
`
