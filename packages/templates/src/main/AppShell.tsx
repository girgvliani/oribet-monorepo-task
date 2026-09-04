import { Snackbar } from '@oribet/ui'
import { ComponentType, ReactElement, ReactNode, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useNotificationSound } from '@oribet/core/hooks/socket/useNotificationSound'
import { useInvalidBonusBetSocket } from '@oribet/core/hooks/socket/useInvalidBonusBetSocket'
import MainTemplate from './MainTemplate'
import ShellModals from './ShellModals'
import SessionWatcher from './SessionWatcher'
import { useActiveLayout } from './LayoutProvider'
import { useAppBootstrap } from './useAppBootstrap'

interface SocialIcon {
  icon: ReactElement
  link: string
  title: string
  isTwitter?: boolean
}

interface AboutUsItem {
  title: string
  url?: string | any
  isLiveSupport?: boolean
  isReactRoute?: boolean
}

/**
 * Props that every replaceable layout must accept. Clients who pass `layout` to AppShell must
 * render a component compatible with this contract. MainTemplate is the default.
 */
export interface LayoutProps {
  children: ReactNode
  mainLoading: boolean
  aboutUsItems: AboutUsItem[]
  socialIcons: SocialIcon[]
  customLogo?: string | ReactNode
}

interface AppShellProps {
  /** The `AppRoutes` tree (or an equivalent <Routes> subtree). */
  children: ReactNode
  aboutUsItems: AboutUsItem[]
  /** Called with the current theme's text.secondary color; returns per-client socials. */
  getSocialIcons: (color: string) => SocialIcon[]
  customLogo?: string | ReactNode
  /** Called once the LiveChatWidget signals ready. Per-client hook (e.g. seal init). */
  onLiveChatReady?: () => void
  /** Layout component wrapping the routes. Defaults to MainTemplate (the standard oribet chrome). */
  layout?: ComponentType<LayoutProps>
}

const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
}

const AppShell = ({
  children,
  aboutUsItems,
  getSocialIcons,
  customLogo,
  onLiveChatReady,
  layout: ExplicitLayout,
}: AppShellProps) => {
  const { loading, isUserAuthorized } = useAppBootstrap()
  const theme = useTheme()
  const socialIcons = getSocialIcons(theme.colors.text.secondary)
  const isMobile = useIsMobile()
  // Resolution order: <LayoutProvider> active layout → explicit `layout` prop → MainTemplate.
  const ActiveLayout = useActiveLayout()
  const Layout: ComponentType<LayoutProps> = ActiveLayout ?? ExplicitLayout ?? MainTemplate

  // Play a sound on new notifications (once, app-wide). File: each app's public/sounds/notification.wav.
  useNotificationSound()
  // Pop the invalid-bonus-bet modal on the `invalidBonusBet` socket event (app-wide).
  useInvalidBonusBetSocket()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.LiveChatWidget) return
    window.LiveChatWidget.on('ready', () => {
      if (isMobile) {
        const chat = document.getElementById('chat-widget-container')
        if (chat) chat.style.visibility = 'hidden'
      }
      onLiveChatReady?.()
    })
  }, [isMobile, onLiveChatReady])

  return (
    <Snackbar>
      <Router basename="/" {...routerConfig}>
        <Layout
          mainLoading={loading}
          aboutUsItems={aboutUsItems}
          socialIcons={socialIcons}
          customLogo={customLogo}
        >
          {isUserAuthorized !== null && children}
        </Layout>
        <ShellModals />
        <SessionWatcher />
      </Router>
    </Snackbar>
  )
}

export default AppShell
