import { useTheme } from 'styled-components'
import type { IReactIcon } from '@oribet/shared-types'

export const IconCheckmarkRounded = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        // fill="#4D7C0F"
      />
      <path
        d="M10.6665 14.1139L16.7947 7.98569L17.7375 8.92849L10.6665 15.9995L6.42383 11.7569L7.36664 10.8141L10.6665 14.1139Z"
        fill={theme.colors.icon.contrast}
      />
    </svg>
  )
}
