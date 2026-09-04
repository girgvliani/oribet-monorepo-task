import { RefObject, useEffect } from 'react'

/**
 * Detects clicks outside one or more refs and calls the handler.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null)
 *   useClickOutside([ref], () => setIsOpen(false), isOpen)
 *
 * @param refs     - Refs whose areas are considered "inside"
 * @param handler  - Called when click lands outside all refs
 * @param enabled  - Only listen when true (default: true)
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isInsideAnyRef = refs.some(
        (ref) => ref.current && ref.current.contains(target)
      )
      if (!isInsideAnyRef) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs, handler, enabled])
}
