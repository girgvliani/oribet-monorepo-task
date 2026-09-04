import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { getBlogBySlug } from '../../api/services/Blog.api'
import type { IBlog } from '../../types/common.type'

/**
 * Fetches a blog post by the `:slug` route parameter. Each consumer of the hook triggers its
 * own fetch — the same slug resolves to the same backend call per render tree, which is
 * acceptable for the handful of modules that compose the blog details page.
 */
export const useBlogBySlug = () => {
  const { slug } = useParams<{ slug?: string }>()
  const [blog, setBlog] = useState<Partial<IBlog>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getBlogBySlug(slug)
      .then(res => setBlog(res.data.data))
      .catch(err => {
        enqueueSnackbar(err?.response?.data?.message ?? 'Failed to load blog post', {
          variant: 'error',
        })
      })
      .finally(() => setLoading(false))
  }, [slug])

  return { blog, loading }
}
