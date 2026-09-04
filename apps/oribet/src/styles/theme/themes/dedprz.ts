import type { AppTheme } from '../theme'
import { defaultActionColors } from './actionColors'

export const dedprzTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#1D1D1D',
      secondary: '#212121',
      tertiary: '#1D1D1D',
      sidebar: '#111111',
      header: '#111111',
      footer: '#111111',
      banner: '#1D1D1D',
      overlay: 'transparent',
      input: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#FFFFFF80',
      tertiary: '#999999',
      icon: '#999999',
      muted: '#FFFFFF80',
      actionButton: '#ffffff',
    },
    success: '#FFBA0C',
    error: '#CA1515',
    warning: '#ECC53A',
    accent: {
      primary: '#ECC53A',
      secondary: '#BD8709',
      brand: '#FFBA0C',
      info: '#3B82F6',
    },
    surface: {
      hover: '#2A2A2A',
      active: '#3A3A3A',
      border: '#3A3A3A',
      borderSubtle: 'rgba(255, 255, 255, 0.05)',
      muted: '#FFFFFF40',
      subtle: '#FFFFFF40',
      headerButton: '#111111',
    },
    button: {
      primary: {
        bg: '#FFBA0C',
        bgHover: '#FFBA0C',
        bgActive: '#FFBA0C',
        text: '#111111',
        boxShadow:
          '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #FFC10F40, 0px 4px 16px 0px #FFFFFF33 inset',
        boxShadowActive:
          '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #FFC10F40, 0px 4px 16px 0px #FFFFFF33 inset',
        border: '1px solid #FFFFFF40',
      },
      secondary: {
        bg: '#272727',
        bgHover: '#272727',
        bgActive: '#272727',
        text: '#fff',
        boxShadow: '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #1D1D1D',
        boxShadowActive: '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #1D1D1D',
        border: '1px solid #FFFFFF40',
      },
      action: defaultActionColors,
    },
    gradient: {
      navRow: '#111111',
      surfaceCard: 'linear-gradient(180deg, #342e24 0%, #2a261f 100%)',
      modalOverlayTint: 'rgba(53, 47, 37, 0.2)',
      skeleton:
        'linear-gradient(90deg, rgba(60, 53, 41, 0.4) 0%, rgba(70, 63, 50, 0.6) 50%, rgba(60, 53, 41, 0.4) 100%)',
      noCryptoBanner: '#1D1D1D',
      headerFade: 'linear-gradient(180deg, #1D1D1D 0%, rgba(29, 29, 29, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(29, 29, 29, 0) 0%, #1D1D1D 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #1D1D1D 0%, rgba(29, 29, 29, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #FFF 0%, #FFD580 100%)',
      sectionCasino: 'linear-gradient(95deg, #2e65de 0%, #2563eb 100%)',
      sectionSport: 'linear-gradient(95deg, #AA8515 0%, #655628 100%)',
      sectionBonus: 'linear-gradient(95deg, #15803d 0%, #166534 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #392355 0.37%, #270355 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #2e271b 0.37%, #1D1D1D 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #371d1b 0%, rgba(157, 86, 77, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #fe9149 22.32%, #fd5737 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(117, 133, 157, 0.2) 0%, rgba(117, 133, 157, 0.04) 100%)',
    },
    shadow: {
      header: '0px 3px 4px 0px rgba(0, 0, 0, 0.5)',
      sidebar: '2px 0px 4px 0px rgba(0, 0, 0, 0.5)',
    },
    icon: {
      contrast: '#ffffff',
      warning: '#FFBA0C',
      warningBanner: '#4D2217',
      disabled: '#FFFFFF40',
      dimmed: 'rgba(255, 255, 255, 0.5)',
      brand: '#FFBA0C',
      subtle: '#666666',
    },
  },
}
