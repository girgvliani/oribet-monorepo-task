import { ReactNode, useCallback, useMemo, useState } from 'react'
import { PageEditorContext, type PageEditorContextValue } from './ActivePageContext'
import { pageRegistry } from './pageRegistry'
import type { ModuleInstance } from './types'

const STORAGE_PREFIX = 'oribet-page-template-'
const isBrowser = typeof window !== 'undefined'

const isValidInstance = (v: unknown): v is ModuleInstance => {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.moduleId === 'string'
}

const loadInstances = (pageId: string, defaults: ModuleInstance[]): ModuleInstance[] => {
  if (!isBrowser) return defaults
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + pageId)
    if (!raw) return defaults
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidInstance)) return defaults
    return parsed as ModuleInstance[]
  } catch {
    return defaults
  }
}

const persist = (pageId: string, instances: ModuleInstance[]) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + pageId, JSON.stringify(instances))
  } catch {
    // ignore
  }
}

const clearStored = (pageId: string) => {
  if (!isBrowser) return
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + pageId)
  } catch {
    // ignore
  }
}

interface ActivePageProviderProps {
  children: ReactNode
}

/**
 * Holds:
 * - which `EditablePage` is currently on screen (LIFO stack)
 * - a per-page map of `ModuleInstance[]`, hydrated from localStorage on first read
 *
 * Both `EditablePage` (the page renderer) and the Configure App template editor
 * read/write through this so changes flow live in both directions.
 */
export const ActivePageProvider = ({ children }: ActivePageProviderProps) => {
  const [stack, setStack] = useState<string[]>([])
  const [pageStates, setPageStates] = useState<Record<string, ModuleInstance[]>>({})

  const registerPage = useCallback((pageId: string) => {
    // Seed from localStorage on first registration.
    setPageStates(prev => {
      if (prev[pageId]) return prev
      const entry = pageRegistry[pageId]
      if (!entry) return prev
      return { ...prev, [pageId]: loadInstances(pageId, entry.defaultInstances) }
    })
    setStack(prev => [...prev, pageId])
    return () => {
      setStack(prev => {
        const idx = prev.lastIndexOf(pageId)
        if (idx === -1) return prev
        const next = prev.slice()
        next.splice(idx, 1)
        return next
      })
    }
  }, [])

  const getInstances = useCallback(
    (pageId: string): ModuleInstance[] => {
      if (pageStates[pageId]) return pageStates[pageId]
      const entry = pageRegistry[pageId]
      return entry ? entry.defaultInstances : []
    },
    [pageStates]
  )

  const setInstances = useCallback((pageId: string, next: ModuleInstance[]) => {
    persist(pageId, next)
    setPageStates(prev => ({ ...prev, [pageId]: next }))
  }, [])

  const resetPage = useCallback((pageId: string) => {
    const entry = pageRegistry[pageId]
    if (!entry) return
    clearStored(pageId)
    setPageStates(prev => ({ ...prev, [pageId]: entry.defaultInstances }))
  }, [])

  const value = useMemo<PageEditorContextValue>(
    () => ({
      activePageId: stack.length ? stack[stack.length - 1] : null,
      registerPage,
      getInstances,
      setInstances,
      resetPage,
    }),
    [stack, registerPage, getInstances, setInstances, resetPage]
  )

  return <PageEditorContext.Provider value={value}>{children}</PageEditorContext.Provider>
}
