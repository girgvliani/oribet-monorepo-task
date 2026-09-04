import { fontSize, media } from '@oribet/ui'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { IconDoubleChevronWithShadow } from '@oribet/assets/icons/IconDoubleChevronWithShadow'
import { IconFavorite } from '@oribet/assets/icons/IconFavorite'
import PlayButton from './PlayButton'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsUserAuthorized } from '@oribet/core/redux/selectors'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { GAME_CARD_ASPECT_RATIOS, type GameCardAspectRatio } from './aspectRatio'
import { useGameCardConfig } from './GameCardConfig'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

interface IGameCard {
  gameName: string
  gameProvider: string
  backgroundImageUrl: string
  isFavorite?: boolean
  isAvailable: boolean
  comingSoon: boolean
  /** Favorite handlers are optional — omit both to render a card with no favorite action
   *  (e.g. result/search grids). The heart only shows when `addToFavorites` is provided. */
  addToFavorites?: () => void
  removeFromFavorite?: () => void
  startPlaying: () => void
  isMobile: boolean
  agregator_image?: string
  gameCardStyle?: any
  hideActions?: boolean
  gameId: string
  categorySlug?: string
  index?: number
  comesFromBonusMode?: boolean
  aspectRatio?: GameCardAspectRatio
  /** Skip the opacity/transform transitions on hover (instant show, no card lift). */
  hideAnimation?: boolean
  /** Hide the provider line inside the hover popup. */
  hideProviderOnHover?: boolean
  /** Explicit override for the config-driven title/provider label below the tile.
   *  Omit to follow `GameCardConfig.labelBelow`. */
  showLabel?: boolean
}

/** Never shrink the measured fit below this (as % of card width) before truncating. */
const TITLE_MIN_CQW = 2

/**
 * Finds the largest title size (in cqw — % of card width) at which the text still
 * fits within `maxLines` (or one line when word wrap is off). Returns `sizeCqw`
 * unchanged when it already fits. Because the size is expressed in cqw, the result
 * is resolution-independent: the same value fits at every card pixel size.
 */
const fitTitleCqw = (
  el: HTMLElement,
  sizeCqw: number,
  wordWrap: boolean,
  maxLines: number
): number => {
  const s = el.style
  // Inline overrides beat the styled class so we can measure the raw, un-clamped text.
  s.setProperty('display', 'block')
  s.setProperty('overflow', 'visible')
  s.setProperty('-webkit-line-clamp', 'unset')
  s.setProperty('white-space', wordWrap ? 'normal' : 'nowrap')

  // A single word should first shrink to stay on ONE line (avoids an ugly mid-word
  // break like "CROCODIN / O"). If one line isn't reachable, the min-size clamp at
  // render lets it wrap like any long title.
  const isSingleWord = !!el.textContent && !/\s/.test(el.textContent.trim())
  const targetLines = wordWrap && isSingleWord ? 1 : maxLines

  const fits = (cqw: number) => {
    s.fontSize = `${cqw}cqw`
    if (!wordWrap) return el.scrollWidth <= el.clientWidth + 0.5
    const cs = getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15
    return Math.round(el.scrollHeight / lh) <= targetLines
  }

  let chosen = sizeCqw
  if (!fits(sizeCqw)) {
    let c = sizeCqw
    let guard = 0
    while (c > TITLE_MIN_CQW && guard < 120) {
      c = Math.max(TITLE_MIN_CQW, c - 0.5)
      guard++
      if (fits(c)) break
    }
    chosen = c
  }

  // Clear the inline overrides so the styled rules (final font-size / clamp / offset) resume.
  s.removeProperty('font-size')
  s.removeProperty('display')
  s.removeProperty('overflow')
  s.removeProperty('-webkit-line-clamp')
  s.removeProperty('white-space')
  return chosen
}

interface OverlayTitleProps {
  text: string
  sizeCqw: number
  minPx: number
  maxPx: number
  weight: number
  offset: number
  wordWrap: boolean
  maxLines: number
  truncate: boolean
}

/**
 * Overlay game title. Renders at `sizeCqw` (proportional to the card) and, if the
 * text would overflow `maxLines`, shrinks the font toward `minPx` to avoid
 * truncating — only truncating (ellipsis) if it still doesn't fit at `minPx`.
 *
 * The fit is measured in cqw, which is resolution-independent, so it holds at every
 * card size: we measure once per text/config change and let CSS `clamp()` rescale
 * responsively (no work on resize). The ResizeObserver only covers a zero-width
 * mount (hidden tab / lazy swiper); it disconnects after the first real measure.
 */
