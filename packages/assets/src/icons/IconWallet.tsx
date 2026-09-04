import type { IReactIcon } from '@oribet/shared-types'

export const IconWallet = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M1.33661 6H14.0033C14.3715 6 14.67 6.29848 14.67 6.66667V13.3333C14.67 13.7015 14.3715 14 14.0033 14H2.00328C1.63509 14 1.33661 13.7015 1.33661 13.3333V6ZM2.00328 2H12.0033V4.66667H1.33661V2.66667C1.33661 2.29848 1.63509 2 2.00328 2ZM10.0033 9.33333V10.6667H12.0033V9.33333H10.0033Z"
        fill="currentColor"
      />
    </svg>
  )
}
