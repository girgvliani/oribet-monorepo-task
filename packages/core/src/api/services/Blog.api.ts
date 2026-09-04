import instance from '../axios'

export const getBlogList = () => {
  return instance.get('/blogs')
}

export const getBlogBySlug = (slug: string) => {
  return instance.get('/blogs/' + slug)
}

export const getBlogsByCategory = (category: string) => {
  return instance.get('/blogs/category/' + category)
}
