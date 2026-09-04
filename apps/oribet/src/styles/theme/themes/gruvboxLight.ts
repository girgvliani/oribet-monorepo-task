import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Gruvbox Light Theme
 * Based on https://github.com/morhetz/gruvbox
 *
 * Background hierarchy (darker page bg → lighter cards for elevation):
 *   Page bg:  #f2e5bc (bg0_s)   Cards:  #fbf1c7 (bg0)   Deep chrome: #ebdbb2 (bg1)
 *   Input:    #f9f5d7 (bg0_h)   Header: #fbf1c7 (bg0)
 *
 * Text (dark-on-light, high contrast):
 *   fg0 #282828   fg1 #3c3836   fg2 #504945   fg3 #665c54   fg4 #7c6f64
 *   gray #928374
 *
 * Accents (dark variants for light bg):
 *   Red #9d0006   Green #79740e   Yellow #b57614   Blue #076678
 *   Purple #8f3f71   Aqua #427b58   Orange #af3a03
 *
 * Accents (neutral, for decorative use):
 *   Red #cc241d   Green #98971a   Yellow #d79921   Blue #458588
 *   Purple #b16286   Aqua #689d6a   Orange #d65d0e
 */

export const gruvboxLightTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#f2e5bc', // bg0_s — warm page bg, gives cards room to pop
      secondary: '#fbf1c7', // bg0 — lighter cream for elevated cards
      tertiary: '#ebdbb2', // bg1 — deeper warm tone for chrome
      sidebar: '#ebdbb2', // bg1
      header: '#fbf1c7', // bg0 — clean header
      footer: '#ebdbb2', // bg1
      banner: '#f2e5bc', // bg0_s
      overlay: 'transparent',
      input: '#f9f5d7', // bg0_h — lightest, clean inputs
    },
    text: {
      primary: '#282828', // fg0 — maximum contrast (~11:1 on bg0_s)
      secondary: '#504945', // fg2 — strong secondary (~6.5:1 on bg0_s)
      tertiary: '#7c6f64', // fg4 — readable labels (~3.8:1 on bg0_s)
      icon: '#665c54', // fg3
      muted: '#7c6f64', // fg4
      actionButton: '#fbf1c7', // bg0 — light text on dark brand buttons
    },
    success: '#79740e', // dark green
    error: '#9d0006', // dark red
    warning: '#b57614', // dark yellow
    accent: {
      primary: '#b57614', // dark yellow
      secondary: '#af3a03', // dark orange
      brand: '#b57614', // dark yellow
      info: '#076678', // dark blue
    },
    surface: {
      hover: '#ebdbb2', // bg1 — clear hover on bg0_s page
      active: '#d5c4a1', // bg2 — distinct active state
      border: '#bdae93', // bg3 — visible card edges
      borderSubtle: '#d5c4a1', // bg2 — subtle but still visible
      muted: '#a89984', // bg4
      subtle: '#d5c4a1', // bg2
      headerButton: '#f2e5bc', // bg0_s
    },
    button: {
      primary: {
        bg: '#b57614', // dark yellow — strong on light bg
        bgHover: '#d79921', // yellow — lighter hover
        bgActive: '#af3a03', // dark orange — deep press
        text: '#fbf1c7', // bg0 — light text on dark button
        boxShadow:
          '0px 1px 2px 0px rgba(40, 40, 40, 0.25), 0px 0px 10px 2px rgba(181, 118, 20, 0.3), 0px 4px 16px 0px rgba(255, 255, 255, 0.35) inset',
        boxShadowActive:
          '0px 1px 2px 0px rgba(40, 40, 40, 0.25), 0px 0px 10px 2px rgba(181, 118, 20, 0.3), 0px -4px 12px 0px rgba(175, 58, 3, 0.4) inset',
        border: '1px solid rgba(40, 40, 40, 0.15)',
      },
      secondary: {
        bg: '#ebdbb2', // bg1
        bgHover: '#d5c4a1', // bg2
        bgActive: '#bdae93', // bg3
        text: '#282828', // fg0
        boxShadow:
          '0px 1px 2px 0px rgba(40, 40, 40, 0.15), 0px 0px 10px 2px rgba(189, 174, 147, 0.3)',
        boxShadowActive:
          '0px 1px 2px 0px rgba(40, 40, 40, 0.15), 0px -4px 8px 0px rgba(168, 153, 132, 0.3) inset',
        border: '1px solid rgba(40, 40, 40, 0.12)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#fbf1c7',
      surfaceCard: 'linear-gradient(180deg, #f9f5d7 0%, #f2e5bc 100%)',
      modalOverlayTint: 'rgba(40, 40, 40, 0.12)',
      skeleton:
        'linear-gradient(90deg, rgba(213, 196, 161, 0.4) 0%, rgba(189, 174, 147, 0.6) 50%, rgba(213, 196, 161, 0.4) 100%)',
      noCryptoBanner: '#f2e5bc',
      headerFade: 'linear-gradient(180deg, #fbf1c7 0%, rgba(251, 241, 199, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(251, 241, 199, 0) 0%, #fbf1c7 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #ebdbb2 0%, rgba(235, 219, 178, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #282828 0%, #076678 100%)',
      sectionCasino: 'linear-gradient(95deg, #076678 0%, #458588 100%)',
      sectionSport: 'linear-gradient(95deg, #79740e 0%, #98971a 100%)',
      sectionBonus: 'linear-gradient(95deg, #427b58 0%, #689d6a 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #8f3f71 0.37%, #b16286 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #ebdbb2 0.37%, #f2e5bc 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #458588 0%, rgba(69, 133, 136, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #d65d0e 22.32%, #af3a03 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(181, 118, 20, 0.15) 0%, rgba(181, 118, 20, 0.04) 100%)',
    },
    shadow: {
      header: '0px 2px 4px 0px rgba(40, 40, 40, 0.1)',
      sidebar: '2px 0px 4px 0px rgba(40, 40, 40, 0.1)',
    },
    icon: {
      contrast: '#282828', // fg0
      warning: '#d65d0e', // orange
      warningBanner: '#af3a03', // dark orange
      disabled: 'rgba(124, 111, 100, 0.3)',
      dimmed: 'rgba(80, 73, 69, 0.5)',
      brand: '#b57614', // dark yellow
      subtle: '#928374', // gray
    },
  },
}
