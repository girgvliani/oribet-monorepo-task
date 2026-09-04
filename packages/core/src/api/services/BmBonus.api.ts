import instance from '../axios'
import { IBMBonusMoney } from '../../types/BonusMoney.type'

const getActiveBmBonus = async () => {
  const response = await instance.get('/bonus/bm/active')
  return response.data
}

const fetchAllBmBonus = async (): Promise<IBMBonusMoney[]> => {
  const response = await instance.get('/bonus/bm')
  return response.data
}

const buyBmBonus = async (params: { bonus_id: number; buy_amount?: number }) => {
  const response = await instance.post('/bonus/bm/buy', params)
  return response.data
}

const claimBmBonus = async () => {
  const response = await instance.post('/bonus/bm/claim')
  return response.data
}

const claimBmBonusById = async (playerBonusId: number) => {
  const response = await instance.post('/bonus/claim', { player_bonus_id: playerBonusId })
  return response.data
}

const cancelBmBonus = async (playerBonusId?: number) => {
  const response = await instance.post('/bonus/bm/cancel', playerBonusId ? { player_bonus_id: playerBonusId } : {})
  return response.data
}

/** Preview how much the player gets back if they cancel this bonus (shown before confirming). */
const checkCancelBonusAmount = async (playerBonusId: number) => {
  const response = await instance.post('/bonus/bm/check-cancel-amount', {
    player_bonus_id: playerBonusId,
  })
  return response.data
}

const getQueuedBonuses = async () => {
  const response = await instance.get('/bonus/bm/queued_bonuses')
  return response.data
}

const getReadyToClaimBonuses = async () => {
  const response = await instance.get('/bonus/bm/ready_to_claim')
  const data = response.data?.data || []
  return { ...response.data, data: data.filter((b: any) => b.type === 'play_bonus_money') }
}

export {
  buyBmBonus,
  cancelBmBonus,
  checkCancelBonusAmount,
  claimBmBonus,
  claimBmBonusById,
  fetchAllBmBonus,
  getActiveBmBonus,
  getQueuedBonuses,
  getReadyToClaimBonuses,
}
