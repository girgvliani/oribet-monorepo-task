import type { IReactIcon } from '@oribet/shared-types'

export const IconX = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        xmlns="http://www.w3.org/2000/svg"
        d="M11.7916 2.04169L8.46043 5.84952L5.58026 2.04169H1.40881L6.39303 8.55915L1.66915 13.9584H3.69193L7.33783 9.79242L10.5242 13.9584H14.5923L9.39663 7.08949L13.8132 2.04169H11.7916ZM11.0821 12.7484L3.76953 3.18813H4.97159L12.2022 12.7484H11.0821Z"
        fill="currentColor"
      />
    </svg>
  )
}
