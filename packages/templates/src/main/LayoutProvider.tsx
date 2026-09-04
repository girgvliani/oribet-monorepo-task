import {
  ComponentType,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  LayoutContext,
  type LayoutContextValue,
} from '@oribet/core/hooks/layout/useLayoutContext'
import type { LayoutProps } from './AppShell'

export interface LayoutEntry {
  /** Human-readable name shown in the layout switcher UI. */
  label: string
  /** The layout component itself. Must satisfy `LayoutProps`. */
  component: ComponentType<LayoutProps>
}

interface LayoutProviderProps {
  children: ReactNode
  /** All available layouts keyed by stable id (the key gets persisted to localStorage). */
  layouts: Record<string, LayoutEntry>
  /** Initial layout key when nothing is in localStorage. Defaults to the first registered key. */
  defaultKey?: string
  /** localStorage key used to persist the user's choice. */
  storageKey?: string
}

const STORAGE_KEY = 'oribet-layout-key'

const LayoutRegistryContext = createContext<Record<string, LayoutEntry>>({})

/**
 * Wraps the app with a layout switcher: stores the selected layout key (persisted to
 * localStorage), exposes the option list to UI consumers via `useLayoutContext`, and the
 * active component to AppShell via `useActiveLayout`. Skip mounting it if you only want one
 * layout — AppShell falls back to its `layout` prop / `MainTemplate` default.
 */
export const LayoutProvider = ({
  children,
  layouts,
  defaultKey,
  storageKey = STORAGE_KEY,
}: LayoutProviderProps) => {
  const [currentLayoutKey, setKey] = useState<string>(() => {
    const fallback = defaultKey ?? Object.keys(layouts)[0]
    if (typeof window === 'undefined') return fallback
    const stored = window.localStorage.getItem(storageKey)
    return stored && layouts[stored] ? stored : fallback
  })

  const setLayoutKey = (key: string) => {
    if (!layouts[key] || key === currentLayoutKey) return
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, key)
    setKey(key)
  }

  const value: LayoutContextValue = useMemo(
    () => ({
      currentLayoutKey,
      setLayoutKey,
      options: Object.entries(layouts).map(([key, { label }]) => ({ key, label })),
    }),
    [currentLayoutKey, layouts],
  )

  return (
    <LayoutContext.Provider value={value}>
      <LayoutRegistryContext.Provider value={layouts}>{children}</LayoutRegistryContext.Provider>
    </LayoutContext.Provider>
  )
}

/**
 * Resolve the active layout component. AppShell calls this — falls back to its own `layout`
 * prop or `MainTemplate` when no provider is mounted.
 */
export const useActiveLayout = (): ComponentType<LayoutProps> | undefined => {
  const ctx = useContext(LayoutContext)
  const registry = useContext(LayoutRegistryContext)
  if (!ctx) return undefined
  return registry[ctx.currentLayoutKey]?.component
}
