import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEFAULT_GAME_CARD_ASPECT_RATIO, type GameCardAspectRatio } from './aspectRatio'

export interface GameSwiperSlidesPerView {
  mobile: number
  desktop: number
}

export interface GameCardGridColumns {
  mobile: number
  desktop: number
}

export const DEFAULT_GAME_SWIPER_SLIDES_PER_VIEW: GameSwiperSlidesPerView = {
  mobile: 4,
  desktop: 8,
}

export const DEFAULT_GAME_CARD_GRID_COLUMNS: GameCardGridColumns = {
  mobile: 3,
  desktop: 6,
}

/**
 * Controls how the game name overlay title fits inside the card image.
 *
 * All geometry is expressed **relative to the card** (container-query units) so a
 * single config renders proportionally identical on every card size and aspect
 * ratio — grid cells, swiper slides, mobile and desktop all match. Absolute px is
 * used only as legibility floor / cap bounds.
 */
export interface GameCardOverlayTextConfig {
  /** Title size as a % of the card width (cqw). Scales with the card. */
  titleSizeCqw: number
  /** Lower px bound so the title stays legible on very small cards. */
  minFontPx: number
  /** Upper px bound so the title never gets oversized on very large cards. */
  maxFontPx: number
  /** Font weight (100–900) of the title. */
  fontWeight: number
  /** When true, ellipsis-truncate at `maxLines` (single line when word wrap is off). */
  truncate: boolean
  /** When true, the title may wrap onto multiple lines (up to `maxLines`). */
  wordWrap: boolean
  /** Max wrapped lines before truncating. */
  maxLines: number
  /** Lifts only the title (not the provider or scrim) up by this % of card height
   * (cqh). 0 = default bottom position; higher moves it up, consistently across
   * every card size and aspect ratio. */
  verticalOffset: number
}

export const DEFAULT_GAME_CARD_OVERLAY_TEXT: GameCardOverlayTextConfig = {
  titleSizeCqw: 11,
  minFontPx: 8,
  maxFontPx: 48,
  fontWeight: 700,
  truncate: true,
  wordWrap: true,
  maxLines: 3,
  verticalOffset: 1,
}

const STORAGE_KEYS = {
  aspectRatio: 'oribet-game-card-aspect-ratio',
  swiperSlidesPerView: 'oribet-game-swiper-slides-per-view',
  gridColumns: 'oribet-game-card-grid-columns',
  // v2: schema switched from absolute px to container-relative units. Old px-based
  // values are intentionally abandoned (the validator would reject them anyway).
  overlayText: 'oribet-game-card-overlay-text-v2',
}

const isBrowser = typeof window !== 'undefined'

const loadValue = <T,>(key: string, fallback: T, validate: (parsed: unknown) => parsed is T): T => {
  if (!isBrowser) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return validate(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const saveValue = (key: string, value: unknown) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

const isAspectRatio = (v: unknown): v is GameCardAspectRatio =>
  v === '3:4' || v === '1:1' || v === '4:3'

const isPlatformPair = (v: unknown): v is { mobile: number; desktop: number } =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as { mobile?: unknown }).mobile === 'number' &&
  typeof (v as { desktop?: unknown }).desktop === 'number'

const isOverlayTextConfig = (v: unknown): v is GameCardOverlayTextConfig =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as GameCardOverlayTextConfig).titleSizeCqw === 'number' &&
  typeof (v as GameCardOverlayTextConfig).minFontPx === 'number' &&
  typeof (v as GameCardOverlayTextConfig).maxFontPx === 'number' &&
  typeof (v as GameCardOverlayTextConfig).fontWeight === 'number' &&
  typeof (v as GameCardOverlayTextConfig).truncate === 'boolean' &&
  typeof (v as GameCardOverlayTextConfig).wordWrap === 'boolean' &&
  typeof (v as GameCardOverlayTextConfig).maxLines === 'number' &&
  typeof (v as GameCardOverlayTextConfig).verticalOffset === 'number'

interface GameCardConfigValue {
  aspectRatio: GameCardAspectRatio
  swiperSlidesPerView: GameSwiperSlidesPerView
  gridColumns: GameCardGridColumns
  /** When true, the hover overlay shows only the play button (no name/provider). */
  overlayPlayOnly: boolean
  /** When true, every game card renders its title + provider below the tile. */
  labelBelow: boolean
  /** When true, the game name + provider are drawn as a persistent centered overlay on the
   * card image (name auto-shrinks to fit). Off by default; opt in per project. */
  showGameNameOverlay: boolean
  /** Fit behaviour (wrap / shrink / truncate) of the game name overlay title. */
  overlayText: GameCardOverlayTextConfig
  setAspectRatio: (v: GameCardAspectRatio) => void
  setSwiperSlidesPerView: (platform: 'mobile' | 'desktop', value: number) => void
  setGridColumns: (platform: 'mobile' | 'desktop', value: number) => void
  setOverlayText: (patch: Partial<GameCardOverlayTextConfig>) => void
}

const noop = () => {}

