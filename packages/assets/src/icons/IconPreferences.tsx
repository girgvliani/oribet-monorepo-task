import type { IReactIcon } from '@oribet/shared-types'

export const IconPreferences = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M4.66667 2V4H2V5.33333H4.66667V7.33333H6.66667V2H4.66667ZM8 5.33333H14V4H8V5.33333ZM11.3333 8.66667V10.6667H14V12H11.3333V14H9.33333V8.66667H11.3333ZM8 12H2V10.6667H8V12Z"
        fill="currentColor"
      />
    </svg>
  )
}
