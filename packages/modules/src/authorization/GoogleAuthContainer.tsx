import { getUserInfo } from '@oribet/core/api/services/User.api'
import { SeoContainer } from '@oribet/modules/head-section'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import {
  changeAccessToken,
  changeGlobalWelcomeModal,
  changeUserAuthorization,
  changeUserInfo,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import {
  getLocalStorageValue,
  registrationGoogleManagerHelper,
  setLocalStorageValue,
} from '@oribet/core/util/appUtil'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IAccessToken, IUserInfo } from '@oribet/core/types/common.type'
import { seoType } from '@oribet/core/types/seo.type'

const GoogleAuthContainer = ({ screen }: { screen: seoType }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { access_token } = useParams()

  useEffect(() => {
    if (access_token) {
      setLocalStorageValue('token', access_token)
      getUserInfo()
        .then((resp: any) => {
          const createDate: Date = new Date(resp.data.data.create_dt)
          const currentDate: Date = new Date()
          const timeDifference: number = currentDate.getTime() - createDate.getTime()
          const differenceInMinutes = timeDifference / (1000 * 60)
          // Account created within the last minute ⇒ this Google flow was a registration.
          const isNewRegistration = differenceInMinutes <= 1
          if (isNewRegistration) {
            registrationGoogleManagerHelper(
              resp.data.data.id,
              resp.data.data.register_country,
              'Google'
            )
          }
          if (resp.data.data) {
            const now = new Date()
            const access_tokenInfo: IAccessToken = {
              token: access_token,
              expire_at: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
            }
            const data: IUserInfo = {
              access_Token: {
                ...access_tokenInfo,
              },
              player: resp.data.data,
            }
            dispatch(changeUserAuthorization(true))
            dispatch(changeAccessToken(access_tokenInfo))
            dispatch(changeUserInfo(data))
            setLocalStorageValue('userInfo', JSON.stringify(data))
            setLocalStorageValue('isAuthorized', true)
            setLocalStorageValue('token_expire_at', access_tokenInfo.expire_at)
            setLocalStorageValue('userId', resp.data.data.id)
            setLocalStorageValue('token', access_tokenInfo.token)

            // Greet fresh Google sign-ups with the same welcome/claim-bonus modal as the
            // manual registration flow.
            if (isNewRegistration) {
              dispatch(changeGlobalWelcomeModal(true))
            }

            if (getLocalStorageValue('lastOpenedPage', '') === AppRoutePath.SPORT()) {
              navigate(AppRoutePath.SPORT())
            } else {
              navigate(AppRoutePath.HOME())
            }
          }
        })
        .catch(() => {})
    }
  }, [access_token])

  return (
    <>
      <SeoContainer screen={screen} />
      <div />
    </>
  )
}

export default GoogleAuthContainer