const GameCardConfigContext = createContext<GameCardConfigValue>({
  aspectRatio: DEFAULT_GAME_CARD_ASPECT_RATIO,
  swiperSlidesPerView: DEFAULT_GAME_SWIPER_SLIDES_PER_VIEW,
  gridColumns: DEFAULT_GAME_CARD_GRID_COLUMNS,
  // Default game-card visual across all projects: a persistent game-name overlay on the
  // tile, no label underneath, hover shows only the play button. Projects opt into the
  // label-below layout with `labelBelow`.
  overlayPlayOnly: true,
  labelBelow: false,
  showGameNameOverlay: true,
  overlayText: DEFAULT_GAME_CARD_OVERLAY_TEXT,
  setAspectRatio: noop,
  setSwiperSlidesPerView: noop,
  setGridColumns: noop,
  setOverlayText: noop,
})

interface GameCardConfigProviderProps {
  children: ReactNode
  aspectRatio?: GameCardAspectRatio
  swiperSlidesPerViewMobile?: number
  swiperSlidesPerViewDesktop?: number
  gridColumnsMobile?: number
  gridColumnsDesktop?: number
  overlayPlayOnly?: boolean
  labelBelow?: boolean
  showGameNameOverlay?: boolean
  overlayText?: Partial<GameCardOverlayTextConfig>
}

export const GameCardConfigProvider = ({
  children,
  aspectRatio: initialAspectRatio = DEFAULT_GAME_CARD_ASPECT_RATIO,
  swiperSlidesPerViewMobile = DEFAULT_GAME_SWIPER_SLIDES_PER_VIEW.mobile,
  swiperSlidesPerViewDesktop = DEFAULT_GAME_SWIPER_SLIDES_PER_VIEW.desktop,
  gridColumnsMobile = DEFAULT_GAME_CARD_GRID_COLUMNS.mobile,
  gridColumnsDesktop = DEFAULT_GAME_CARD_GRID_COLUMNS.desktop,
  overlayPlayOnly = true,
  labelBelow = false,
  showGameNameOverlay = true,
  overlayText: initialOverlayText,
}: GameCardConfigProviderProps) => {
  const [aspectRatio, setAspectRatioState] = useState<GameCardAspectRatio>(() =>
    loadValue(STORAGE_KEYS.aspectRatio, initialAspectRatio, isAspectRatio)
  )
  const [swiperSlidesPerView, setSwiperSlidesPerViewState] = useState<GameSwiperSlidesPerView>(() =>
    loadValue(
      STORAGE_KEYS.swiperSlidesPerView,
      { mobile: swiperSlidesPerViewMobile, desktop: swiperSlidesPerViewDesktop },
      isPlatformPair
    )
  )
  const [gridColumns, setGridColumnsState] = useState<GameCardGridColumns>(() =>
    loadValue(
      STORAGE_KEYS.gridColumns,
      { mobile: gridColumnsMobile, desktop: gridColumnsDesktop },
      isPlatformPair
    )
  )
  const [overlayText, setOverlayTextState] = useState<GameCardOverlayTextConfig>(() =>
    loadValue(
      STORAGE_KEYS.overlayText,
      { ...DEFAULT_GAME_CARD_OVERLAY_TEXT, ...initialOverlayText },
      isOverlayTextConfig
    )
  )

  const setAspectRatio = useCallback((v: GameCardAspectRatio) => {
    saveValue(STORAGE_KEYS.aspectRatio, v)
    setAspectRatioState(v)
  }, [])

  const setSwiperSlidesPerView = useCallback((platform: 'mobile' | 'desktop', value: number) => {
    setSwiperSlidesPerViewState(prev => {
      const next = { ...prev, [platform]: value }
      saveValue(STORAGE_KEYS.swiperSlidesPerView, next)
      return next
    })
  }, [])

  const setGridColumns = useCallback((platform: 'mobile' | 'desktop', value: number) => {
    setGridColumnsState(prev => {
      const next = { ...prev, [platform]: value }
      saveValue(STORAGE_KEYS.gridColumns, next)
      return next
    })
  }, [])

  const setOverlayText = useCallback((patch: Partial<GameCardOverlayTextConfig>) => {
    setOverlayTextState(prev => {
      const next = { ...prev, ...patch }
      saveValue(STORAGE_KEYS.overlayText, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      aspectRatio,
      swiperSlidesPerView,
      gridColumns,
      overlayPlayOnly,
      labelBelow,
      showGameNameOverlay,
      overlayText,
      setAspectRatio,
      setSwiperSlidesPerView,
      setGridColumns,
      setOverlayText,
    }),
    [
      aspectRatio,
      swiperSlidesPerView,
      gridColumns,
      overlayPlayOnly,
      labelBelow,
      showGameNameOverlay,
      overlayText,
      setAspectRatio,
      setSwiperSlidesPerView,
      setGridColumns,
      setOverlayText,
    ]
  )
  return <GameCardConfigContext.Provider value={value}>{children}</GameCardConfigContext.Provider>
}

export const useGameCardConfig = (): GameCardConfigValue => useContext(GameCardConfigContext)

export const useGameCardAspectRatio = (): GameCardAspectRatio =>
  useContext(GameCardConfigContext).aspectRatio

export const useGameSwiperSlidesPerView = (): GameSwiperSlidesPerView =>
  useContext(GameCardConfigContext).swiperSlidesPerView

export const useGameCardGridColumns = (): GameCardGridColumns =>
  useContext(GameCardConfigContext).gridColumns