const OverlayTitle = ({
  text,
  sizeCqw,
  minPx,
  maxPx,
  weight,
  offset,
  wordWrap,
  maxLines,
  truncate,
}: OverlayTitleProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [fitCqw, setFitCqw] = useState(sizeCqw)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let ro: ResizeObserver | null = null

    const measure = () => {
      if (cancelled || !el.clientWidth) return
      const chosen = fitTitleCqw(el, sizeCqw, wordWrap, maxLines)
      setFitCqw(prev => (Math.abs(prev - chosen) < 0.05 ? prev : chosen))
      ro?.disconnect() // fit is size-invariant → one good measurement is enough
      ro = null
    }

    measure()
    if (!cancelled && el.clientWidth === 0 && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure)
      ro.observe(el)
    }
    // Fonts can swap in after first paint and shift line breaks — re-measure once.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => measure())
    }

    return () => {
      cancelled = true
      ro?.disconnect()
    }
  }, [text, sizeCqw, maxLines, wordWrap, weight])

  return (
    <NameOverlayTitle
      ref={ref}
      $fitCqw={fitCqw}
      $minPx={minPx}
      $maxPx={maxPx}
      $weight={weight}
      $offset={offset}
      $wordWrap={wordWrap}
      $truncate={truncate}
      $maxLines={maxLines}
    >
      {text}
    </NameOverlayTitle>
  )
}

