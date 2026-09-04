import type { AppTheme } from '@oribet/ui'

export const defaultTheme: AppTheme = {
  colors: {
    bg: {
      primary: '#0d121d',
      secondary: '#111827',
      tertiary: '#030712',
      sidebar: '#030712',
      header: '#0d121d',
      footer: '#0d121d',
      banner: '#030712',
      overlay: '#0d121d',
      input: '#101827',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9CA3AF',
      tertiary: '#8290a0',
      icon: '#8290a0',
      muted: '#9CA3AF',
      actionButton: '#ffffff',
    },
    success: '#84CC16',
    error: '#CA1515',
    warning: '#ECC53A',
    accent: {
      primary: '#ECC53A',
      secondary: '#BD8709',
      brand: '#1D4ED8',
      info: '#3B82F6',
    },
    surface: {
      hover: '#1f2937',
      active: '#374151',
      border: '#374151',
      borderSubtle: '#1f2937',
      muted: '#4B5563',
      subtle: '#374151',
      headerButton: '#1f2937',
      card: '#111827',
    },
    button: {
      primary: {
        bg: '#1e40af',
        bgHover: '#1d4ed8',
        bgActive: '#1e3a8a',
        text: '#fff',
        boxShadow:
          '0px 2px 0px 0px #172554, 0px 8px 12px 0px #3b82f6 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.25) inset',
        boxShadowActive:
          '0px 2px 0px 0px #172554, 0px -8px 12px 0px #1d4ed8 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.25) inset',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      secondary: {
        bg: '#0d121d',
        bgHover: '#111827',
        bgActive: '#030712',
        text: '#fff',
        boxShadow:
          '0px 2px 0px 0px #030712, 0px 8px 12px 0px #1f2937 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.25) inset',
        boxShadowActive:
          '0px 2px 0px 0px #030712, 0px -8px 12px 0px #1f2937 inset, 0px 1px 4px 0px rgba(255, 255, 255, 0.25) inset',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      action: {
        blue: {
          inactive: '#1F2937',
          active: '#1F2937',
          hover: '#374151',
          pressed: '#111827',
          text: '#FFFFFF',
          shadowInactive: '0px 1px 2px 0px #00000040, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
          shadowActive:
            '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #353E4B4D, 0px 4px 16px 0px #FFFFFF33 inset, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)',
        },
        green: {
          inactive: '#1F2937',
          active: '#4D7C0F',
          hover: '#65A30D',
          pressed: '#3F6212',
          text: '#FFFFFF',
          shadowInactive: '0px 1px 2px 0px #00000040, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
          shadowActive:
            '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #4D7C0F80, 0px 4px 16px 0px #FFFFFF33 inset, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)',
        },
        orange: {
          inactive: '#1F2937',
          active: '#FE5E37',
          hover: '#FE6835',
          pressed: '#952711',
          text: '#FFFFFF',
          shadowInactive: '0px 1px 2px 0px #00000040, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
          shadowActive:
            '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #D83C1D80, 0px 4px 16px 0px #FFFFFF33 inset, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)',
        },
        pink: {
          inactive: '#1F2937',
          active: '#D269B5',
          hover: '#DC73BF',
          pressed: '#AA418D',
          text: '#FFFFFF',
          shadowInactive: '0px 1px 2px 0px #00000040, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
          shadowActive:
            '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #D269B580, 0px 4px 16px 0px #FFFFFF33 inset, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)',
        },
        purple: {
          inactive: '#1F2937',
          active: '#5F56B9',
          hover: '#6960C3',
          pressed: '#4B42A5',
          text: '#FFFFFF',
          shadowInactive: '0px 1px 2px 0px #00000040, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
          shadowActive:
            '0px 1px 2px 0px #00000040, 0px 0px 10px 2px #5F56B980, 0px 4px 16px 0px #FFFFFF33 inset, inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)',
        },
      },
    },
    gradient: {
      navRow: '#0d121d',
      surfaceCard: 'linear-gradient(180deg, #263246 0%, #1e2a3d 100%)',
      modalOverlayTint: 'rgba(38, 47, 66, 0.2)',
      skeleton:
        'linear-gradient(90deg, rgba(43, 54, 80, 0.4) 0%, rgba(55, 65, 81, 0.6) 50%, rgba(43, 54, 80, 0.4) 100%)',
      noCryptoBanner: 'linear-gradient(101.41deg, #152139 2.9%, #111827 44.84%)',
      headerFade: 'linear-gradient(180deg, #030712 0%, rgba(3, 7, 18, 0) 100%)',
      bonusContainerOverlay: 'linear-gradient(180deg, rgba(17, 24, 39, 0) 0%, #121928 100%)',
      promotionHeroOverlay: 'linear-gradient(180deg, #030712 0%, rgba(3, 7, 18, 0) 100%)',
      promotionTitle: 'linear-gradient(180deg, #FFF 0%, #B3C7FD 100%)',
      sectionCasino: 'linear-gradient(95deg, #2e65de 0%, #2563eb 100%)',
      sectionSport: 'linear-gradient(95deg, #AA8515 0%, #655628 100%)',
      sectionBonus: 'linear-gradient(95deg, #15803d 0%, #166534 100%)',
      bonusWheelBanner: 'linear-gradient(92deg, #392355 0.37%, #270355 98.56%)',
      leaderBoardBanner: 'linear-gradient(92.35deg, #2e271b 0.37%, #111827 98.56%)',
      bonusModalHeader: 'linear-gradient(180deg, #371d1b 0%, rgba(157, 86, 77, 0) 100%)',
      bonusCardOuter: 'linear-gradient(113.08deg, #fe9149 22.32%, #fd5737 75.35%)',
      promoCode:
        'linear-gradient(180deg, rgba(117, 133, 157, 0.2) 0%, rgba(117, 133, 157, 0.04) 100%)',
      cardBorder: 'linear-gradient(180deg, #1f2937 0%, #1f2937 100%)',
    },
    shadow: {
      header: '0px 3px 4px 0px rgba(0, 0, 0, 0.5)',
      sidebar: '2px 0px 4px 0px rgba(3, 7, 18, 0.5)',
    },
    icon: {
      contrast: '#ffffff',
      warning: '#3B4CC7',
      warningBanner: '#4D2217',
      disabled: '#FFFFFF40',
      dimmed: 'rgba(255, 255, 255, 0.5)',
      brand: '#1D4ED8',
      subtle: '#4B5563',
    },
  },
}
