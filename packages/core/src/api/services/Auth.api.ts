import instance from '../axios'
import { IPassword, ISignIn, ISignUp } from '../../types/Auth.type'

export const SignIn = (body: ISignIn) => {
  return instance.post('/login', body)
}

export const SignUp = (body: ISignUp) => {
  return instance.post('/register', {
    ...body,
  })
}

export const SignOut = () => {
  return instance.post('/logout')
}

export const RefreshToken = () => {
  instance.defaults.withCredentials = true
  return instance.post('/auth/refreshToken')
}

export const forgotPassword = (body: { email: string }) => {
  return instance.post('/forgot-password', {
    ...body,
  })
}

export const resetPassword = (body: IPassword) => {
  return instance.post('/reset-password', {
    ...body,
  })
}

export const getMultiCurrency = () => {
  return instance.get('/multiCurrency')
}

/**
 * Pre-registration phone verification (no auth required — the player doesn't exist yet).
 * Send a 4-digit PIN to the entered number, then verify it before submitting `/register`.
 */
export const sendRegistrationPin = (body: { phone: string; lang: string }) => {
  return instance.post('/phone_number/send-registration-pin', body)
}

export const verifyRegistrationPin = (body: { phone: string; phone_confirm_code: string }) => {
  return instance.post('/phone_number/verify-registration-pin', body)
}
