import { Component, ReactNode } from 'react'
import { fontSize } from '../../tokens'
import styled from 'styled-components'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  retryTestId?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

// Kept in sync with @oribet/core/util/chunkReload (ui must not import core — that would be a
// circular dependency). Same sessionStorage key so the global vite:preloadError handler and this
// render-time boundary never double-reload or loop.
const RELOAD_GUARD_KEY = 'oribet:chunkReloadedAt'
const RELOAD_LOOP_WINDOW_MS = 10_000

/** True when an error looks like a stale-deploy dynamic-import / chunk-load failure. */
const isChunkLoadError = (error: unknown): boolean => {
  const message = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase()
  return (
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('importing a module script failed') || // Safari
    /loading chunk \S+ failed/.test(message)
  )
}

/** Reload once to fetch the fresh asset manifest; skip if we just reloaded (loop guard). */
const reloadForChunkError = (): boolean => {
  const now = Date.now()
  try {
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) || 0)
    if (now - last < RELOAD_LOOP_WINDOW_MS) return false
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(now))
  } catch {
    // sessionStorage unavailable — reload once anyway.
  }
  window.location.reload()
  return true
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // A stale chunk after a deploy can't be recovered by re-rendering (React.lazy caches the
    // rejected promise) — only a full reload fetches the new hashed files. Do it automatically.
    if (isChunkLoadError(error)) reloadForChunkError()
  }

  handleRetry = () => {
    if (isChunkLoadError(this.state.error)) {
      window.location.reload()
      return
    }
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <Container>
          <Title>Something went wrong</Title>
          <Message>{this.state.error?.message || 'An unexpected error occurred.'}</Message>
          <RetryButton data-testid={this.props.retryTestId} onClick={this.handleRetry}>Try again</RetryButton>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: 200px;
`

const Title = styled.span`
  font-size: ${fontSize.xl};
  font-weight: 700;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`

const Message = styled.span`
  font-size: ${fontSize.base};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 24px;
  max-width: 400px;
`

const RetryButton = styled.button`
  padding: 8px 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  background: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`
