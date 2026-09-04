import instance from '../axios'

export const loadBanners = () => {
  return instance.get('/banners')
}
