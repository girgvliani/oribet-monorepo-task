import type { AppTheme } from '../theme'

/**
 * Default ActionButton palette (claim/wager/spin CTAs). Shared by the non-Korea
 * theme-switcher themes so each satisfies the AppTheme contract without duplicating
 * the per-tone hexes. Korea overrides this with its own gold map.
 */
export const defaultActionColors: AppTheme['colors']['button']['action'] = {
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
}
