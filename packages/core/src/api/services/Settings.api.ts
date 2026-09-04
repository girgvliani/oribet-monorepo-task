import instance from '../axios'
import { IPersonalInfo } from '../../types/common.type'

export const changeEmail = (body: { email: string }) => {
  return instance.post('/players', body)
}

export const changePhone = (body: { phone: string }) => {
  return instance.post('/players', body)
}

export const changeNickname = (body: { nickname: string }) => {
  return instance.post('/players', body)
}

export const changeSystemLanguage = (body: { lang: string }) => {
  return instance.post('/players', body)
}

export const emailVerification = () => {
  return instance.post('/players/email/request_verification', {})
}

export const phoneCode = () => {
  return instance.post('/players/phone_number/send', {})
}

export const phoneVerification = (body: { pin: string }) => {
  return instance.post('/players/phone_number/verify', body)
}

export const changePassword = (body: {
  password?: string | undefined
  new_password: string
  repeat_password: string
}) => {
  return instance.post('/players', body)
}

export const personalInfo = (body: IPersonalInfo) => {
  return instance.post('/players', body)
}

export const sendFiles = (body: any) => {
  return instance.post('/players', body)
}

export const enable2FAGoogle = (body: { password: string }) => {
  return instance.post('/2fa/google/enable', body)
}

export const verify2FACode = (body: { '2fa_code': string }) => {
  return instance.post('/2fa/google/verify', body)
}

export const updateWantDepositBonus = (want_deposit_bonus: boolean) => {
  return instance.post('/players', { want_deposit_bonus })
}

export const emailVerificationConfirm = (id: string, hash: string) => {
  return instance.get(`/email-verification/${id}/${hash}`)
}
