/** Per-color palette for the shared ActionButton (claim/wager/spin/etc.). */
export interface ActionButtonColors {
  inactive: string
  active: string
  hover: string
  pressed: string
  text: string
  shadowInactive: string
  shadowActive: string
}

export interface AppTheme {
  colors: {
    bg: {
      primary: string
      secondary: string
      tertiary: string
      sidebar: string
      header: string
      footer: string
      banner: string
      overlay: string
      input: string
    }
    text: {
      primary: string
      secondary: string
      tertiary: string
      icon: string
      muted: string
      actionButton: string
    }
    success: string
    error: string
    warning: string
    accent: {
      primary: string
      secondary: string
      brand: string
      info: string
    }
    surface: {
      hover: string
      active: string
      border: string
      borderSubtle: string
      muted: string
      subtle: string
      headerButton: string
      /** Card surface background (brand cards). Falls back to bg.secondary. */
      card?: string
    }
    button: {
      primary: {
        bg: string
        bgHover: string
        bgActive: string
        text: string
        boxShadow: string
        boxShadowActive: string
        border: string
      }
      secondary: {
        bg: string
        bgHover: string
        bgActive: string
        text: string
        boxShadow: string
        boxShadowActive: string
        border: string
      }
      action: {
        blue: ActionButtonColors
        green: ActionButtonColors
        orange: ActionButtonColors
        pink: ActionButtonColors
        purple: ActionButtonColors
      }
    }
    gradient: {
      navRow: string
      surfaceCard: string
      modalOverlayTint: string
      skeleton: string
      noCryptoBanner: string
      headerFade: string
      bonusContainerOverlay: string
      promotionHeroOverlay: string
      promotionTitle: string
      sectionCasino: string
      sectionSport: string
      sectionBonus: string
      bonusWheelBanner: string
      leaderBoardBanner: string
      bonusModalHeader: string
      bonusCardOuter: string
      promoCode: string
      /** Gradient painted as a 1px masked card border. Falls back to surface.border. */
      cardBorder?: string
    }
    shadow: {
      header: string
      sidebar: string
    }
    icon: {
      contrast: string
      warning: string
      warningBanner: string
      disabled: string
      dimmed: string
      brand: string
      subtle: string
    }
  }
}
