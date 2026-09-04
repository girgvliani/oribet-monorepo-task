import { useTheme } from 'styled-components'
import type { IReactIcon } from '@oribet/shared-types'

export const IconAccountRounded = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M16 17H8V15.9524C8 14.5059 9.11929 13.3333 10.5 13.3333H13.5C14.8807 13.3333 16 14.5059 16 15.9524V17ZM12 12.2857C10.3431 12.2857 9 10.8786 9 9.14286C9 7.4071 10.3431 6 12 6C13.6568 6 15 7.4071 15 9.14286C15 10.8786 13.6568 12.2857 12 12.2857Z"
        fill={theme.colors.icon.contrast}
      />
    </svg>
  )
}
