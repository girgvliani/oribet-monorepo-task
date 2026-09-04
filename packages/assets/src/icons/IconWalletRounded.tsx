import { useTheme } from 'styled-components'
import type { IReactIcon } from '@oribet/shared-types'

export const IconWalletRounded = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  const theme = useTheme()
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <rect
        width="24"
        height="24"
        rx="12"
        fill="currentColor"
        // fill="#3B4CC7"
      />
      <path
        d="M6 10.3333H17.4C17.7314 10.3333 18 10.5821 18 10.8889V16.4444C18 16.7513 17.7314 17 17.4 17H6.6C6.26863 17 6 16.7513 6 16.4444V10.3333ZM6.6 7H15.6V9.22222H6V7.55556C6 7.24873 6.26863 7 6.6 7ZM13.8 13.1111V14.2222H15.6V13.1111H13.8Z"
        fill={theme.colors.icon.contrast}
      />
    </svg>
  )
}
