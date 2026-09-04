import type { IReactIcon } from '@oribet/shared-types'

export const IconNotification = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M16.667 14.1667H18.3337V15.8333H1.66699V14.1667H3.33366V8.33333C3.33366 4.65143 6.31843 1.66667 10.0003 1.66667C13.6822 1.66667 16.667 4.65143 16.667 8.33333V14.1667ZM7.50033 17.5H12.5003V19.1667H7.50033V17.5Z"
        fill="currentColor"
        // fill="white"
      />
    </svg>
  )
}
