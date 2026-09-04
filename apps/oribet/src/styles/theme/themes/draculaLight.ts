import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Dracula Light Theme
 * Based on https://draculatheme.com/specification (inverted for light mode)
 *
 * Background hierarchy (darker page → lighter cards for elevation):
 *   Page bg:  #EAEAF2 (lavender-gray)   Cards:  #F7F7FB (light lavender)
 *   Chrome:   #DDDDE6 (deeper)          Header: #F1F1F7
 *   Input:    #FDFDFF (near-white)
 *
 * Text (Dracula bg/line/comment on light bg):
 *   #282A36 (~11:1)   #44475A (~7.7:1)   #6272A4 (~4:1)
 *
 * Accents (darkened Dracula colors for light-bg contrast):
 *   Purple  #7C4DBC    Pink    #A83A79    Orange  #8B5510
 *   Cyan    #147080    Green   #1E7D38    Red     #C03030
 */

export const draculaLightTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#EAEAF2', // Lavender-gray page bg
      secondary: '#F7F7FB', // Light lavender, elevated cards
      tertiary: '#DDDDE6', // Deeper chrome
      sidebar: '#DDDDE6',
      header: '#F1F1F7', // Between page and cards
      footer: '#DDDDE6',
      banner: '#EAEAF2',
      overlay: 'transparent',
      input: '#FDFDFF', // Near-white, clean inputs
    },
    text: {
      primary: '#282A36', // Dracula bg → max contrast (~11:1)
      secondary: '#44475A', // Current Line → strong secondary (~7.7:1)
      tertiary: '#6272A4', // Comment → labels (~4:1)
      icon: '#44475A', // Current Line
      muted: '#6272A4', // Comment
      actionButton: '#F8F8F2', // Foreground — light text on dark buttons
    },
    success: '#1E7D38', // Darkened green
    error: '#C03030', // Darkened red
    warning: '#8B5510', // Darkened orange
    accent: {
      primary: '#8B5510', // Darkened orange
      secondary: '#A83A79', // Darkened pink
      brand: '#7C4DBC', // Darkened purple (brand stays purple)
      info: '#147080', // Darkened cyan
    },
    surface: {
      hover: '#DDDDE6', // Clear hover on page bg
      active: '#CFCFD9', // Distinct active
      border: '#C0C0CC', // Visible card edges
      borderSubtle: '#D2D2DC', // Subtle but visible
      muted: '#AAABB8',
      subtle: '#D2D2DC',
      headerButton: '#EAEAF2',
    },
    button: {
      primary: {
        bg: '#7C4DBC', // Darkened purple
        bgHover: '#9060CC', // Lighter purple
        bgActive: '#6840A2', // Deeper press
        text: '#F8F8F2', // Foreground
        boxShadow:
          '0px 1px 2px 0px rgba(40, 42, 54, 0.2), 0px 0px 10px 2px rgba(124, 77, 188, 0.25), 0px 4px 16px 0px rgba(255, 255, 255, 0.3) inset',
        boxShadowActive:
          '0px 1px 2px 0px rgba(40, 42, 54, 0.2), 0px 0px 10px 2px rgba(124, 77, 188, 0.25), 0px -4px 12px 0px rgba(104, 64, 162, 0.4) inset',
        border: '1px solid rgba(40, 42, 54, 0.12)',
      },
      secondary: {
        bg: '#DDDDE6',
        bgHover: '#CFCFD9',
        bgActive: '#C0C0CC',
        text: '#282A36', // Dracula bg
        boxShadow:
          '0px 1px 2px 0px rgba(40, 42, 54, 0.12), 0px 0px 10px 2px rgba(192, 192, 204, 0.3)',
        boxShadowActive:
          '0px 1px 2px 0px rgba(40, 42, 54, 0.12), 0px -4px 8px 0px rgba(170, 171, 184, 0.3) inset',
        border: '1px solid rgba(40, 42, 54, 0.1)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#F1F1F7',
      surfaceCard: 'linear-gradient(180deg, #F1F1F7 0%, #EAEAF2 100%)',
      modalOverlayTint: 'rgba(40, 42, 54, 0.1)',
      skeleton:
        'linear-gradient(90deg, rgba(210, 210, 220, 0.4) 0%, rgba(192, 192, 204, 0.6) 50%, rgba(210, 210, 220, 0.4) 100%)',
      noCryptoBanner: '#EAEAF2',
      headerFade: 'linear-gradient(180deg, #F1F1F7 0%, rgba(241, 241, 247, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(247, 247, 251, 0) 0%, #F7F7FB 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #DDDDE6 0%, rgba(221, 221, 230, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #282A36 0%, #7C4DBC 100%)',
      sectionCasino: 'linear-gradient(95deg, #6840A2 0%, #7C4DBC 100%)',
      sectionSport: 'linear-gradient(95deg, #8B5510 0%, #B07020 100%)',
      sectionBonus: 'linear-gradient(95deg, #1E7D38 0%, #2E9E50 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #A83A79 0.37%, #C860A0 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #DDDDE6 0.37%, #EAEAF2 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #7C4DBC 0%, rgba(124, 77, 188, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #B07020 22.32%, #C03030 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(124, 77, 188, 0.15) 0%, rgba(124, 77, 188, 0.04) 100%)',
    },
    shadow: {
      header: '0px 2px 4px 0px rgba(40, 42, 54, 0.1)',
      sidebar: '2px 0px 4px 0px rgba(40, 42, 54, 0.1)',
    },
    icon: {
      contrast: '#282A36', // Dracula bg
      warning: '#B07020', // Darkened orange
      warningBanner: '#C03030', // Darkened red
      disabled: 'rgba(98, 114, 164, 0.3)',
      dimmed: 'rgba(68, 71, 90, 0.5)',
      brand: '#7C4DBC', // Darkened purple
      subtle: '#6272A4', // Comment
    },
  },
}
