import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getUserInfo, updateUserProfilePicture } from '@oribet/core/api/services/User.api'
import { IconArrowBack } from '@oribet/assets/icons/IconArrowBack'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { CustomPrimaryButton } from '@oribet/ui'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeUserInfo, changeUserProfileInfo } from '@oribet/core/redux/slices/userSlice'
import { getLocalStorageValue, setLocalStorageValue } from '@oribet/core/util/appUtil'
import { IUserProfileInfo } from '@oribet/core/util/UserProfileHelper'
import { useSnackbar } from 'notistack'
import { useRef, useState } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'
import { IUserInfo } from '@oribet/core/types/common.type'

interface IUserProfileChangeImg {
  avatar: string | null
  setStage: (stage: number) => void
  onClose: () => void
}

const UserProfileChangeImg = ({ setStage, onClose, avatar }: IUserProfileChangeImg) => {
  const isMobile = useIsMobile()
  const userProfileInformation = useAppSelector(
    state => state.user.userProfileInformation
  ) as IUserProfileInfo
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [img, setImg] = useState<string | null>(null)
  const fileInputRef = useRef<any>(null)
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    if (file && file.type.match(/^image\/(png|jpe?g|svg)$/)) {
      setImg(URL.createObjectURL(file))
      fileInputRef.current.file = file
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const convertUrlToFile = async (imageUrl: string, fileName: string) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  }

  const handleImageClick = async (src: string) => {
    const file = await convertUrlToFile(src, 'avatar.png')
    fileInputRef.current.file = file
    setImg(URL.createObjectURL(file))
  }

  const updateAvatar = () => {
    if (fileInputRef.current.file) {
      const formData = new FormData()
      formData.append('avatar', fileInputRef.current.file)
      setLoading(true)
      updateUserProfilePicture(formData)
        .then(() => {
          getUserInfo()
            .then((resp: any) => {
              const token = getLocalStorageValue('token', '')
              const isTokenExpired = getLocalStorageValue('token_expire_at', new Date())
              if (resp.data.data) {
                const data: IUserInfo = {
                  access_Token: {
                    token: token,
                    expire_at: isTokenExpired,
                  },
                  player: resp.data.data,
                }

                dispatch(
                  changeUserProfileInfo({
                    ...userProfileInformation,
                    avatar: resp.data.data.avatar,
                  })
                )

                dispatch(changeUserInfo(data))
                setLocalStorageValue('userInfo', JSON.stringify(data))
                enqueueSnackbar(t('settings.profileUpdatedSuccess'), {
                  variant: 'success',
                })
                setStage(0)
              }
            })
            .catch(() => {})
            .finally(() => {
              setLoading(false)
            })
        })
        .catch(() => {})
    }
  }

  return (
    <Root $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <HeaderLeft>
          <GoBackButton
            onClick={() => setStage(1)}
            data-testid={`${ACCOUNT_TEST_IDS.nav.back}.avatar`}
          >
            <IconArrowBack />
          </GoBackButton>
          <HeaderText>{t('profile.myProfile')}</HeaderText>
        </HeaderLeft>
        <CloseButton onClick={() => onClose()} data-testid={ACCOUNT_TEST_IDS.profile.close}>
          <IconClose />
        </CloseButton>
      </Header>
      <Body>
        <ImgContainer>
          {img ? (
            <img src={img} alt={'user_profile_img'} />
          ) : (
            <>
              {avatar ? (
                <img src={resolveImageUrl(avatar)} alt={'user_profile_img'} />
              ) : (
                <img src={`/imgs/avatars/default.png`} alt={'user_profile_img'} />
              )}
            </>
          )}
        </ImgContainer>
      </Body>
      <DefaultAvatarsContainer>
        <DefaultAvatarsTitle>{t('settings.defaultAvatars')}</DefaultAvatarsTitle>
        <DefaultAvatars>
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/default.png'}
            width={'48px'}
            onClick={() => handleImageClick('/imgs/avatars/default.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.default`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-1.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-1.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-1`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-2.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-2.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-2`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-3.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-3.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-3`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-4.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-4.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-4`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-5.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-5.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-5`}
          />
          <img
            alt={'default avatar'}
            src={'/imgs/avatars/avatar-6.png'}
            onClick={() => handleImageClick('/imgs/avatars/avatar-6.png')}
            data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.avatar-6`}
          />
        </DefaultAvatars>
      </DefaultAvatarsContainer>
      <Footer>
        <UploadButton
          onClick={() => handleUploadClick()}
          data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.upload`}
        >
          {t('settings.upload')}
        </UploadButton>
        <ButtonWrapper>
          <CustomPrimaryButton
            style={{
              textTransform: 'uppercase',
              flex: 1,
              width: '100%',
            }}
            onClick={() => updateAvatar()}
            loading={loading}
            testId={ACCOUNT_TEST_IDS.avatar.save}
          >
            {t('settings.update')}
          </CustomPrimaryButton>
        </ButtonWrapper>
      </Footer>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
        data-testid={`${ACCOUNT_TEST_IDS.avatar.option}.upload-input`}
      />
    </Root>
  )
}

export default UserProfileChangeImg

const Root = styled.div<{ $isMobile: boolean }>`
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '12px')};
  border: ${({ $isMobile, theme }) =>
    $isMobile ? 'none' : `1px solid ${theme.colors.surface.hover}`};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-sizing: border-box;
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.5);
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '426px')};
  height: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
`

const Header = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.bg.input};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  border-radius: ${({ $isMobile }) => ($isMobile ? '0' : '12px 12px 0 0')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const HeaderText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 24px;
`

const GoBackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
    width: 16px;
    height: 16px;
  }
`

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
    width: 20px;
    height: 20px;
  }
`

const Body = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.primary};
  display: flex;
  flex-direction: column;
  height: 184px;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const ImgContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`

const DefaultAvatarsContainer = styled.div`
  margin: 16px;
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  & img {
    cursor: pointer;
  }
`

const DefaultAvatarsTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 24px;
`

const DefaultAvatars = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const Footer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`

const UploadButton = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 24px;
  text-transform: uppercase;
  flex: 1;
  justify-content: center;
  display: flex;
  cursor: pointer;
`

const ButtonWrapper = styled.div`
  flex: 1;
`