const GameCard = ({
  gameName,
  gameProvider,
  backgroundImageUrl,
  isFavorite,
  isAvailable,
  comingSoon,
  addToFavorites,
  startPlaying,
  isMobile,
  agregator_image,
  removeFromFavorite,
  gameCardStyle,
  hideActions = false,
  gameId,
  comesFromBonusMode = false,
  aspectRatio,
  hideAnimation = false,
  hideProviderOnHover = false,
  showLabel,
}: IGameCard) => {
  const isUserAuthorized = useAppSelector(selectIsUserAuthorized)
  const { t } = useTranslation()
  const [isFav, setIsFav] = useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null)
  const {
    aspectRatio: configAspectRatio,
    overlayPlayOnly,
    labelBelow,
    showGameNameOverlay,
    overlayText,
  } = useGameCardConfig()
  const resolvedAspectRatio = aspectRatio ?? configAspectRatio
  // Brand config (e.g. Korea) can render the name/provider below the tile and reduce
  // the hover overlay to just the play button. `showLabel` prop overrides the config.
  const renderLabel = (showLabel ?? labelBelow) && !comesFromBonusMode
  const overlayDescriptions = !(overlayPlayOnly && isAvailable)

  useEffect(() => {
    setIsFav(!!isFavorite)
  }, [isFavorite])

  const background = useMemo(
    () => ({
      backgroundImage:
        backgroundImageUrl && imageLoaded
          ? `url(${resolveImageUrl(backgroundImageUrl)})`
              .replace(' ', '%20')
              .replace(/`/g, '')
              .replace(/ /g, '%20')
              .replace(/'/g, '%27')
          : imageLoaded === false || !backgroundImageUrl
            ? 'url(/imgs/common/default-image.png)'
            : `${agregator_image}`,
    }),
    [backgroundImageUrl, imageLoaded, agregator_image]
  )

  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new Image()
      img.src = resolveImageUrl(backgroundImageUrl)

      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
    }
  }, [backgroundImageUrl])

  const addToFavoritesHandler = useCallback(() => {
    if (!comesFromBonusMode) {
      addToFavorites?.()
      setIsFav(prev => !prev)
    }
  }, [comesFromBonusMode, addToFavorites])

  const removeFromFavoritesHandler = useCallback(() => {
    removeFromFavorite?.()
    setIsFav(prev => !prev)
  }, [removeFromFavorite])

  const cardTile = (
    <CardWrapper
      style={{ ...background, ...gameCardStyle }}
      $isMobile={isMobile}
      $comesFromBonusMode={comesFromBonusMode}
      $aspectRatio={resolvedAspectRatio}
      $hideAnimation={hideAnimation}
      role="button"
      tabIndex={0}
      aria-label={gameName}
      data-testid={`${DISCOVERY_TEST_IDS.gameCard.root}.${gameId}`}
      onClick={isMobile ? startPlaying : undefined}
      onKeyDown={
        isMobile
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                startPlaying()
              }
            }
          : undefined
      }
    >
      {showGameNameOverlay && !comesFromBonusMode && (
        <NameOverlay>
          <OverlayTitle
            text={gameName}
            sizeCqw={overlayText.titleSizeCqw}
            minPx={overlayText.minFontPx}
            maxPx={overlayText.maxFontPx}
            weight={overlayText.fontWeight}
            offset={overlayText.verticalOffset}
            wordWrap={overlayText.wordWrap}
            maxLines={overlayText.maxLines}
            truncate={overlayText.truncate}
          />
          {gameProvider && <NameOverlayProvider>{gameProvider}</NameOverlayProvider>}
        </NameOverlay>
      )}
      {!isMobile && (
        /* idmap-ignore: desktop hover overlay; play handled by play button + card root */
        <InfoOverlay
          $isAvailable={isAvailable}
          $hideAnimation={hideAnimation}
          onClick={startPlaying}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              startPlaying()
            }
          }}
        >
          {isUserAuthorized && !hideActions && !comesFromBonusMode && addToFavorites && (
            <FavoriteIconContainer
              role="button"
              tabIndex={0}
              data-testid={`${DISCOVERY_TEST_IDS.gameCard.favorite}.${gameId}`}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              onClick={e => {
                e.stopPropagation()
                if (isFav) {
                  removeFromFavoritesHandler()
                } else {
                  addToFavoritesHandler()
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isFav) removeFromFavoritesHandler()
                  else addToFavoritesHandler()
                }
              }}
            >
              <IconFavorite className={isFav ? 'is-favorite' : 'dark'} />
            </FavoriteIconContainer>
          )}
          {!isUserAuthorized && <FavoriteIconContainer />}

          {!hideActions && isAvailable && (
            <PlayButtonWrapper>
              <PlayButton
                onClick={startPlaying}
                testId={`${DISCOVERY_TEST_IDS.gameCard.play}.${gameId}`}
              />
            </PlayButtonWrapper>
          )}

          {/* When the persistent name overlay is on, don't repeat the title/provider
              on hover — only keep the unavailable/coming-soon messaging. */}
          {!hideActions && overlayDescriptions && !(isAvailable && showGameNameOverlay) && (
            <GameDescriptions $comesFromBonusMode={comesFromBonusMode}>
              {isAvailable ? (
                <>
                  <GameName>{gameName}</GameName>
                  {!comesFromBonusMode && !hideProviderOnHover && (
                    <GameProvider>{gameProvider}</GameProvider>
                  )}
                </>
              ) : (
                <>
                  <CenteredText>
                    {comingSoon ? t('games.comingSoon') : t('games.notAvailable')}
                  </CenteredText>
                  <CenteredText>
                    {comingSoon
                      ? t('games.comingSoonDescription')
                      : t('games.notAvailableDescription')}
                  </CenteredText>
                </>
              )}
            </GameDescriptions>
          )}
        </InfoOverlay>
      )}
      {comesFromBonusMode && <BonusModeMask isMobile={isMobile} />}
    </CardWrapper>
  )

  if (!renderLabel) return cardTile

  return (
    <LabeledLayout>
      {cardTile}
      <CardLabel>
        <CardLabelName title={gameName}>{gameName}</CardLabelName>
        <CardLabelProvider title={gameProvider}>{gameProvider}</CardLabelProvider>
      </CardLabel>
    </LabeledLayout>
  )
}

export const BonusModeMask = ({ isMobile }: { isMobile: boolean }) => {
  const { t } = useTranslation()
  return (
    <BonusModeMaskContainer>
      <BonusModeMaskContainerFlex>
        <BonusModeMaskContainerBox>
          <MaskIcon>
            <IconDoubleChevronWithShadow size={isMobile ? 12 : 14} />
          </MaskIcon>
          <BonusModeMaskContainerSpan>{t('bonusMode.title')}</BonusModeMaskContainerSpan>
          <MaskIcon>
            <IconDoubleChevronWithShadow size={isMobile ? 12 : 14} />
          </MaskIcon>
        </BonusModeMaskContainerBox>
      </BonusModeMaskContainerFlex>
    </BonusModeMaskContainer>
  )
}

export default React.memo(GameCard)

const LabeledLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`

const CardLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 0 2px;
`

const CardLabelName = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardLabelProvider = styled.span`
  font-size: ${fontSize.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BonusModeMaskContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4px solid ${({ theme }) => theme.colors.accent.brand};
  border-radius: 8px;
  pointer-events: none;
`

const BonusModeMaskContainerFlex = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  alight-items: center;
  justify-content: center;
  height: 23;
  bottom: 0;
`

const BonusModeMaskContainerBox = styled.div`
  width: 118px;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.accent.brand};
  border-radius: 8px 8px 0 0;
  gap: 2px;

  ${media.sm} {
    width: 85%;
    gap: 1px;
  }
`
const MaskIcon = styled.span`
  color: ${({ theme }) => theme.colors.text.actionButton};
`

const BonusModeMaskContainerSpan = styled.span`
  color: ${({ theme }) => theme.colors.text.actionButton};
  font-family: Inter;
  font-weight: 700;
  font-size: ${fontSize.xs};
  line-height: 100%;
  letter-spacing: 1%;
  vertical-align: bottom;

  ${media.sm} {
    text-wrap: nowrap;
    font-size: 8px;
  }
`

const CardWrapper = styled.div<{
  $isMobile: boolean
  $comesFromBonusMode: boolean
  $aspectRatio: GameCardAspectRatio
  $hideAnimation: boolean
}>`
  position: relative;
  border-radius: 8px;
  width: ${({ $isMobile, $comesFromBonusMode }) =>
    $isMobile ? '104px' : $comesFromBonusMode ? '131px' : '152px'};
  aspect-ratio: ${({ $aspectRatio }) => GAME_CARD_ASPECT_RATIOS[$aspectRatio]};
  /* Query container so the name overlay can size/position itself relative to the
   * actual card size (cqw/cqh) — identical proportions on every card width and
   * aspect ratio. Height is determinate via aspect-ratio, so 'size' is safe. */
  container-type: size;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: ${({ $hideAnimation }) => ($hideAnimation ? 'none' : 'transform 0.3s ease')};

  &:hover {
    transform: ${({ $isMobile, $hideAnimation }) =>
      $isMobile || $hideAnimation ? 'none' : 'translateY(-10px)'};
  }
`

const NameOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1cqh;
  padding: 7cqh 6cqw 8cqh;
  border-radius: 0 0 8px 8px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(3, 7, 18, 0) 0%, rgba(3, 7, 18, 0.82) 62%);
`

/** Wrap/truncate behaviour for the title, driven by the wordWrap + truncate flags. */
const titleFitCss = (wordWrap: boolean, truncate: boolean, maxLines: number) => {
  if (!wordWrap) {
    return css`
      white-space: nowrap;
      overflow: ${truncate ? 'hidden' : 'visible'};
      text-overflow: ${truncate ? 'ellipsis' : 'clip'};
    `
  }
  if (truncate) {
    return css`
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${maxLines};
      overflow: hidden;
    `
  }
  return css`
    white-space: normal;
    overflow: visible;
  `
}

const NameOverlayTitle = styled.span<{
  $fitCqw: number
  $minPx: number
  $maxPx: number
  $weight: number
  $offset: number
  $wordWrap: boolean
  $truncate: boolean
  $maxLines: number
}>`
  display: block;
  width: 100%;
  text-align: center;
  line-height: 1.15;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  font-weight: ${({ $weight }) => $weight};
  /* Fitted size relative to card width; px bounds keep it legible / not oversized.
   * $fitCqw is the shrink-to-fit result (≤ configured title size). */
  font-size: ${({ $fitCqw, $minPx, $maxPx }) => `clamp(${$minPx}px, ${$fitCqw}cqw, ${$maxPx}px)`};
  /* Lift relative to card height so the position is identical on every aspect ratio. */
  transform: translateY(${({ $offset }) => -$offset}cqh);
  ${({ $wordWrap, $truncate, $maxLines }) => titleFitCss($wordWrap, $truncate, $maxLines)}
`

const NameOverlayProvider = styled.span`
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-weight: 600;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-size: clamp(8px, 7cqw, 13px);
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
`

const InfoOverlay = styled.div<{ $isAvailable: boolean; $hideAnimation: boolean }>`
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  top: -1px;
  height: 101%;
  /* Sit above the persistent name overlay (z-index 1) so the play button / hover
   * scrim always wins when they overlap. */
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ $isAvailable, theme }) =>
    $isAvailable
      ? `linear-gradient(180deg, rgba(3, 7, 18, 0.65) 0%, ${theme.colors.bg.tertiary} 100%)`
      : `linear-gradient(180deg, rgba(3, 7, 18, 0.85) 0%, ${theme.colors.bg.tertiary} 100%)`};
  opacity: 0;
  border-radius: 8px;
  transition: ${({ $hideAnimation }) => ($hideAnimation ? 'none' : 'opacity 0.3s ease')};

  &:hover {
    opacity: 1;
  }
`

const FavoriteIconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  flex-grow: 3;
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    border-radius: 50%;
    padding: 8px;
    fill: ${({ theme }) => theme.colors.text.primary};
    background-color: #ffffff1a;
    transition:
      background-color 0.1s ease-in-out,
      fill 0.3s ease-in-out;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bg.primary};
    }
  }

  .is-favorite {
    background-color: #450e0a;
    fill: red;

    &:hover {
      background-color: #450e0a;
    }
  }

  .dark {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
`

const PlayButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 199;
`

const GameDescriptions = styled.div<{ $comesFromBonusMode?: boolean }>`
  display: flex;
  flex-direction: column;
  font-size: ${fontSize.sm};
  flex-grow: 5;
  padding: 0 14px;
  padding-bottom: ${({ $comesFromBonusMode }) => ($comesFromBonusMode ? '20px' : '0')};
`

const GameName = styled.span`
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  text-align: center;
`

const GameProvider = styled.span`
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${fontSize.sm};
  text-align: center;
`

const CenteredText = styled.div`
  text-align: center;
  width: 100%;
`
