import type { IReactIcon } from '@oribet/shared-types'

export const IconCountdown = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M12.2451 3.97872L13.2141 3.0098L14.1569 3.95261L13.1879 4.92153C14.009 5.94798 14.5 7.24999 14.5 8.66666C14.5 11.9804 11.8137 14.6667 8.5 14.6667C5.18629 14.6667 2.5 11.9804 2.5 8.66666C2.5 5.35295 5.18629 2.66666 8.5 2.66666C9.91667 2.66666 11.2187 3.15764 12.2451 3.97872ZM7.83333 5.33332V9.33332H9.16667V5.33332H7.83333ZM5.83333 0.666656H11.1667V1.99999H5.83333V0.666656Z"
        fill="currentColor"
      />
    </svg>
  )
}
