import type { IReactIcon } from '@oribet/shared-types'

export const IconRecent = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8.00001C1.33333 4.31811 4.3181 1.33334 8 1.33334C11.6819 1.33334 14.6667 4.31811 14.6667 8.00001C14.6667 11.6819 11.6819 14.6667 8 14.6667ZM8.66667 8.00001V4.66668H7.33333V9.33334H11.3333V8.00001H8.66667Z"
        fill="currentColor"
      />
    </svg>
  )
}
