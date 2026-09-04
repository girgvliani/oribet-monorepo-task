import { useCallback, useContext, useMemo } from 'react'
import { PageEditorContext } from './ActivePageContext'
import { pageRegistry } from './pageRegistry'
import type { AuthVisibility, ModuleInstance } from './types'

const visibilityFromInstance = (i: ModuleInstance): AuthVisibility => i.visible ?? 'always'

const applyVisibility = (i: ModuleInstance, v: AuthVisibility): ModuleInstance => {
  const next = { ...i }
  if (v === 'always') delete next.visible
  else next.visible = v
  return next
}

const newInstanceId = () =>
  `mi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export interface UsePageTemplateValue {
  pageId: string
  label: string
  allowedModules: string[]
  instances: ModuleInstance[]
  addModule: (moduleId: string) => void
  removeInstance: (instanceId: string) => void
  reorderInstances: (fromId: string, toId: string) => void
  setVisibility: (instanceId: string, visibility: AuthVisibility) => void
  resetToDefault: () => void
  visibilityOf: (instanceId: string) => AuthVisibility
}

/**
 * Read/write hook for one page's module list. State lives in `ActivePageProvider`
 * so multiple consumers (the rendered page + the editor sidebar) stay in sync.
 *
 * Returns null if `pageId` isn't in the page registry.
 */
export const usePageTemplate = (pageId: string): UsePageTemplateValue | null => {
  const { getInstances, setInstances, resetPage } = useContext(PageEditorContext)
  const entry = pageRegistry[pageId]
  const instances = entry ? getInstances(pageId) : []

  const addModule = useCallback(
    (moduleId: string) => {
      setInstances(pageId, [...instances, { id: newInstanceId(), moduleId }])
    },
    [pageId, instances, setInstances]
  )

  const removeInstance = useCallback(
    (instanceId: string) => {
      setInstances(
        pageId,
        instances.filter(i => i.id !== instanceId)
      )
    },
    [pageId, instances, setInstances]
  )

  const reorderInstances = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return
      const fromIdx = instances.findIndex(i => i.id === fromId)
      const toIdx = instances.findIndex(i => i.id === toId)
      if (fromIdx === -1 || toIdx === -1) return
      const next = instances.slice()
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      setInstances(pageId, next)
    },
    [pageId, instances, setInstances]
  )

  const setVisibility = useCallback(
    (instanceId: string, visibility: AuthVisibility) => {
      setInstances(
        pageId,
        instances.map(i => (i.id === instanceId ? applyVisibility(i, visibility) : i))
      )
    },
    [pageId, instances, setInstances]
  )

  const resetToDefault = useCallback(() => resetPage(pageId), [pageId, resetPage])

  const visibilityOf = useCallback(
    (instanceId: string): AuthVisibility => {
      const i = instances.find(x => x.id === instanceId)
      return i ? visibilityFromInstance(i) : 'always'
    },
    [instances]
  )

  return useMemo(() => {
    if (!entry) return null
    return {
      pageId,
      label: entry.label,
      allowedModules: entry.allowedModules,
      instances,
      addModule,
      removeInstance,
      reorderInstances,
      setVisibility,
      resetToDefault,
      visibilityOf,
    }
  }, [
    entry,
    pageId,
    instances,
    addModule,
    removeInstance,
    reorderInstances,
    setVisibility,
    resetToDefault,
    visibilityOf,
  ])
}
