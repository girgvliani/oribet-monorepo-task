import { resetPassword } from '@oribet/core/api/services/Auth.api'
import type { IPassword } from '@oribet/core/types/Auth.type'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResetPasswordPage from './ResetPasswordPage'

const ResetPasswordContainer = () => {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const email = queryParams.get('auth.email')

  const [password, setPassword] = useState<IPassword>({
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    if (!token || !email) {
      navigate(AppRoutePath.HOME())
    }
  }, [])

  const onSubmit = () => {
    const submitData: IPassword = { ...password, token, email }
    resetPassword(submitData)
      .then(resp => {
        if (resp && resp.data && !resp.data.success) {
          enqueueSnackbar(resp.data.message, { variant: 'error' })
        } else {
          navigate(AppRoutePath.HOME())
          enqueueSnackbar(resp.data.message, { variant: 'success' })
        }
      })
      .catch(() => {})
      .finally(() => {})
  }

  return <ResetPasswordPage password={password} setPassword={setPassword} onSubmit={onSubmit} />
}

export default ResetPasswordContainer
