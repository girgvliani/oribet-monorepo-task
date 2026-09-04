import { createContext, useContext } from 'react'
import type { ModuleInstance } from './types'

export interface PageEditorContextValue {
  /** pageId of the topmost mounted EditablePage, null if none. */
  activePageId: string | null
  /** Mount-time hook used by EditablePage to register. Returns an unregister fn. */
  registerPage: (pageId: string) => () => void
  /** Snapshot of instances for a page (defaults if unstored). */
  getInstances: (pageId: string) => ModuleInstance[]
  /** Replace the entire instance list for a page; persists to localStorage. */
  setInstances: (pageId: string, next: ModuleInstance[]) => void
  /** Wipe stored instances for a page; falls back to defaults. */
  resetPage: (pageId: string) => void
}

const noop = () => () => {}

export const PageEditorContext = createContext<PageEditorContextValue>({
  activePageId: null,
  registerPage: noop,
  getInstances: () => [],
  setInstances: () => {},
  resetPage: () => {},
})

export const useActivePageId = (): string | null => useContext(PageEditorContext).activePageId

// Backwards-compatible alias for the old name; some files may still import this.
export const ActivePageContext = PageEditorContext
