import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Nord Dark Theme
 * Based on https://www.nordtheme.com
 *
 * Polar Night (backgrounds):
 *   nord0 #2E3440   nord1 #3B4252   nord2 #434C5E   nord3 #4C566A
 *
 * Snow Storm (text):
 *   nord4 #D8DEE9   nord5 #E5E9F0   nord6 #ECEFF4
 *
 * Frost (accent blues):
 *   nord7 #8FBCBB   nord8 #88C0D0   nord9 #81A1C1   nord10 #5E81AC
 *
 * Aurora (functional):
 *   nord11 #BF616A (red)   nord12 #D08770 (orange)   nord13 #EBCB8B (yellow)
 *   nord14 #A3BE8C (green)   nord15 #B48EAD (purple)
 */

export const nordTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#2E3440', // nord0
      secondary: '#3B4252', // nord1
      tertiary: '#272C36', // darker than nord0
      sidebar: '#272C36',
      header: '#2E3440', // nord0
      footer: '#272C36',
      banner: '#272C36',
      overlay: '#2E3440', // nord0
      input: '#3B4252', // nord1
    },
    text: {
      primary: '#ECEFF4', // nord6
      secondary: '#D8DEE9', // nord4
      tertiary: '#929bb0', // muted nord (~4.8:1 on nord0)
      icon: '#D8DEE9', // nord4
      muted: '#929bb0',
      actionButton: '#ECEFF4', // nord6
    },
    success: '#A3BE8C', // nord14
    error: '#BF616A', // nord11
    warning: '#EBCB8B', // nord13
    accent: {
      primary: '#88C0D0', // nord8
      secondary: '#81A1C1', // nord9
      brand: '#5E81AC', // nord10
      info: '#8FBCBB', // nord7
    },
    surface: {
      hover: '#3B4252', // nord1
      active: '#434C5E', // nord2
      border: '#434C5E', // nord2
      borderSubtle: '#3B4252', // nord1
      muted: '#4C566A', // nord3
      subtle: '#3B4252', // nord1
      headerButton: '#3B4252', // nord1
    },
    button: {
      primary: {
        bg: '#5E81AC', // nord10
        bgHover: '#81A1C1', // nord9
        bgActive: '#4C6A91', // darker nord10
        text: '#ECEFF4', // nord6
        boxShadow:
          '0px 2px 0px 0px #272C36, 0px 8px 12px 0px #81A1C1 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        boxShadowActive:
          '0px 2px 0px 0px #272C36, 0px -8px 12px 0px #4C6A91 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.15) inset',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
      secondary: {
        bg: '#3B4252', // nord1
        bgHover: '#434C5E', // nord2
        bgActive: '#4C566A', // nord3
        text: '#ECEFF4', // nord6
        boxShadow:
          '0px 2px 0px 0px #272C36, 0px 8px 12px 0px #434C5E inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.1) inset',
        boxShadowActive:
          '0px 2px 0px 0px #272C36, 0px -8px 12px 0px #3B4252 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.1) inset',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#2E3440',
      surfaceCard: 'linear-gradient(180deg, #3B4252 0%, #2E3440 100%)',
      modalOverlayTint: 'rgba(59, 66, 82, 0.2)',
      skeleton:
        'linear-gradient(90deg, rgba(59, 66, 82, 0.4) 0%, rgba(67, 76, 94, 0.6) 50%, rgba(59, 66, 82, 0.4) 100%)',
      noCryptoBanner: 'linear-gradient(101.41deg, #3B4252 2.9%, #272C36 44.84%)',
      headerFade: 'linear-gradient(180deg, #272C36 0%, rgba(39, 44, 54, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(59, 66, 82, 0) 0%, #3B4252 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #272C36 0%, rgba(39, 44, 54, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #ECEFF4 0%, #88C0D0 100%)',
      sectionCasino: 'linear-gradient(95deg, #4C6A91 0%, #5E81AC 100%)',
      sectionSport: 'linear-gradient(95deg, #C7956E 0%, #D08770 100%)',
      sectionBonus: 'linear-gradient(95deg, #8BAA78 0%, #A3BE8C 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #9A7B94 0.37%, #B48EAD 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #3B4252 0.37%, #2E3440 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #BF616A 0%, rgba(191, 97, 106, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #D08770 22.32%, #BF616A 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(94, 129, 172, 0.2) 0%, rgba(94, 129, 172, 0.04) 100%)',
    },
    shadow: {
      header: '0px 3px 4px 0px rgba(0, 0, 0, 0.4)',
      sidebar: '2px 0px 4px 0px rgba(0, 0, 0, 0.4)',
    },
    icon: {
      contrast: '#2E3440', // nord0
      warning: '#D08770', // nord12
      warningBanner: '#BF616A', // nord11
      disabled: 'rgba(236, 239, 244, 0.25)',
      dimmed: 'rgba(216, 222, 233, 0.5)',
      brand: '#5E81AC', // nord10
      subtle: '#8891A5',
    },
  },
}
