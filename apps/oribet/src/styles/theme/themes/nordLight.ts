import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

/**
 * Nord Light Theme
 * Based on https://www.nordtheme.com
 *
 * Background hierarchy (Snow Storm, darker page → lighter cards):
 *   Page bg: #D8DEE9 (nord4)   Cards: #ECEFF4 (nord6)   Deep chrome: #CDD4E0
 *   Input:   #F2F4F8            Header: #E5E9F0 (nord5)
 *
 * Text (Polar Night on Snow Storm, high contrast):
 *   nord0 #2E3440   nord1 #3B4252   nord2 #434C5E   nord3 #4C566A
 *
 * Frost (accent blues, darkened for light bg):
 *   nord7 #6BA1A0   nord8 #6AA3B5   nord9 #5E81AC   nord10 #4C6A91
 *
 * Aurora (functional, darkened for contrast):
 *   red #A5404A   orange #B5684E   yellow #C4A24E
 *   green #7A9A65   purple #96698D
 */

export const nordLightTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#D8DEE9', // nord4 — cool page bg
      secondary: '#ECEFF4', // nord6 — lighter for elevated cards
      tertiary: '#CDD4E0', // slightly darker than nord4
      sidebar: '#CDD4E0',
      header: '#E5E9F0', // nord5
      footer: '#CDD4E0',
      banner: '#D8DEE9', // nord4
      overlay: 'transparent',
      input: '#F2F4F8', // very light, clean inputs
    },
    text: {
      primary: '#2E3440', // nord0 — max contrast (~10:1 on nord4)
      secondary: '#434C5E', // nord2 — strong secondary (~5.5:1)
      tertiary: '#4C566A', // nord3 — labels (~4.2:1)
      icon: '#434C5E', // nord2
      muted: '#4C566A', // nord3
      actionButton: '#ECEFF4', // nord6 — light text on dark buttons
    },
    success: '#7A9A65', // darkened nord14
    error: '#A5404A', // darkened nord11
    warning: '#C4A24E', // darkened nord13
    accent: {
      primary: '#5E81AC', // nord9
      secondary: '#4C6A91', // darkened nord10
      brand: '#4C6A91', // darkened nord10
      info: '#6BA1A0', // darkened nord7
    },
    surface: {
      hover: '#CDD4E0', // clear hover on nord4
      active: '#B8C2D2', // distinct active
      border: '#B0BACC', // visible card edges
      borderSubtle: '#C3CBDA', // subtle but visible
      muted: '#9FAABB',
      subtle: '#C3CBDA',
      headerButton: '#D8DEE9', // nord4
    },
    button: {
      primary: {
        bg: '#4C6A91', // darkened nord10
        bgHover: '#5E81AC', // nord9
        bgActive: '#3D5778', // deeper press
        text: '#ECEFF4', // nord6
        boxShadow:
          '0px 1px 2px 0px rgba(46, 52, 64, 0.2), 0px 0px 10px 2px rgba(76, 106, 145, 0.25), 0px 4px 16px 0px rgba(255, 255, 255, 0.3) inset',
        boxShadowActive:
          '0px 1px 2px 0px rgba(46, 52, 64, 0.2), 0px 0px 10px 2px rgba(76, 106, 145, 0.25), 0px -4px 12px 0px rgba(61, 87, 120, 0.4) inset',
        border: '1px solid rgba(46, 52, 64, 0.12)',
      },
      secondary: {
        bg: '#CDD4E0',
        bgHover: '#B8C2D2',
        bgActive: '#B0BACC',
        text: '#2E3440', // nord0
        boxShadow:
          '0px 1px 2px 0px rgba(46, 52, 64, 0.12), 0px 0px 10px 2px rgba(176, 186, 204, 0.3)',
        boxShadowActive:
          '0px 1px 2px 0px rgba(46, 52, 64, 0.12), 0px -4px 8px 0px rgba(159, 170, 187, 0.3) inset',
        border: '1px solid rgba(46, 52, 64, 0.1)',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#E5E9F0',
      surfaceCard: 'linear-gradient(180deg, #E5E9F0 0%, #D8DEE9 100%)',
      modalOverlayTint: 'rgba(46, 52, 64, 0.1)',
      skeleton:
        'linear-gradient(90deg, rgba(195, 203, 218, 0.4) 0%, rgba(176, 186, 204, 0.6) 50%, rgba(195, 203, 218, 0.4) 100%)',
      noCryptoBanner: '#D8DEE9',
      headerFade: 'linear-gradient(180deg, #E5E9F0 0%, rgba(229, 233, 240, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(236, 239, 244, 0) 0%, #ECEFF4 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #CDD4E0 0%, rgba(205, 212, 224, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #2E3440 0%, #5E81AC 100%)',
      sectionCasino: 'linear-gradient(95deg, #4C6A91 0%, #5E81AC 100%)',
      sectionSport: 'linear-gradient(95deg, #B5684E 0%, #D08770 100%)',
      sectionBonus: 'linear-gradient(95deg, #7A9A65 0%, #A3BE8C 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #96698D 0.37%, #B48EAD 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #CDD4E0 0.37%, #D8DEE9 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #5E81AC 0%, rgba(94, 129, 172, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #D08770 22.32%, #BF616A 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(76, 106, 145, 0.15) 0%, rgba(76, 106, 145, 0.04) 100%)',
    },
    shadow: {
      header: '0px 2px 4px 0px rgba(46, 52, 64, 0.1)',
      sidebar: '2px 0px 4px 0px rgba(46, 52, 64, 0.1)',
    },
    icon: {
      contrast: '#2E3440', // nord0
      warning: '#D08770', // nord12
      warningBanner: '#A5404A', // darkened nord11
      disabled: 'rgba(76, 86, 106, 0.3)',
      dimmed: 'rgba(67, 76, 94, 0.5)',
      brand: '#4C6A91', // darkened nord10
      subtle: '#4C566A', // nord3
    },
  },
}
