import type { IReactIcon } from '@oribet/shared-types'

export const IconInfo = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fill="currentColor"
        d="M8 14.667A6.667 6.667 0 1 1 8 1.333a6.667 6.667 0 0 1 0 13.334Zm-.667-7.334v4h1.334v-4H7.333Zm0-2.666V6h1.334V4.667H7.333Z"
      />
    </svg>
  )
}
