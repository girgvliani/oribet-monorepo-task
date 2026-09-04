import { SignIn } from '@oribet/core/api/services/Auth.api'
import { getUserInfo } from '@oribet/core/api/services/User.api'
import Login from './Login'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { changeAccessToken, changeUserAuthorization, changeUserInfo } from '@oribet/core/redux/slices/userSlice'
import { setLocalStorageValue } from '@oribet/core/util/appUtil'
import { useQueryClient } from '@tanstack/react-query'
import { useSafeVisitorData } from '../fingerprint'
import { useRef, useState } from 'react'
import { ISignIn } from '@oribet/core/types/Auth.type'
import { IErrorResponse, IUserInfo } from '@oribet/core/types/common.type'

interface ILoginContainer {
  onClose: () => void
  setIsOpenResetPasswordModal: (isOpen: boolean) => void
}

const LoginContainer = ({ onClose, setIsOpenResetPasswordModal }: ILoginContainer) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { getData: getVisitorData } = useSafeVisitorData({ immediate: false })
  const loginInfoRef = useRef<ISignIn>({
    email: '',
    password: '',
  })
  const [disableLogin, setDisableLogin] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const onSignIn = async () => {
    setLoading(true)
    console.log('[fingerprint] login: requesting visitor data')
    const fp = await getVisitorData().catch(err => {
      console.error('[fingerprint] login: getVisitorData failed', err)
      return null
    })
    if (fp) {
      console.log('[fingerprint] login: visitor data', {
        fingerprint_request_id: fp.event_id,
      })
    } else {
      console.warn('[fingerprint] login: no visitor data, submitting without fingerprint')
    }
    const payload: ISignIn = {
      ...loginInfoRef.current,
      ...(fp?.event_id ? { fingerprint_request_id: fp.event_id } : {}),
    }
    SignIn(payload)
      .then((res: any) => {
        const loginData = res.data.data
        queryClient.clear()
        dispatch(changeUserAuthorization(true))
        dispatch(changeAccessToken(loginData.access_token))
        dispatch(changeUserInfo(loginData))
        setLocalStorageValue('isAuthorized', true)
        setLocalStorageValue('token_expire_at', loginData.access_token.expire_at)
        setLocalStorageValue('userId', loginData.player.id)
        setLocalStorageValue('token', loginData.access_token.token)
        setLocalStorageValue('userEmail', loginInfoRef.current.email)

        // Fetch full user info (includes wallets) and update store
        getUserInfo()
          .then((resp: any) => {
            if (resp.data.data) {
              const data: IUserInfo = {
                access_Token: loginData.access_token,
                player: resp.data.data,
              }
              dispatch(changeUserInfo(data))
              setLocalStorageValue('userInfo', JSON.stringify(data))
            }
          })
          .catch(() => {})

        onClose()
      })
      .catch((error: IErrorResponse) => {
        setError(error.response.data.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onChangeLoginInfo = (key: string, value: string): void => {
    loginInfoRef.current = { ...loginInfoRef.current, [key]: value }
    checkValidation()
  }

  const handleSetEmail = (email: string) => {
    onChangeLoginInfo('email', email)
  }

  const checkValidation = () => {
    setDisableLogin(
      Boolean(!(loginInfoRef.current.password.trim() && loginInfoRef.current.email.trim()))
    )
  }

  return (
    <Login
      onChangeLoginInfo={onChangeLoginInfo}
      disableLogin={disableLogin}
      onSignIn={onSignIn}
      loading={loading}
      onClose={onClose}
      error={error}
      handleSetEmail={handleSetEmail}
      setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
    />
  )
}

export default LoginContainer
