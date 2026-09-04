import instance from '../axios'

export const getStaticPages = () => {
  return instance.get('/pages')
}
