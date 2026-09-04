import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { getStaticPages } from '../../api/services/Policies.api'
import { useAppSelector } from '../../redux/hooks'
import type { IStaticPage } from '../../types/common.type'

/**
 * Fetches policy/static pages for the current language. Each consumer of this hook
 * triggers its own fetch — cheap since the pages are small and rarely change within
 * a session. Upgrade to react-query later if needed.
 */
export const usePolicies = () => {
  const lang = useAppSelector(state => state.user.language)
  const [staticPages, setStaticPages] = useState<IStaticPage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setLoading(true)
    getStaticPages()
      .then(res => {
        setStaticPages(res.data.data)
      })
      .catch(err => {
        enqueueSnackbar(err?.data?.data?.message ?? 'Failed to load policies', {
          variant: 'error',
        })
      })
      .finally(() => setLoading(false))
  }, [lang])

  return { staticPages, loading }
}
