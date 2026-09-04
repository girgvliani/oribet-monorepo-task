/**
 * Recovery for stale dynamically-imported chunks after a deploy.
 *
 * Vite emits hash-named chunks (`assets/BonusesTemplate-<hash>.js`). Each deploy rehashes them and
 * removes the previous files. A browser tab opened *before* a deploy still holds the old module
 * graph, so when the user later hits a lazy route (`React.lazy(() => import(...))`) the old URL
 * 404s and the import rejects with "Failed to fetch dynamically imported module". The only fix is a
 * full reload to fetch the fresh `index.html` + new chunk hashes.
 *
 * The sessionStorage guard key is shared with the ErrorBoundary so the two recovery paths (the
 * global `vite:preloadError` listener here, and the render-time boundary) never fight or loop.
 */
const RELOAD_GUARD_KEY = 'oribet:chunkReloadedAt'
const RELOAD_LOOP_WINDOW_MS = 10_000

/** True when an error looks like a stale-deploy dynamic-import / chunk-load failure. */
export const isChunkLoadError = (error: unknown): boolean => {
  const message = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase()
  return (
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('importing a module script failed') || // Safari
    /loading chunk \S+ failed/.test(message)
  )
}

/**
 * Force one page reload to pick up the freshly-deployed asset manifest. Guards against reload loops:
 * if we already reloaded within the last {@link RELOAD_LOOP_WINDOW_MS}, assume the deploy is
 * genuinely broken and stop (let the ErrorBoundary surface the message instead). Returns whether a
 * reload was triggered.
 */
export const reloadForChunkError = (): boolean => {
  const now = Date.now()
  try {
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) || 0)
    if (now - last < RELOAD_LOOP_WINDOW_MS) return false
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(now))
  } catch {
    // sessionStorage unavailable (private mode / disabled) — reload once anyway.
  }
  window.location.reload()
  return true
}

/**
 * Register the global Vite preload-error listener. Vite dispatches `vite:preloadError` on `window`
 * when a dynamic import (or its preloaded deps) fails to load — including the top-level app shell
 * chunk, which no in-tree ErrorBoundary can catch. Call once at app startup.
 */
export const registerChunkErrorReload = (): void => {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (() => {
    reloadForChunkError()
  }) as EventListener)
}
