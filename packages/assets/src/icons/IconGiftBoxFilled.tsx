import type { IReactIcon } from '@oribet/shared-types'

export const IconGiftBoxFilled = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fill="currentColor"
        d="M16.67 10.836v5.833c0 .46-.372.833-.833.833H4.171a.833.833 0 0 1-.834-.833v-5.833h13.334Zm-4.583-9.167a2.917 2.917 0 0 1 2.636 4.168l2.781-.001c.46 0 .833.373.833.833v2.5c0 .46-.373.833-.833.833h-15a.833.833 0 0 1-.833-.833v-2.5c0-.46.373-.833.833-.833h2.781a2.917 2.917 0 0 1 4.72-3.291 2.9 2.9 0 0 1 2.082-.876ZM7.921 3.336A1.25 1.25 0 0 0 7.8 5.83l.12.006h1.25v-1.25A1.25 1.25 0 0 0 8.04 3.34l-.12-.005Zm4.166 0-.12.005a1.25 1.25 0 0 0-1.124 1.124l-.006.12v1.25h1.25l.12-.005a1.25 1.25 0 0 0 0-2.489l-.12-.005Z"
      />
    </svg>
  )
}
