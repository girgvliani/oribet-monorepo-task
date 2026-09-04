import { useContext, useEffect } from 'react'
import { PageEditorContext } from './ActivePageContext'
import { moduleRegistry } from './moduleRegistry'
import { usePageTemplate } from './usePageTemplate'

interface EditablePageProps {
  pageId: string
}

/**
 * Renders the modules currently configured for `pageId`. Order, additions,
 * removals, and per-instance auth visibility come from `usePageTemplate`,
 * which is backed by localStorage.
 *
 * Auth-conditional rendering is delegated to the module: it receives the
 * `visible` prop and decides whether to short-circuit (via `useShouldRender`).
 *
 * Registers itself as the active editable page so the Configure App sidebar
 * can target it.
 */
const EditablePage = ({ pageId }: EditablePageProps) => {
  const { registerPage } = useContext(PageEditorContext)
  const page = usePageTemplate(pageId)

  useEffect(() => registerPage(pageId), [registerPage, pageId])

  if (!page) return null

  return (
    <>
      {page.instances.map(i => {
        const entry = moduleRegistry[i.moduleId]
        if (!entry) return null
        const Component = entry.Component
        return <Component key={i.id} visible={i.visible ?? 'always'} />
      })}
    </>
  )
}

export default EditablePage
