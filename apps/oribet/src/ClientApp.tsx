import '@fontsource/titillium-web/200.css'
import '@fontsource/titillium-web/300.css'
import '@fontsource/titillium-web/400.css'
import '@fontsource/titillium-web/600.css'
import '@fontsource/titillium-web/700.css'
import '@fontsource/titillium-web/900.css'
import '@locale/i18n'

import AppRoutes from '@containers/AppRoutes'
import ThemeWrapper from '@containers/App/ThemeWrapper'
import { store } from '@oribet/core/redux/store'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppShell, LayoutProvider, MainTemplate, type LayoutEntry } from '@oribet/templates/main'
import { aboutUsItems, getSocialIcons } from '@oribet/modules/main-footer'
import { GameCardConfigProvider } from '@oribet/modules/game-card'
import { ActivePageProvider } from '@oribet/modules/page-editor'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { GlobalStyles } from '@styles/GlobalStyles'
import { screens } from '@server/seo'

interface AnjouanSealOptions {
  sealId: string
  imageSize: number
  imageType: 'basic-small' | 'basic-large' | 'svg-small' | 'svg-large'
}

declare global {
  interface Window {
    anj_d4ef436d_a7be_4740_b197_50713eecd288: {
      init: (options?: AnjouanSealOptions) => void
    }
  }
}

const queryClient = new QueryClient()

const onLiveChatReady = () => {
  window?.anj_d4ef436d_a7be_4740_b197_50713eecd288?.init?.()
}

const OribetRoutes = () => {
  const isUserAuthorized = useAppSelector(state => state.user.isUserAuthorized)
  if (isUserAuthorized === null) return null
  return <AppRoutes isUserAuthorized={isUserAuthorized} screens={screens} />
}

// One layout — the alternate "Header Navigation" layout is gone with the pages it served.
const layouts: Record<string, LayoutEntry> = {
  main: { label: 'Oribet Layout', component: MainTemplate },
}

// Game card thumbnail aspect ratio. Switch between '3:4' | '1:1' | '4:3'.
const GAME_CARD_ASPECT_RATIO = '3:4' as const

// Max game cards visible per view in horizontal swipers.
const GAME_SWIPER_SLIDES_PER_VIEW_MOBILE = 4 // 4 default
const GAME_SWIPER_SLIDES_PER_VIEW_DESKTOP = 8 // 8 default

// Max game cards per row in grid views (games page, global search).
const GAME_CARD_GRID_COLUMNS_MOBILE = 3 // 3 default
const GAME_CARD_GRID_COLUMNS_DESKTOP = 8 // 6 default

const ClientApp = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeWrapper>
        <GlobalStyles />
        <GameCardConfigProvider
          aspectRatio={GAME_CARD_ASPECT_RATIO}
          swiperSlidesPerViewMobile={GAME_SWIPER_SLIDES_PER_VIEW_MOBILE}
          swiperSlidesPerViewDesktop={GAME_SWIPER_SLIDES_PER_VIEW_DESKTOP}
          gridColumnsMobile={GAME_CARD_GRID_COLUMNS_MOBILE}
          gridColumnsDesktop={GAME_CARD_GRID_COLUMNS_DESKTOP}
          showGameNameOverlay
        >
          <ActivePageProvider>
            <LayoutProvider layouts={layouts} defaultKey="main">
              <AppShell
                aboutUsItems={aboutUsItems}
                getSocialIcons={getSocialIcons}
                onLiveChatReady={onLiveChatReady}
              >
                <OribetRoutes />
              </AppShell>
            </LayoutProvider>
          </ActivePageProvider>
        </GameCardConfigProvider>
      </ThemeWrapper>
    </Provider>
  </QueryClientProvider>
)

export default ClientApp
