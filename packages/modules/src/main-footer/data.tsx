import { IconFacebook } from '@oribet/assets/icons/IconFacebook'
import { IconInstagram } from '@oribet/assets/icons/IconInstagram'
import { IconTelegram } from '@oribet/assets/icons/IconTelegram'
import { IconX } from '@oribet/assets/icons/IconX'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { ReactElement } from 'react'

interface SocialIcon {
  icon: ReactElement
  link: string
  title: string
  isTwitter?: boolean
}

interface AboutUsItem {
  title: string
  url?: string | any
  isLiveSupport?: boolean
  isReactRoute?: boolean
}

const SOCIAL_ICONS_SIZE = 13

const getSocialIcons = (iconColor: string): SocialIcon[] => [
  {
    icon: <IconFacebook size={SOCIAL_ICONS_SIZE} style={{ color: iconColor }} />,
    link: 'https://www.facebook.com/people/Oribet/61557377945830/',
    title: 'footer.Facebook',
  },
  {
    icon: <IconX size={SOCIAL_ICONS_SIZE} style={{ color: iconColor }} />,
    link: 'https://twitter.com/Oribetio',
    title: 'X',
    isTwitter: true,
  },
  {
    icon: <IconInstagram size={SOCIAL_ICONS_SIZE} style={{ color: iconColor }} />,
    link: 'https://www.instagram.com/oribetio/',
    title: 'footer.Instagram',
  },
  {
    icon: <IconTelegram size={SOCIAL_ICONS_SIZE} style={{ color: iconColor }} />,
    link: 'https://t.me/oribetofficial',
    title: 'footer.Telegram',
  },
]

const aboutUsItems: AboutUsItem[] = [
  {
    title: 'footer.Blog',
    url: AppRoutePath.BLOG(),
    isReactRoute: true,
  },
  {
    title: 'footer.HelpCenter',
    url: 'https://6746e917056f1eb95a1123bc.kb.help/',
    isReactRoute: false,
  },
  {
    title: 'footer.LiveSupport',
    isReactRoute: false,
  },
  {
    title: 'oribetMenu.promotions',
    url: AppRoutePath.PROMOTION(),
    isReactRoute: true,
  },
  {
    title: 'oribetMenu.affiliate',
    url: 'https://www.oribetpartners.com/',
    isReactRoute: false,
  },
]

export { aboutUsItems, getSocialIcons }
