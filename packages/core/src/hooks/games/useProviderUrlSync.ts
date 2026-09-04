import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const parse = (v: string | null): string[] => (v ? v.split(',').filter(Boolean) : [])
const sameIds = (a: string[], b: string[]): boolean =>
  a.length === b.length && [...a].sort().join(',') === [...b].sort().join(',')

/**
 * Two-way sync of the multi-select provider filter with the `?provider=` URL query. Reading the
 * URL drives the filter (shareable links / manual address-bar edits), and `setProviders` writes it
 * back (`replace`, so toggling doesn't spam history). Returns `[selectedProviderIds, setProviders]`.
 */
export const useProviderUrlSync = (): [string[], (next: string[]) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()
  const providerParam = searchParams.get('provider') ?? ''
  const [selected, setSelected] = useState<string[]>(() => parse(providerParam))

  // URL → state (shared link, back/forward, manual edit).
  useEffect(() => {
    const fromUrl = parse(providerParam)
    setSelected(prev => (sameIds(prev, fromUrl) ? prev : fromUrl))
  }, [providerParam])

  // state → URL.
  const setProviders = (next: string[]) => {
    setSelected(next)
    setSearchParams(
      prev => {
        const p = new URLSearchParams(prev)
        if (next.length) p.set('provider', next.join(','))
        else p.delete('provider')
        return p
      },
      { replace: true }
    )
  }

  return [selected, setProviders]
}

export default useProviderUrlSync
