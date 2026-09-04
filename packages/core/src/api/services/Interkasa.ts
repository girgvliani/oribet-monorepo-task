import instance from '../axios'

export const depositFiat = (params: any) => {
  return instance.post('/interkassa/deposit', params)
}
