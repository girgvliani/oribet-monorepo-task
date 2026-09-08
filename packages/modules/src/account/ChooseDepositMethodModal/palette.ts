/**
 * Fixed dark/gold palette for this modal's redesign. Deliberately NOT part of the shared
 * AppTheme (nord/dracula/gruvbox/oribet/...) — scoping it here keeps every other theme file
 * and the rest of the site's design untouched, while still moving these values out of
 * scattered raw hex in component files into one named, reusable source.
 */
export const WALLET_PALETTE = {
  bgRail: '#050a12',
  bgPane: '#0b1119',
  bgElevated: '#0c141f',
  textPrimary: '#ffffff',
  textSecondary: '#8b93a0',
  border: '#ffffff14',
  borderRail: '#ffffff12',
  gold: '#ffd230',
  /** Text color rendered on top of a gold surface. */
  onGold: '#0a0a08',
  goldGradient: 'linear-gradient(180deg, #ffdd55 0%, #f1b021 100%)',
  goldGradientShadow: '#f1b021',
  cardAccent: '#1D4ED8',
  cryptoAccent: '#26a17b',
  buyCryptoAccent: '#8b5cf6',
} as const
