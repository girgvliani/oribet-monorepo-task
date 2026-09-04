import type { IReactIcon } from '@oribet/shared-types'

export const IconPromotion = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M14 6.70867V2.66667C14 2.29848 13.7015 2 13.3333 2H12.6667C11.3476 3.31909 8.86847 4.05819 7.33333 4.40854V11.5915C8.86847 11.9418 11.3476 12.6809 12.6667 14H13.3333C13.7015 14 14 13.7015 14 13.3333V9.29133C14.5751 9.14333 15 8.62127 15 8C15 7.37873 14.5751 6.85667 14 6.70867ZM3.33333 4.66667C2.59695 4.66667 2 5.26362 2 6V10C2 10.7364 2.59695 11.3333 3.33333 11.3333H4L4.66667 14.6667H6V4.66667H3.33333Z"
        fill="currentColor"
      />
    </svg>
  )
}
