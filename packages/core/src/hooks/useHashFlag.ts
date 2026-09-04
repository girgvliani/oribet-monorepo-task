import { useEffect, useState } from 'react'

/**
 * Reactively reports whether the URL hash contains `#<flag>` (case-insensitive). Editing the hash
 * doesn't trigger a router navigation, so we listen to `hashchange` to stay in sync. Used for
 * lightweight view toggles driven from the address bar (e.g. `#nolabel`).
 */
export const useHashFlag = (flag: string): boolean => {
  const read = () =>
    typeof window !== 'undefined' && window.location.hash.toLowerCase().includes(flag.toLowerCase())
  const [active, setActive] = useState<boolean>(read)

  useEffect(() => {
    const onChange = () => setActive(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag])

  return active
}

export default useHashFlag
