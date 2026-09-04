import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Dracula Dark Theme
 * Based on https://draculatheme.com/specification
 *
 * Core palette:
 *   Background  #282A36    Current Line  #44475A    Selection  #44475A
 *   Foreground  #F8F8F2    Comment       #6272A4
 *   Red         #FF5555    Orange        #FFB86C    Yellow  #F1FA8C
 *   Green       #50FA7B    Cyan          #8BE9FD    Purple  #BD93F9
 *   Pink        #FF79C6
 *
 * UI palette:
 *   Floating    #343746    Bg Lighter    #424450    Bg Light   #343746
 *   Bg Dark     #21222C    Bg Darker     #191A21
 *
 * Text contrast targets (on #282A36):
 *   primary  #F8F8F2  ~12.5:1    secondary  #BCC4DB  ~7.6:1
 *   tertiary #7B8DB5  ~4.0:1     muted      #7B8DB5  ~4.0:1
 */

export const draculaTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#282A36', // Background
      secondary: '#21222C', // Background Dark
      tertiary: '#191A21', // Background Darker
      sidebar: '#191A21', // Background Darker
      header: '#282A36', // Background
      footer: '#191A21', // Background Darker
      banner: '#191A21', // Background Darker
      overlay: '#282A36', // Background
      input: '#21222C', // Background Dark
    },
    text: {
      primary: '#F8F8F2', // Foreground
      secondary: '#BCC4DB', // Light blue-gray (~7.6:1)
      tertiary: '#7B8DB5', // Mid blue-gray (~4:1)
      icon: '#BCC4DB', // Matches secondary for visibility
      muted: '#7B8DB5', // Readable muted (~4:1)
      actionButton: '#F8F8F2', // Foreground (light text on colored bg)
    },
    success: '#50FA7B', // Green
    error: '#FF5555', // Red
    warning: '#FFB86C', // Orange
    accent: {
      primary: '#FFB86C', // Orange (gold accent)
      secondary: '#FF79C6', // Pink
      brand: '#BD93F9', // Purple (main brand)
      info: '#8BE9FD', // Cyan
    },
    surface: {
      hover: '#44475A', // Selection / Current Line
      active: '#424450', // Background Lighter
      border: '#44475A', // Selection
      borderSubtle: '#343746', // Background Light / Floating
      muted: '#6272A4', // Comment
      subtle: '#44475A', // Selection
      headerButton: '#44475A', // Selection
    },
    button: {
      primary: {
        bg: '#BD93F9', // Purple
        bgHover: '#CAA5FF', // Lighter purple
        bgActive: '#A87EE6', // Darker purple
        text: '#282A36', // Background (dark on purple)
        boxShadow:
          '0px 2px 0px 0px #191A21, 0px 8px 12px 0px #BD93F9 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.2) inset',
        boxShadowActive:
          '0px 2px 0px 0px #191A21, 0px -8px 12px 0px #9370DB inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.2) inset',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      secondary: {
        bg: '#44475A', // Selection
        bgHover: '#424450', // Background Lighter
        bgActive: '#343746', // Background Light
        text: '#F8F8F2', // Foreground
        boxShadow:
          '0px 2px 0px 0px #191A21, 0px 8px 12px 0px #44475A inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        boxShadowActive:
          '0px 2px 0px 0px #191A21, 0px -8px 12px 0px #44475A inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#282A36',
      surfaceCard: 'linear-gradient(180deg, #343746 0%, #21222C 100%)',
      modalOverlayTint: 'rgba(52, 55, 70, 0.2)',
      skeleton:
        'linear-gradient(90deg, rgba(68, 71, 90, 0.4) 0%, rgba(66, 68, 80, 0.6) 50%, rgba(68, 71, 90, 0.4) 100%)',
      noCryptoBanner: 'linear-gradient(101.41deg, #343746 2.9%, #21222C 44.84%)',
      headerFade: 'linear-gradient(180deg, #191A21 0%, rgba(25, 26, 33, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(33, 34, 44, 0) 0%, #21222C 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #191A21 0%, rgba(25, 26, 33, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #F8F8F2 0%, #8BE9FD 100%)',
      sectionCasino: 'linear-gradient(95deg, #9B6FE8 0%, #BD93F9 100%)',
      sectionSport: 'linear-gradient(95deg, #D4952A 0%, #FFB86C 100%)',
      sectionBonus: 'linear-gradient(95deg, #3D8C4E 0%, #50FA7B 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #44275A 0.37%, #2D1845 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #3A2D1F 0.37%, #21222C 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #4A2020 0%, rgba(157, 86, 77, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #FFB86C 22.32%, #FF79C6 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(98, 114, 164, 0.2) 0%, rgba(98, 114, 164, 0.04) 100%)',
    },
    shadow: {
      header: '0px 3px 4px 0px rgba(0, 0, 0, 0.5)',
      sidebar: '2px 0px 4px 0px rgba(0, 0, 0, 0.5)',
    },
    icon: {
      contrast: '#282A36', // Background (dark icon on colored circle)
      warning: '#BD93F9', // Purple (brand color for icon badges)
      warningBanner: '#4A2020', // Dark red tint
      disabled: 'rgba(248, 248, 242, 0.25)',
      dimmed: 'rgba(248, 248, 242, 0.5)',
      brand: '#BD93F9', // Purple
      subtle: '#7B8DB5', // Matches muted text
    },
  },
}
