import type { IReactIcon } from '@oribet/shared-types'

export const IconStatistic = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M2 7.99998H4.66667V14H2V7.99998ZM11.3333 5.33331H14V14H11.3333V5.33331ZM6.66667 1.33331H9.33333V14H6.66667V1.33331Z"
        fill="currentColor"
      />
    </svg>
  )
}
