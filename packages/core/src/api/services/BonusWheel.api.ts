import instance from '../axios'

export const getUserPrizes = () => {
  return instance.get('/bonus_wheel/prizes')
}

export const makeSpin = () => {
  return instance.post('/bonus_wheel/spin')
}
