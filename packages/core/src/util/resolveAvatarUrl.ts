import { resolveImageUrl } from '../api/baseUrl'

const DEFAULT_AVATAR = '/imgs/avatars/default.png'

export const resolveAvatarUrl = (avatar: string | null | undefined): string => {
  if (!avatar) return DEFAULT_AVATAR
  return resolveImageUrl(avatar)
}
