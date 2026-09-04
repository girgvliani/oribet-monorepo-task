import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { getBlogList } from '../../api/services/Blog.api'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { changeBlog } from '../../redux/slices/blogsSlice'
import type { IBlog } from '../../types/common.type'

/**
 * Fetches the full blog list once, caches it in Redux (`blogs.blogItems`). The backend
 * already localizes by `Accept-Language`, so no client-side language filtering. Also
 * exposes the banner-flagged subset. Consumers share the same store slice, so calling
 * this hook from multiple modules does not refetch.
 */
export const useBlogList = () => {
  const blogs = useAppSelector(state => state.blogs.blogItems)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (blogs.length) return
    setLoading(true)
    getBlogList()
      .then(res => dispatch(changeBlog(res.data.data.reverse())))
      .catch(err =>
        enqueueSnackbar(err?.response?.data?.message ?? 'Failed to load blogs', {
          variant: 'error',
        }),
      )
      .finally(() => setLoading(false))
  }, [])

  const bannerBlogs = blogs.filter((blog: IBlog) => blog.is_banner)

  return { blogs, bannerBlogs, loading }
}
