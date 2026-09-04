import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Gruvbox Dark Theme
 * Based on https://github.com/morhetz/gruvbox
 *
 * Core palette:
 *   bg0 #282828   bg0_h #1d2021   bg0_s #32302f
 *   bg1 #3c3836   bg2 #504945     bg3 #665c54   bg4 #7c6f64
 *   fg0 #fbf1c7   fg1 #ebdbb2     fg2 #d5c4a1   fg3 #bdae93   fg4 #a89984
 *   gray #928374
 *
 * Accents (bright):
 *   Red #fb4934   Green #b8bb26   Yellow #fabd2f   Blue #83a598
 *   Purple #d3869b   Aqua #8ec07c   Orange #fe8019
 *
 * Accents (neutral):
 *   Red #cc241d   Green #98971a   Yellow #d79921   Blue #458588
 *   Purple #b16286   Aqua #689d6a   Orange #d65d0e
 */

export const gruvboxTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#282828', // bg0
      secondary: '#32302f', // bg0_s
      tertiary: '#1d2021', // bg0_h
      sidebar: '#1d2021', // bg0_h
      header: '#282828', // bg0
      footer: '#1d2021', // bg0_h
      banner: '#1d2021', // bg0_h
      overlay: '#282828', // bg0
      input: '#32302f', // bg0_s
    },
    text: {
      primary: '#ebdbb2', // fg1
      secondary: '#a89984', // fg4
      tertiary: '#a09080', // gray (~4.8:1 on bg0)
      icon: '#a89984', // fg4
      muted: '#a09080', // gray
      actionButton: '#ebdbb2', // fg1
    },
    success: '#b8bb26', // bright green
    error: '#fb4934', // bright red
    warning: '#fabd2f', // bright yellow
    accent: {
      primary: '#fabd2f', // bright yellow
      secondary: '#d79921', // yellow
      brand: '#d79921', // yellow
      info: '#83a598', // bright blue
    },
    surface: {
      hover: '#3c3836', // bg1
      active: '#504945', // bg2
      border: '#504945', // bg2
      borderSubtle: '#3c3836', // bg1
      muted: '#665c54', // bg3
      subtle: '#3c3836', // bg1
      headerButton: '#3c3836', // bg1
    },
    button: {
      primary: {
        bg: '#d79921', // yellow
        bgHover: '#fabd2f', // bright yellow
        bgActive: '#b57614', // faded yellow
        text: '#282828', // bg0
        boxShadow:
          '0px 2px 0px 0px #1d2021, 0px 8px 12px 0px #fabd2f inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.2) inset',
        boxShadowActive:
          '0px 2px 0px 0px #1d2021, 0px -8px 12px 0px #b57614 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.2) inset',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      secondary: {
        bg: '#3c3836', // bg1
        bgHover: '#504945', // bg2
        bgActive: '#665c54', // bg3
        text: '#ebdbb2', // fg1
        boxShadow:
          '0px 2px 0px 0px #1d2021, 0px 8px 12px 0px #504945 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        boxShadowActive:
          '0px 2px 0px 0px #1d2021, 0px -8px 12px 0px #3c3836 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#282828',
      surfaceCard: 'linear-gradient(180deg, #3c3836 0%, #32302f 100%)',
      modalOverlayTint: 'rgba(60, 56, 54, 0.2)',
      skeleton:
        'linear-gradient(90deg, rgba(60, 56, 54, 0.4) 0%, rgba(80, 73, 69, 0.6) 50%, rgba(60, 56, 54, 0.4) 100%)',
      noCryptoBanner: 'linear-gradient(101.41deg, #32302f 2.9%, #1d2021 44.84%)',
      headerFade: 'linear-gradient(180deg, #1d2021 0%, rgba(29, 32, 33, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(50, 48, 47, 0) 0%, #32302f 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #1d2021 0%, rgba(29, 32, 33, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #ebdbb2 0%, #fabd2f 100%)',
      sectionCasino: 'linear-gradient(95deg, #076678 0%, #458588 100%)',
      sectionSport: 'linear-gradient(95deg, #b57614 0%, #d79921 100%)',
      sectionBonus: 'linear-gradient(95deg, #427b58 0%, #689d6a 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #8f3f71 0.37%, #b16286 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #3c3836 0.37%, #282828 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #cc241d 0%, rgba(204, 36, 29, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #fe8019 22.32%, #d65d0e 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(215, 153, 33, 0.2) 0%, rgba(215, 153, 33, 0.04) 100%)',
    },
    shadow: {
      header: '0px 3px 4px 0px rgba(0, 0, 0, 0.5)',
      sidebar: '2px 0px 4px 0px rgba(0, 0, 0, 0.5)',
    },
    icon: {
      contrast: '#282828', // bg0
      warning: '#d65d0e', // orange
      warningBanner: '#af3a03', // dark orange
      disabled: 'rgba(235, 219, 178, 0.25)',
      dimmed: 'rgba(235, 219, 178, 0.5)',
      brand: '#d79921', // yellow
      subtle: '#928374', // gray
    },
  },
}
