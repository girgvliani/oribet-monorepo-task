import instance from '../axios'

export const getPromotionList = () => {
  return instance.get('/promotions')
}

export const getPromotionBySlug = (slug: string) => {
  return instance.get(`/promotions/${slug}`)
}
