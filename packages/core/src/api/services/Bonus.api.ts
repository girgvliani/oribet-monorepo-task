import instance from '../axios'
import { IFreespinBonus } from '../../types/Bonus.type'

export const getRakeBacks = async () => {
  const response = await instance.get('/rakeback')
  return response.data
}

export const claimRakeBacks = async (body: any) => {
  const response = await instance.post('/rakeback/claim', body)
  return response.data
}

export const getCashBacks = async () => {
  const response = await instance.get('/cashback')
  return response.data
}

export const claimCashBacks = async (body: any) => {
  const response = await instance.post('/cashback/claim', body)
  return response.data
}

export const getAllDepositBonuses = () => {
  return instance.get('/bonus/deposit')
}

export const claimDepositBonuses = (body: any) => {
  return instance.post('/bonus/claim', body)
}

export const getPrizeWithPromo = (body: any) => {
  return instance.post('/bonus/promo', body)
}

export const getFreespinBonuses = async (): Promise<IFreespinBonus[]> => {
  const response = await instance.get('/bonus/freespin')
  const data = response.data
  // API returns array directly or wrapped in { data: { active_unused_bonuses } }
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data?.active_unused_bonuses)) return data.data.active_unused_bonuses
  if (Array.isArray(data?.active_unused_bonuses)) return data.active_unused_bonuses
  return []
}

